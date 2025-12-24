import json
import re
import sys
from datetime import datetime
from pathlib import Path

class ChatGPTParser:
    def __init__(self):
        self.messages = []

    def load_conversation(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def extract_messages(self, data):
        """Extracts messages from the ChatGPT JSON structure."""
        if isinstance(data, list):
            # Handle list of conversations
            for conv in data:
                self._process_mapping(conv.get('mapping', {}))
        elif isinstance(data, dict):
            # Handle single conversation
            self._process_mapping(data.get('mapping', {}))

    def _process_mapping(self, mapping):
        for node_id, node in mapping.items():
            message = node.get('message')
            if message and message.get('content') and message['content'].get('parts'):
                role = message['author']['role']
                # Only include user, assistant and tool messages
                if role in ['user', 'assistant', 'tool']:
                    content_parts = message['content']['parts']
                    text_content = ""
                    
                    # Handle attachments metadata if present
                    attachments = message.get('metadata', {}).get('attachments', [])
                    attachment_map = {a['id']: a for a in attachments}

                    for part in content_parts:
                        if isinstance(part, str):
                            text_content += part
                        elif isinstance(part, dict):
                            part_type = part.get('type') or part.get('content_type')
                            if part_type == 'text':
                                text_content += part.get('text', '')
                            elif part_type == 'image_asset_pointer':
                                asset_id = part.get('asset_pointer', '').replace('sediment://', '')
                                # Use asset_id directly if not in attachment_map (common for tool-generated images)
                                img_id = asset_id
                                if asset_id in attachment_map:
                                    img_id = attachment_map[asset_id].get('id', asset_id)
                                text_content += f"[[IMAGE:{img_id}]]"
                    
                    if text_content.strip():
                        # Extract content_references (for image_group)
                        content_refs = message.get('metadata', {}).get('content_references', [])
                        
                        self.messages.append({
                            'role': 'USER' if role == 'user' else 'LLM',
                            'content': text_content.strip(),
                            'timestamp': message.get('create_time', 0),
                            'content_references': content_refs
                        })

    def sort_messages(self):
        """Sorts messages by timestamp."""
        self.messages.sort(key=lambda x: x['timestamp'] if x['timestamp'] else 0)

    def render_markdown(self, text, content_refs=None):
        """A more robust markdown to HTML converter."""
        # 1. Escape HTML special characters first
        text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        # 2. Extract Code Blocks and replace with placeholders
        code_blocks = {}
        def store_code_block(match):
            lang = match.group(1) or ""
            code = match.group(2).strip()
            placeholder = f'<!--CODE_BLOCK_{len(code_blocks)}-->'
            code_blocks[placeholder] = f'<div class="code-container"><div class="code-header">{lang}</div><pre><code>{code}</code></pre></div>'
            return placeholder

        text = re.sub(r'```(\w*)\n?(.*?)```', store_code_block, text, flags=re.DOTALL)

        # 3. Handle image_group markers (after escaping)
        if content_refs:
            for ref in content_refs:
                if ref.get('type') == 'image_group':
                    matched_text = ref.get('matched_text', '')
                    escaped_matched_text = matched_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    
                    images = ref.get('images', [])
                    gallery_html = '<div class="image-gallery">'
                    for img_data in images:
                        img_result = img_data.get('image_result', {})
                        content_url = img_result.get('content_url', '')
                        title = img_result.get('title', 'Image')
                        source_url = img_result.get('url', '')
                        if content_url:
                            gallery_html += f'''<div class="gallery-item">
                                <img src="{content_url}" alt="{title}" loading="lazy">
                                <div class="image-caption">
                                    <a href="{source_url}" target="_blank" rel="noopener">{title}</a>
                                </div>
                            </div>'''
                    gallery_html += '</div>'
                    text = text.replace(escaped_matched_text, gallery_html)

        # 4. Tables
        def table_repl(match):
            rows = match.group(0).strip().split('\n')
            if len(rows) < 2: return match.group(0)
            
            html = '<table><thead><tr>'
            headers = [cell.strip() for cell in rows[0].split('|') if cell.strip()]
            for h in headers:
                html += f'<th>{h}</th>'
            html += '</tr></thead><tbody>'
            
            for row in rows[2:]:
                cells = [cell.strip() for cell in row.split('|') if cell.strip()]
                if not cells: continue
                html += '<tr>'
                for c in cells:
                    html += f'<td>{c}</td>'
                html += '</tr>'
            html += '</tbody></table>'
            return html

        text = re.sub(r'((?:\|.*\|(?:\n|$))+)', table_repl, text)

        # 5. Headings
        text = re.sub(r'^### (.*)$', r'<h3>\1</h3>', text, flags=re.MULTILINE)
        text = re.sub(r'^## (.*)$', r'<h2>\1</h2>', text, flags=re.MULTILINE)
        text = re.sub(r'^# (.*)$', r'<h1>\1</h1>', text, flags=re.MULTILINE)

        # 6. Horizontal Rules
        text = re.sub(r'^---+$', r'<hr>', text, flags=re.MULTILINE)

        # 7. Blockquotes
        def blockquote_repl(match):
            lines = match.group(0).strip().split('\n')
            content_lines = [re.sub(r'^&gt; ?', '', line).strip() for line in lines]
            html_parts = []
            for line in content_lines:
                if line:
                    line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
                    line = re.sub(r'`([^`]+)`', r'<code>\1</code>', line)
                    html_parts.append(f'<div class="quote-item">{line}</div>')
            return f'<div class="quote-group">{"".join(html_parts)}</div>'

        text = re.sub(r'((?:^&gt; .*(?:\n|$))+)', blockquote_repl, text, flags=re.MULTILINE)

        # 8. Lists (Unordered)
        def ul_repl(match):
            items = match.group(0).strip().split('\n')
            html = '<ul>'
            for item in items:
                content = re.sub(r'^[*-] ', '', item)
                html += f'<li>{content}</li>'
            html += '</ul>'
            return html
        
        text = re.sub(r'((?:^[*-] .*(?:\n|$))+)', ul_repl, text, flags=re.MULTILINE)

        # 9. Lists (Ordered)
        def ol_repl(match):
            items = match.group(0).strip().split('\n')
            html = '<ol>'
            for item in items:
                content = re.sub(r'^\d+\. ', '', item)
                html += f'<li>{content}</li>'
            html += '</ol>'
            return html
        
        text = re.sub(r'((?:^\d+\. .*(?:\n|$))+)', ol_repl, text, flags=re.MULTILINE)

        # 10. Inline Formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        
        # Handle links (and check if they are images)
        def link_repl(match):
            alt = match.group(1)
            url = match.group(2)
            if any(url.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.webp']) or 'estuary/content' in url:
                return f'<div class="image-container"><img src="{url}" alt="{alt}"><div class="image-caption">{alt}</div></div>'
            return f'<a href="{url}" target="_blank">{alt}</a>'
            
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link_repl, text)

        # 11. Images (Custom tag [[IMAGE:filename]])
        def image_repl(match):
            img_id = match.group(1)
            if Path(img_id).exists():
                return f'<div class="image-container"><img src="{img_id}" alt="{img_id}"><div class="image-caption">{img_id}</div></div>'
            else:
                return f'''<div class="image-placeholder">
                    <div class="placeholder-icon">🖼️</div>
                    <div class="placeholder-text">
                        <strong>Image: {img_id}</strong><br>
                        <small>Not available locally. Download from ChatGPT and save as "{img_id}" in this folder.</small>
                    </div>
                </div>'''
        
        text = re.sub(r'\[\[IMAGE:(.*?)\]\]', image_repl, text)

        # 12. Paragraphs
        parts = text.split('\n\n')
        new_parts = []
        for p in parts:
            p = p.strip()
            if not p: continue
            
            # If it's a placeholder, don't wrap in <p>
            if p in code_blocks:
                new_parts.append(code_blocks[p])
                continue
                
            if re.search(r'<(h1|h2|h3|div|table|ul|ol|blockquote|hr|pre)', p):
                # Still might have placeholders inside
                for placeholder, html in code_blocks.items():
                    p = p.replace(placeholder, html)
                new_parts.append(p)
            else:
                p = p.replace('\n', '<br>')
                # Restore placeholders that might be inline (though unlikely for code blocks)
                for placeholder, html in code_blocks.items():
                    p = p.replace(placeholder, html)
                new_parts.append(f'<p>{p}</p>')
        
        return '\n'.join(new_parts)

    def generate_html(self, title):
        """Generates the final HTML document."""
        css = """
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
            --bg-color: #ffffff;
            --text-color: #1a1a1a;
            --user-label-color: #2563eb;
            --llm-label-color: #059669;
            --border-color: #e5e7eb;
            --code-bg: #f8fafc;
            --quote-bg: #f1f5f9;
            --max-width: 850px;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: #f3f4f6;
            margin: 0;
            padding: 40px 20px;
        }

        .container {
            max-width: var(--max-width);
            margin: 0 auto;
            background: var(--bg-color);
            padding: 60px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        header {
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 40px;
            padding-bottom: 20px;
        }

        h1 { font-size: 2.25rem; font-weight: 700; margin: 0 0 1.5rem 0; color: #111827; }
        h2 { font-size: 1.5rem; font-weight: 600; margin: 2.5rem 0 1.25rem 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
        h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; }

        .message {
            margin-bottom: 48px;
            position: relative;
        }

        .role-label {
            font-weight: 700;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            display: block;
        }

        .role-USER { color: var(--user-label-color); }
        .role-LLM { color: var(--llm-label-color); }

        .content {
            font-size: 1.05rem;
        }

        /* Markdown Elements */
        p { margin: 0 0 1rem 0; }
        
        .code-container {
            background: var(--code-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin: 1.5rem 0;
            overflow: hidden;
        }

        .code-header {
            background: #e2e8f0;
            padding: 4px 12px;
            font-size: 0.75rem;
            font-family: 'JetBrains Mono', monospace;
            color: #475569;
            text-transform: uppercase;
        }

        pre {
            margin: 0;
            padding: 16px;
            overflow-x: auto;
        }

        code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            background: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
        }

        pre code {
            background: transparent;
            padding: 0;
        }

        .quote-group {
            margin: 1rem 0;
        }

        .quote-item {
            background: #f8fafc;
            padding: 12px 20px;
            margin-bottom: 8px;
            border-radius: 6px;
            border-left: 4px solid #e2e8f0;
            font-style: italic;
            color: #334155;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .quote-item:last-child { margin-bottom: 0; }

        .image-container {
            margin: 1.5rem 0;
            text-align: center;
        }

        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .image-caption {
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 8px;
        }

        .image-placeholder {
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            padding: 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: #475569;
            margin: 1.5rem 0;
            font-size: 0.9rem;
        }

        .image-placeholder .placeholder-icon {
            font-size: 3rem;
            opacity: 0.5;
        }

        .image-placeholder .placeholder-text {
            text-align: left;
            line-height: 1.6;
        }

        .image-placeholder .placeholder-text strong {
            color: #1e293b;
            font-size: 0.95rem;
        }

        .image-placeholder .placeholder-text small {
            color: #64748b;
            font-size: 0.85rem;
        }

        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 1.5rem 0;
        }

        .gallery-item {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .gallery-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }

        .gallery-item .image-caption {
            padding: 12px;
            font-size: 0.85rem;
            background: #f9fafb;
        }

        .gallery-item .image-caption a {
            color: #2563eb;
            text-decoration: none;
            word-break: break-word;
        }

        .gallery-item .image-caption a:hover {
            text-decoration: underline;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }

        th, td {
            border: 1px solid var(--border-color);
            padding: 12px;
            text-align: left;
        }

        th { background: #f8fafc; font-weight: 600; }

        hr {
            border: 0;
            border-top: 1px solid var(--border-color);
            margin: 3rem 0;
        }

        ul, ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }

        .timestamp {
            font-size: 0.75rem;
            color: #9ca3af;
            margin-top: 8px;
            display: block;
        }

        @media (max-width: 640px) {
            .container { padding: 30px 20px; }
            body { padding: 20px 10px; }
        }
        """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>{css}</style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{title}</h1>
        </header>
        <main>
"""
        for msg in self.messages:
            role_class = f"role-{msg['role']}"
            content_refs = msg.get('content_references', [])
            content_html = self.render_markdown(msg['content'], content_refs)
            time_str = datetime.fromtimestamp(msg['timestamp']).strftime('%Y-%m-%d %H:%M') if msg['timestamp'] else ""
            
            html += f"""
            <div class="message">
                <span class="role-label {role_class}">{msg['role']}</span>
                <div class="content">
                    {content_html}
                </div>
                {f'<span class="timestamp">{time_str}</span>' if time_str else ''}
            </div>
            """

        html += """
        </main>
    </div>
</body>
</html>
"""
        return html

    def save_html(self, html_content, output_path):
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

def main():
    input_path = Path("gptresponse.json")
    output_path = Path("conversation.html")

    if not input_path.exists():
        print(f" Error: {input_path} not found!")
        sys.exit(1)

    try:
        chat_parser = ChatGPTParser()
        
        print(f" Loading conversation from: {input_path}")
        data = chat_parser.load_conversation(input_path)

        print(" Extracting messages...")
        chat_parser.extract_messages(data)

        print(f" Found {len(chat_parser.messages)} messages")

        print(" Sorting messages by timestamp...")
        chat_parser.sort_messages()

        # Generate HTML
        title = data.get('title', 'ChatGPT Conversation')
        if isinstance(data, list) and len(data) > 0:
            title = data[0].get('title', 'ChatGPT Conversation')
            
        print(" Generating beautiful HTML...")
        html_content = chat_parser.generate_html(title)

        # Save HTML
        print(f" Saving to: {output_path}")
        chat_parser.save_html(html_content, output_path)

        print("\n Success! Open the HTML file in your browser to view the conversation.")

    except Exception as e:
        print(f" Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
