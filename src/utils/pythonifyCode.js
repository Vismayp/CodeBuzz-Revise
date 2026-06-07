const replacements = [
  [/\bconst\s+|\blet\s+|\bvar\s+/g, ""],
  [/\btrue\b/g, "True"],
  [/\bfalse\b/g, "False"],
  [/\bnull\b/g, "None"],
  [/\bundefined\b/g, "None"],
  [/\bInfinity\b/g, "float('inf')"],
  [/\b-Infinity\b/g, "-float('inf')"],
  [/===/g, "=="],
  [/!==/g, "!="],
  [/&&/g, " and "],
  [/\|\|/g, " or "],
  [/\bMath\.max\(/g, "max("],
  [/\bMath\.min\(/g, "min("],
  [/\bMath\.abs\(/g, "abs("],
  [/\bMath\.floor\(/g, "floor("],
  [/\bconsole\.log\(/g, "print("],
  [/\bnew Map\(\)/g, "{}"],
  [/\bnew Set\(\)/g, "set()"],
  [/\bnew Array\(([^)]+)\)\.fill\(([^)]+)\)/g, "[$2] * ($1)"],
  [/\b([A-Za-z_$][\w$]*)\.push\(/g, "$1.append("],
  [/\b([A-Za-z_$][\w$]*)\.shift\(\)/g, "$1.pop(0)"],
  [/\b([A-Za-z_$][\w$]*)\.slice\(([^)]*)\)/g, "$1[$2]"],
  [/\b([A-Za-z_$][\w$]*)\.sort\(\(([^)]*)\)\s*=>\s*[^)]*\)/g, "$1.sort()"],
  [/\b([A-Za-z_$][\w$]*)\.sort\(\)/g, "$1.sort()"],
  [/\b([A-Za-z_$][\w$]*)\.length\b/g, "len($1)"],
  [/\b([A-Za-z_$][\w$]*)\.has\(([^)]+)\)/g, "$2 in $1"],
  [/\b([A-Za-z_$][\w$]*)\.get\(([^)]+)\)/g, "$1.get($2)"],
  [/\b([A-Za-z_$][\w$]*)\.set\(([^,]+),\s*([^)]+)\)/g, "$1[$2] = $3"],
];

const stripSemicolon = (line) => line.replace(/;\s*$/, "");

const convertExpression = (value) => {
  let converted = value;
  converted = converted.replace(/\s+\/\/\s*/g, "  # ");
  for (const [pattern, replacement] of replacements) {
    converted = converted.replace(pattern, replacement);
  }
  converted = converted.replace(/!([A-Za-z_$][\w$]*)/g, "not $1");
  converted = converted.replace(/\bthis\./g, "self.");
  converted = converted.replace(/\.\.\.([A-Za-z_$][\w$]*)/g, "*$1");
  converted = converted.replace(/\b([A-Za-z_$][\w$]*)\+\+$/g, "$1 += 1");
  converted = converted.replace(/\b([A-Za-z_$][\w$]*)--$/g, "$1 -= 1");
  return stripSemicolon(converted.trim());
};

const splitLeadingClosers = (line) => {
  let remaining = line.trimStart();
  let closers = 0;
  while (remaining.startsWith("}")) {
    closers += 1;
    remaining = remaining.slice(1).trimStart();
  }
  return { closers, remaining };
};

const convertForLoop = (line) => {
  const ofMatch = line.match(
    /^for\s*\(\s*(?:const|let|var)?\s*([A-Za-z_$][\w$]*)\s+of\s+(.+)\)\s*\{?$/
  );
  if (ofMatch) return `for ${ofMatch[1]} in ${convertExpression(ofMatch[2])}:`;

  const increasing = line.match(
    /^for\s*\(\s*(?:let|var)?\s*([A-Za-z_$][\w$]*)\s*=\s*([^;]+);\s*\1\s*<\s*([^;]+);\s*\1\+\+\s*\)\s*\{?$/
  );
  if (increasing) {
    return `for ${increasing[1]} in range(${convertExpression(
      increasing[2]
    )}, ${convertExpression(increasing[3])}):`;
  }

  const decreasing = line.match(
    /^for\s*\(\s*(?:let|var)?\s*([A-Za-z_$][\w$]*)\s*=\s*([^;]+);\s*\1\s*>=\s*([^;]+);\s*\1--\s*\)\s*\{?$/
  );
  if (decreasing) {
    return `for ${decreasing[1]} in range(${convertExpression(
      decreasing[2]
    )}, ${convertExpression(decreasing[3])} - 1, -1):`;
  }

  const greaterThan = line.match(
    /^for\s*\(\s*(?:let|var)?\s*([A-Za-z_$][\w$]*)\s*=\s*([^;]+);\s*\1\s*>\s*([^;]+);\s*\1--\s*\)\s*\{?$/
  );
  if (greaterThan) {
    return `for ${greaterThan[1]} in range(${convertExpression(
      greaterThan[2]
    )}, ${convertExpression(greaterThan[3])}, -1):`;
  }

  const inclusiveIncreasing = line.match(
    /^for\s*\(\s*(?:let|var)?\s*([A-Za-z_$][\w$]*)\s*=\s*([^;]+);\s*\1\s*<=\s*([^;]+);\s*\1\+\+\s*\)\s*\{?$/
  );
  if (inclusiveIncreasing) {
    return `for ${inclusiveIncreasing[1]} in range(${convertExpression(
      inclusiveIncreasing[2]
    )}, ${convertExpression(inclusiveIncreasing[3])} + 1):`;
  }

  return `${convertExpression(line.replace(/\{\s*$/, ""))}:`;
};

const convertLine = (line, context) => {
  const trimmed = line.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `#${trimmed.slice(2)}`;

  const classMatch = trimmed.match(/^class\s+([A-Za-z_$][\w$]*)\s*\{?$/);
  if (classMatch) {
    context.inClass = true;
    return `class ${classMatch[1]}:`;
  }

  const constructorMatch = trimmed.match(/^constructor\s*\(([^)]*)\)\s*\{?$/);
  if (constructorMatch) {
    return `def __init__(self${constructorMatch[1].trim() ? `, ${constructorMatch[1]}` : ""}):`;
  }

  const functionMatch = trimmed.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{?$/);
  if (functionMatch) return `def ${functionMatch[1]}(${functionMatch[2]}):`;

  const methodMatch = trimmed.match(/^([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{?$/);
  if (context.inClass && methodMatch) {
    return `def ${methodMatch[1]}(self${methodMatch[2].trim() ? `, ${methodMatch[2]}` : ""}):`;
  }

  const ifMatch = trimmed.match(/^if\s*\((.*)\)\s*\{?$/);
  if (ifMatch) return `if ${convertExpression(ifMatch[1])}:`;

  const inlineIfReturn = trimmed.match(/^if\s*\((.*)\)\s*return\s+(.+);?$/);
  if (inlineIfReturn) {
    return `if ${convertExpression(inlineIfReturn[1])}:\n    return ${convertExpression(inlineIfReturn[2])}`;
  }

  const elseIfMatch = trimmed.match(/^else\s+if\s*\((.*)\)\s*\{?$/);
  if (elseIfMatch) return `elif ${convertExpression(elseIfMatch[1])}:`;

  if (/^else\s*\{?$/.test(trimmed)) return "else:";

  const whileMatch = trimmed.match(/^while\s*\((.*)\)\s*\{?$/);
  if (whileMatch) return `while ${convertExpression(whileMatch[1])}:`;

  if (trimmed.startsWith("for ")) return convertForLoop(trimmed);

  return convertExpression(trimmed.replace(/\{\s*$/, ""));
};

export function pythonifyCode(code) {
  if (typeof code !== "string") return code;
  if (/^\s*(def|class|from |import |#)/m.test(code) && !/\bfunction\b|=>|\bconst\b|\blet\b/.test(code)) {
    return code;
  }

  const output = [];
  const context = { inClass: false };
  let indent = 0;

  for (const rawLine of code.split("\n")) {
    const { closers, remaining } = splitLeadingClosers(rawLine);
    indent = Math.max(0, indent - closers);
    if (!remaining) continue;

    const converted = convertLine(remaining, context);
    if (converted) {
      output.push(
        converted
          .split("\n")
          .map((line) => `${"    ".repeat(indent)}${line}`)
          .join("\n")
      );
    }

    const opens = (remaining.match(/\{/g) || []).length;
    const inlineClosers = (remaining.match(/\}/g) || []).length;
    indent = Math.max(0, indent + opens - inlineClosers);
  }

  return output
    .join("\n")
    .replace(/\bfloor\(([^)]+)\)/g, "($1 // 1)")
    .replace(/\n{3,}/g, "\n\n");
}

export function asPythonFirstCode(code) {
  if (typeof code !== "string") return code;

  return {
    python: pythonifyCode(code),
    javascript: code,
  };
}
