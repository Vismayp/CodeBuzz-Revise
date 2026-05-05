const practiceNote = String.raw`

### Mastery Habit

For every SSH command, ask three questions:

| Question | Why it matters |
|---|---|
| Who am I logging in as? | The remote username controls permissions and home directory. |
| Which host am I trusting? | Host keys protect you from connecting to the wrong machine. |
| Which credential am I presenting? | Passwords, keys, certificates, and agents behave differently. |
`;

const topics = [
  {
    id: "ssh-foundations",
    title: "Foundations",
    description: "What SSH is, how the protocol works, and the beginner mental model.",
    icon: "BookOpen",
    sections: [
      {
        id: "what-is-ssh",
        title: "What SSH Solves",
        content: String.raw`
SSH means Secure Shell. It is the standard way to securely log in to remote systems, run commands, copy files, tunnel traffic, and automate server operations over an untrusted network.

Before SSH, tools like telnet and rlogin sent credentials and session data in clear text. SSH wraps the session in encryption, authenticates the server, authenticates the user, and protects command output from tampering.

Beginner translation: SSH lets your laptop open a secure terminal on another computer.

| Concept | Beginner meaning | Practical example |
|---|---|---|
| Client | The machine starting the connection | Your laptop running ssh |
| Server | The machine accepting SSH | A Linux VM, VPS, router, or Git host |
| Host key | Server identity | "Am I really talking to this server?" |
| User key | User identity | "Can I prove I am allowed in?" |
| Session | Encrypted channel | Shell, command, file copy, or tunnel |

SSH is not only a login tool. It is also a secure transport used by Git, rsync, SFTP, Ansible, CI deployments, bastion hosts, database tunnels, and remote development tools.

<details>
<summary>Beginner check</summary>

If you run ssh alice@example.com, alice is the remote username and example.com is the server name. Your local username does not automatically matter unless you omit the remote username.

</details>
        `,
        diagram: String.raw`
graph LR
  Laptop[SSH client] -->|encrypted TCP session, usually port 22| Server[SSH server]
  Server --> HostKey[Server host key proves server identity]
  Laptop --> UserAuth[User auth proves client identity]
  UserAuth --> Shell[Remote shell or command]
        `,
        code: String.raw`ssh user@example.com
ssh user@192.0.2.10
ssh -p 2222 user@example.com
ssh user@example.com "hostname && uptime"`,
        language: "bash",
      },
      {
        id: "protocol-flow",
        title: "Protocol Flow",
        content: String.raw`
An SSH connection has a predictable flow. Understanding it makes troubleshooting much less mysterious.

1. The client opens a TCP connection to the server.
2. Both sides exchange protocol versions.
3. They negotiate algorithms for key exchange, encryption, MAC, compression, and host-key type.
4. The server proves its identity with its host key.
5. The client checks that host key against known_hosts.
6. The client authenticates the user with a password, public key, certificate, keyboard-interactive method, or another allowed method.
7. SSH opens one or more encrypted channels: shell, command, port forward, SFTP, subsystem, or agent forwarding.

The most important distinction:

| Identity | Stored where | Purpose |
|---|---|---|
| Server host key | Server: /etc/ssh/ssh_host_*; client: known_hosts | Prevents server impersonation |
| User key | Client private key; server authorized_keys | Lets a user log in without a password |

Host keys and user keys are different. Do not mix them up.

<details>
<summary>Why first connection asks "Are you sure?"</summary>

Your client has never seen that server's host key before. SSH asks you to decide whether to trust it. In production, verify the fingerprint through a trusted channel before accepting.

</details>
        `,
        diagram: String.raw`
sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: TCP connect
  C->>S: Protocol version and algorithms
  S->>C: Host key proof
  C->>C: Check known_hosts
  C->>S: User authentication
  S->>C: Auth success
  C->>S: Open session channel
  S->>C: Shell, command, SFTP, or tunnel
        `,
        code: String.raw`ssh -vvv user@example.com

# Read the debug output in phases:
# 1. connecting
# 2. key exchange
# 3. host key verification
# 4. offered identities
# 5. authentication result
# 6. session setup`,
        language: "bash",
      },
      {
        id: "installation-setup",
        title: "Installation and Setup",
        content: String.raw`
OpenSSH is available on Linux, macOS, Windows, BSD systems, network appliances, cloud images, Git hosting platforms, and many embedded devices.

Client tools:

| Tool | Purpose |
|---|---|
| ssh | Remote login and commands |
| ssh-keygen | Generate and inspect keys |
| ssh-agent | Hold decrypted private keys in memory |
| ssh-add | Add keys to an agent |
| scp | Copy files over SSH |
| sftp | Interactive file transfer |
| ssh-keyscan | Fetch host public keys |
| ssh-copy-id | Install your public key on a server |

Server components:

| Component | Purpose |
|---|---|
| sshd | SSH server daemon |
| /etc/ssh/sshd_config | Server policy |
| /etc/ssh/ssh_host_* | Server host keys |
| ~/.ssh/authorized_keys | User public keys allowed to log in |

Common install commands:

~~~bash
# Debian/Ubuntu
sudo apt update
sudo apt install openssh-client openssh-server

# RHEL/Fedora
sudo dnf install openssh-clients openssh-server

# macOS client is built in; server is Remote Login in System Settings
ssh -V

# Windows PowerShell
ssh -V
Get-Service sshd
~~~

Enable the server where appropriate:

~~~bash
sudo systemctl enable --now ssh
sudo systemctl status ssh

# Some distributions name the unit sshd
sudo systemctl enable --now sshd
sudo systemctl status sshd
~~~

<details>
<summary>Windows note</summary>

Modern Windows includes OpenSSH Client as an optional feature on many installations. OpenSSH Server configuration commonly lives under ProgramData\ssh\sshd_config.

</details>
        `,
        code: String.raw`ssh -V
which ssh
which sshd
sshd -T | head
systemctl status ssh
systemctl status sshd`,
        language: "bash",
      },
    ],
  },
  {
    id: "keys-and-auth",
    title: "Keys and Authentication",
    description: "Generate keys, understand agents, and choose secure authentication methods.",
    icon: "Key",
    sections: [
      {
        id: "key-types",
        title: "Key Types and Choices",
        content: String.raw`
Public-key authentication is the normal professional SSH workflow. You keep a private key on your client and place the matching public key on the server.

Modern key choices:

| Key type | Recommendation | Notes |
|---|---|---|
| Ed25519 | Best default for most users | Small, fast, modern, widely supported |
| ECDSA | Acceptable when required | Depends on curve support and policy |
| RSA 3072/4096 | Compatibility fallback | Use SHA-2 signatures; avoid old ssh-rsa/SHA-1 workflows |
| DSA | Do not use | Deprecated/removed in modern OpenSSH |

Private key rule: never share it, never paste it into tickets, never commit it. Public key rule: safe to copy to servers and Git hosts.

Create a strong default key:

~~~bash
ssh-keygen -t ed25519 -a 100 -C "your.email@example.com"
~~~

The passphrase protects the private key at rest. If your laptop is stolen, an encrypted key gives you a second layer of defense.

<details>
<summary>What does -a 100 do?</summary>

For modern OpenSSH private-key files, -a controls the number of key derivation rounds used to protect the key with your passphrase. Higher values make offline guessing slower.

</details>
        `,
        code: String.raw`# Recommended personal key
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_ed25519 -C "you@example.com"

# Compatibility fallback
ssh-keygen -t rsa -b 4096 -a 100 -f ~/.ssh/id_rsa_compat -C "you@example.com"

# Inspect public key fingerprint
ssh-keygen -lf ~/.ssh/id_ed25519.pub

# Inspect private key fingerprint without revealing it
ssh-keygen -lf ~/.ssh/id_ed25519`,
        language: "bash",
      },
      {
        id: "authorized-keys",
        title: "Installing Public Keys",
        content: String.raw`
The server decides who can log in by reading the target user's authorized_keys file.

For user deploy on server app01:

| Path | Meaning |
|---|---|
| /home/deploy/.ssh/authorized_keys | Public keys allowed to log in as deploy |
| /home/deploy/.ssh | Must not be writable by other users |
| /home/deploy | Usually must not be group/world writable |

The safe install path:

~~~bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@app01.example.com
~~~

Manual install:

~~~bash
ssh deploy@app01.example.com
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
~~~

Each line in authorized_keys is one public key. You can add restrictions before the key:

~~~text
from="203.0.113.10",no-agent-forwarding,no-X11-forwarding ssh-ed25519 AAAA... laptop
~~~

Useful restrictions:

| Restriction | Effect |
|---|---|
| from="IP_or_CIDR" | Only allow the key from certain sources |
| command="..." | Force a command instead of an interactive shell |
| no-port-forwarding | Block tunnels for that key |
| no-agent-forwarding | Block agent forwarding |
| no-pty | Block interactive terminal allocation |

<details>
<summary>Common failure</summary>

If public key auth mysteriously fails, check file ownership and permissions first. OpenSSH intentionally ignores insecure key files because another user could modify them.

</details>
        `,
        code: String.raw`# On the server as the target user
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
ls -ld ~ ~/.ssh ~/.ssh/authorized_keys

# On the client
ssh -i ~/.ssh/id_ed25519 deploy@app01.example.com
ssh -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 deploy@app01.example.com`,
        language: "bash",
      },
      {
        id: "agent-and-passphrases",
        title: "ssh-agent and Passphrases",
        content: String.raw`
ssh-agent stores decrypted private keys in memory so you do not type the key passphrase for every connection.

The private key still stays on disk encrypted. The agent only holds a usable decrypted form for your login session or for a configured lifetime.

Core commands:

~~~bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -l
ssh-add -D
~~~

Safer habits:

| Habit | Why |
|---|---|
| Use passphrases on human keys | Protects keys at rest |
| Use separate keys per role | Easy rotation and limited blast radius |
| Use AddKeysToAgent intentionally | Convenience with explicit control |
| Use agent lifetimes for sensitive keys | Limits long-lived exposure |
| Avoid agent forwarding unless needed | Remote hosts can ask your agent to sign |

Agent forwarding lets a remote host use your local agent to authenticate onward without copying your key. That is convenient for jump hosts, but risky on untrusted servers.

<details>
<summary>Agent forwarding mental model</summary>

Your private key is not copied to the remote machine, but the remote machine can request signatures from your local agent while the forwarded connection exists. Use it only through trusted hops.

</details>
        `,
        code: String.raw`ssh-add -t 4h ~/.ssh/id_ed25519
ssh-add -l
ssh -A bastion.example.com

# Prefer ProxyJump instead of agent forwarding for many workflows
ssh -J bastion.example.com app01.internal`,
        language: "bash",
      },
      {
        id: "certificates-fido",
        title: "Certificates and Hardware Keys",
        content: String.raw`
SSH certificates solve a scaling problem: instead of putting every user's public key on every server, servers trust a Certificate Authority (CA), and the CA signs short-lived user keys.

Certificate-based SSH is common in mature infrastructure because it supports:

- short-lived access.
- central approval and audit.
- principal-based identity such as alice, deploy, or production-admin.
- less authorized_keys sprawl.
- rapid revocation by changing CA policy or key revocation lists.

Hardware-backed SSH keys add phishing-resistant protection. OpenSSH supports FIDO/U2F security keys through key types such as sk-ssh-ed25519@openssh.com when hardware and platform support are available.

| Method | Best for |
|---|---|
| Plain public keys | Small teams, simple servers, Git access |
| Hardware-backed keys | Admin access, high-value accounts |
| SSH certificates | Larger fleets, short-lived access, central policy |
| Single sign-on gateways | Enterprise access control and audit |

<details>
<summary>Mastery point</summary>

A certificate is not the same as a public key. A public key says "this private key exists." A certificate says "a trusted CA says this key may act as these principals until this time."

</details>
        `,
        code: String.raw`# Generate a hardware-backed key if supported
ssh-keygen -t ed25519-sk -f ~/.ssh/id_ed25519_sk -C "you@example.com security key"

# Inspect a user certificate
ssh-keygen -L -f ~/.ssh/id_ed25519-cert.pub

# Example server trust anchor
# /etc/ssh/sshd_config
TrustedUserCAKeys /etc/ssh/user_ca_keys.pem`,
        language: "bash",
      },
    ],
  },
  {
    id: "client-mastery",
    title: "Client Mastery",
    description: "Daily commands, ~/.ssh/config, multiplexing, aliases, and Git over SSH.",
    icon: "Terminal",
    sections: [
      {
        id: "daily-commands",
        title: "Daily SSH Commands",
        content: String.raw`
A good SSH user can log in, run one-off commands, copy files, inspect failures, and exit cleanly.

Daily patterns:

| Need | Command |
|---|---|
| Login | ssh user@host |
| Run command remotely | ssh user@host "uptime" |
| Use a custom port | ssh -p 2222 user@host |
| Use a specific key | ssh -i ~/.ssh/key user@host |
| Allocate terminal for sudo/top | ssh -t user@host "sudo systemctl status nginx" |
| Do not allocate terminal | ssh -T git@github.com |
| Verbose debugging | ssh -vvv user@host |
| Exit a stuck session | Enter, then ~. |

The escape sequence works only at the beginning of a new line. Press Enter, then type tilde-dot.

<details>
<summary>Why ssh -T for Git?</summary>

Git over SSH does not need an interactive terminal. -T disables pseudo-terminal allocation and keeps the session focused on the Git protocol.

</details>
        `,
        code: String.raw`ssh admin@server.example.com
ssh admin@server.example.com "df -h && free -m"
ssh -t admin@server.example.com "sudo journalctl -u nginx -n 100"
ssh -vvv admin@server.example.com
ssh -T git@github.com`,
        language: "bash",
      },
      {
        id: "ssh-config",
        title: "Client Config File",
        content: String.raw`
The client config file turns long commands into named profiles.

Config locations:

| File | Scope |
|---|---|
| ~/.ssh/config | Current user |
| /etc/ssh/ssh_config | System default |

Example:

~~~sshconfig
Host prod-app
  HostName app01.example.com
  User deploy
  Port 22
  IdentityFile ~/.ssh/id_ed25519_prod
  IdentitiesOnly yes
  ServerAliveInterval 30
  ServerAliveCountMax 3

Host *.internal
  User ubuntu
  ProxyJump bastion

Host bastion
  HostName bastion.example.com
  User ops
  IdentityFile ~/.ssh/id_ed25519_ops
~~~

Now ssh prod-app is enough.

Important directives:

| Directive | Purpose |
|---|---|
| Host | Alias or pattern |
| HostName | Real DNS name or IP |
| User | Remote username |
| Port | Remote SSH port |
| IdentityFile | Private key path |
| IdentitiesOnly | Only offer configured identities |
| ProxyJump | Connect through a bastion |
| ForwardAgent | Enable/disable agent forwarding |
| LocalForward | Local port tunnel |
| StrictHostKeyChecking | Host-key trust behavior |

<details>
<summary>Mastery habit</summary>

Use Host aliases for repeated work, but keep them readable. Future you should know exactly which environment prod-app reaches.

</details>
        `,
        code: String.raw`ssh -G prod-app | less
ssh prod-app
scp ./deploy.tar.gz prod-app:/tmp/
sftp prod-app`,
        language: "bash",
      },
      {
        id: "multiplexing",
        title: "Connection Multiplexing",
        content: String.raw`
Connection multiplexing reuses one SSH TCP connection for later sessions. It makes repeated commands much faster and reduces repeated authentication.

Client config:

~~~sshconfig
Host *
  ControlMaster auto
  ControlPath ~/.ssh/control-%C
  ControlPersist 10m
~~~

How it works:

1. First SSH connection creates a master connection.
2. Later ssh/scp/sftp commands to the same target reuse the master.
3. ControlPersist keeps the master alive briefly after the last session exits.

Benefits:

- Faster Git operations over SSH.
- Faster Ansible-style repeated commands.
- Less repeated key unlocking.

Risks:

- A still-open master connection may outlive your terminal.
- Shared machines need careful ControlPath permissions.
- Some bastion policies may intentionally disable long-lived sessions.

<details>
<summary>ControlPath %C</summary>

%C hashes the connection tuple, avoiding long Unix socket path problems and reducing filename collisions.

</details>
        `,
        code: String.raw`ssh -O check prod-app
ssh -O exit prod-app

time ssh prod-app "true"
time ssh prod-app "true"`,
        language: "bash",
      },
      {
        id: "git-over-ssh",
        title: "Git over SSH",
        content: String.raw`
Git commonly uses SSH for authentication to hosting platforms.

SSH Git URL forms:

| Form | Example |
|---|---|
| SCP-like | git@github.com:owner/repo.git |
| URI | ssh://git@github.com/owner/repo.git |

The remote username is usually git, not your GitHub/GitLab username. The platform identifies you by the SSH key you present.

Recommended workflow:

1. Generate a dedicated key for Git hosting.
2. Add the public key to your Git provider.
3. Add a Host entry if you use multiple accounts.
4. Test with ssh -T.
5. Clone or switch remotes to SSH.

Multiple account pattern:

~~~sshconfig
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_work
  IdentitiesOnly yes

Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_personal
  IdentitiesOnly yes
~~~

Then use git@github-work:company/repo.git or git@github-personal:you/repo.git.
        `,
        code: String.raw`ssh -T git@github.com
git clone git@github.com:owner/repo.git
git remote -v
git remote set-url origin git@github.com:owner/repo.git

# Debug which key Git uses
GIT_SSH_COMMAND="ssh -vvv" git ls-remote origin`,
        language: "bash",
      },
    ],
  },
  {
    id: "server-hardening",
    title: "Server Hardening",
    description: "Configure sshd, reduce attack surface, and avoid locking yourself out.",
    icon: "Shield",
    sections: [
      {
        id: "sshd-config-model",
        title: "sshd_config Mental Model",
        content: String.raw`
sshd_config controls the server. Client config controls your laptop. They are different files with different jobs.

Common server locations:

| Platform | Common path |
|---|---|
| Linux | /etc/ssh/sshd_config |
| Linux drop-ins | /etc/ssh/sshd_config.d/*.conf |
| Windows OpenSSH Server | ProgramData\ssh\sshd_config |

Before changing production SSH:

1. Keep one working SSH session open.
2. Edit config in a second session.
3. Validate syntax.
4. Reload, not restart, when possible.
5. Test a new login before closing the old session.

Validation commands:

~~~bash
sudo sshd -t
sudo sshd -T
sudo systemctl reload ssh
~~~

sshd_config has first-match behavior for some options and special Match blocks. Always inspect the effective config if behavior surprises you.

<details>
<summary>Do not lock yourself out</summary>

When changing auth settings on a remote server, keep a root console, cloud serial console, or existing SSH session available until a fresh login succeeds.

</details>
        `,
        code: String.raw`sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d-%H%M%S)
sudoedit /etc/ssh/sshd_config
sudo sshd -t
sudo sshd -T | less
sudo systemctl reload ssh || sudo systemctl reload sshd`,
        language: "bash",
      },
      {
        id: "hardening-baseline",
        title: "Hardening Baseline",
        content: String.raw`
A good SSH baseline removes unnecessary login paths while preserving an emergency recovery path.

Typical hardened settings:

~~~sshconfig
Protocol 2
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
MaxAuthTries 3
LoginGraceTime 30
LogLevel VERBOSE
AllowUsers deploy ops
~~~

Interpretation:

| Setting | Effect |
|---|---|
| PermitRootLogin no | Admins log in as themselves, then sudo |
| PasswordAuthentication no | Blocks password guessing |
| KbdInteractiveAuthentication no | Blocks keyboard-interactive password paths |
| AllowUsers | Reduces who can even attempt login |
| MaxAuthTries 3 | Limits repeated auth attempts per connection |
| LogLevel VERBOSE | Logs key fingerprints for audit |

Do not blindly paste hardening config. Some environments require SFTP, port forwarding, certificates, PAM, or break-glass password access.

<details>
<summary>Production rule</summary>

Harden by policy, not superstition. Each disabled feature should map to a risk you actually want to remove.

</details>
        `,
        code: String.raw`# Test effective values
sudo sshd -T | rg "permitrootlogin|passwordauthentication|kbdinteractiveauthentication|allowusers|allowtcpforwarding|loglevel"

# Watch logs while testing from another terminal
sudo journalctl -u ssh -f
sudo journalctl -u sshd -f`,
        language: "bash",
      },
      {
        id: "firewall-and-fail2ban",
        title: "Network Controls",
        content: String.raw`
SSH hardening is not only sshd_config. Network controls reduce who can reach the daemon.

Layered controls:

| Layer | Examples |
|---|---|
| Cloud firewall | Security groups, firewall rules, source IP allowlists |
| Host firewall | ufw, firewalld, nftables |
| Rate limiting | fail2ban, sshguard, firewall rate rules |
| Private access | VPN, WireGuard, Tailscale, Zero Trust access |
| Bastion | One audited entry point to private hosts |

Changing the SSH port can reduce log noise, but it is not real authentication security. Use it as friction, not as your main defense.

Better than public SSH:

1. Keep production hosts on private networks.
2. Require VPN or identity-aware access.
3. Use a bastion or SSH certificate authority.
4. Log every administrative login.
5. Rotate access when people or automation roles change.

<details>
<summary>Allowlist warning</summary>

If your home IP changes often, a strict source allowlist can lock you out. Keep a tested recovery path.

</details>
        `,
        code: String.raw`# UFW example
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
sudo ufw status verbose

# firewalld example
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="203.0.113.10" service name="ssh" accept'
sudo firewall-cmd --reload

# fail2ban
sudo fail2ban-client status sshd`,
        language: "bash",
      },
      {
        id: "logging-audit",
        title: "Logging and Audit",
        content: String.raw`
SSH logs answer who connected, from where, using which method, and sometimes which key fingerprint.

Common log locations:

| System | Command or path |
|---|---|
| systemd Linux | journalctl -u ssh or journalctl -u sshd |
| Debian/Ubuntu file logs | /var/log/auth.log |
| RHEL-like file logs | /var/log/secure |
| Windows OpenSSH | Event Viewer and OpenSSH logs |

What to watch:

- Accepted publickey for user from IP.
- Failed password for invalid user.
- Too many authentication failures.
- Connection closed by authenticating user.
- Bad ownership or modes for authorized_keys.
- User not allowed because not listed in AllowUsers.

For incident response:

1. Preserve logs before rotating or rebuilding.
2. Identify source IPs and usernames.
3. Identify accepted logins, not only failures.
4. Rotate keys and disable suspicious accounts.
5. Review authorized_keys, sudoers, cron, shell startup files, and running processes.
        `,
        code: String.raw`sudo journalctl -u ssh --since "24 hours ago"
sudo journalctl -u sshd --since "24 hours ago"
sudo rg "Accepted|Failed|Invalid|publickey|password" /var/log/auth.log /var/log/secure

# Show recent successful logins
last -a
lastlog`,
        language: "bash",
      },
    ],
  },
  {
    id: "file-transfer",
    title: "File Transfer",
    description: "scp, sftp, rsync, permissions, and safe deployment copies.",
    icon: "FileJson",
    sections: [
      {
        id: "scp-sftp-rsync",
        title: "scp vs sftp vs rsync",
        content: String.raw`
SSH provides several file-transfer workflows.

| Tool | Best for | Notes |
|---|---|---|
| scp | Simple copy commands | Familiar cp-like syntax |
| sftp | Interactive file management | Good for browsing remote files |
| rsync over SSH | Efficient sync and deploys | Copies only differences |

Use scp for quick movement, sftp for interactive remote file work, and rsync for repeatable syncs or large trees.

Examples:

~~~bash
scp app.tar.gz deploy@app01:/tmp/
scp deploy@app01:/var/log/app.log ./app.log
sftp deploy@app01
rsync -avz --delete ./dist/ deploy@app01:/srv/app/current/
~~~

Rsync flags:

| Flag | Meaning |
|---|---|
| -a | Archive mode: recursive, permissions, times |
| -v | Verbose |
| -z | Compress during transfer |
| --delete | Remove remote files absent locally |
| --dry-run | Preview changes |

<details>
<summary>Deployment warning</summary>

Use rsync --dry-run before --delete. A reversed source/destination can remove the wrong tree.

</details>
        `,
        code: String.raw`scp -P 2222 ./backup.sql admin@db01:/tmp/
sftp admin@server.example.com

rsync -avz --dry-run ./dist/ deploy@app01:/srv/app/
rsync -avz --delete ./dist/ deploy@app01:/srv/app/`,
        language: "bash",
      },
      {
        id: "permissions-ownership",
        title: "Permissions and Ownership",
        content: String.raw`
Many SSH file-transfer problems are permission problems wearing a network costume.

Key ideas:

| Concept | Meaning |
|---|---|
| Remote user | Determines write permission |
| Target directory owner | Must allow writes or require sudo |
| umask | Controls default permissions for new files |
| sudo over SSH | Needed when deploying into root-owned paths |

Safe deployment pattern:

1. Upload to a writable staging path such as /tmp or /home/deploy/releases.
2. Verify checksum or unpack.
3. Move into privileged location with sudo.
4. Restart service with sudo.

Do not give a deployment user full root access unless necessary. Prefer limited sudo rules for exact commands.
        `,
        code: String.raw`# Upload as deploy
scp ./app.tar.gz deploy@app01:/tmp/app.tar.gz

# Move with sudo on the server
ssh deploy@app01 "sudo install -o root -g root -m 0644 /tmp/app.tar.gz /srv/releases/app.tar.gz"

# Limited command pattern
ssh deploy@app01 "sudo systemctl reload myapp"`,
        language: "bash",
      },
    ],
  },
  {
    id: "tunnels-and-proxies",
    title: "Tunnels and Proxies",
    description: "Local forwards, remote forwards, dynamic SOCKS, bastions, and jump hosts.",
    icon: "Network",
    sections: [
      {
        id: "local-forwarding",
        title: "Local Port Forwarding",
        content: String.raw`
Local forwarding opens a port on your client and sends traffic through SSH to a destination reachable from the server.

Pattern:

~~~bash
ssh -L local_port:target_host:target_port user@ssh_server
~~~

Example: access a private Postgres database through a bastion:

~~~bash
ssh -L 5433:db.internal:5432 ops@bastion.example.com
psql -h localhost -p 5433 -U app
~~~

Mental model:

| Piece | Meaning |
|---|---|
| localhost:5433 | Port opened on your laptop |
| bastion.example.com | SSH server carrying encrypted traffic |
| db.internal:5432 | Destination as seen from the bastion |

Use cases:

- Database access without public database exposure.
- Viewing internal admin dashboards.
- Testing services inside a private network.
- Temporary encrypted access during debugging.

<details>
<summary>Security note</summary>

The database sees the connection coming from the bastion side, not directly from your laptop. Logs and access rules should account for that.

</details>
        `,
        diagram: String.raw`
graph LR
  App[Local client app] -->|localhost:5433| LocalSSH[SSH client]
  LocalSSH -->|encrypted tunnel| Bastion[Bastion SSH server]
  Bastion -->|db.internal:5432| DB[(Private database)]
        `,
        code: String.raw`ssh -N -L 8080:localhost:80 web@example.com
ssh -N -L 5433:db.internal:5432 ops@bastion.example.com
ssh -fN -L 6379:redis.internal:6379 ops@bastion.example.com`,
        language: "bash",
      },
      {
        id: "remote-forwarding",
        title: "Remote Port Forwarding",
        content: String.raw`
Remote forwarding opens a port on the remote SSH server and sends traffic back through SSH to a destination reachable from your client.

Pattern:

~~~bash
ssh -R remote_port:target_host:target_port user@ssh_server
~~~

Example: expose a local development server to a remote test box:

~~~bash
ssh -R 9000:localhost:3000 dev@testbox.example.com
~~~

Now testbox can reach your local app at localhost:9000 from the testbox side.

Server policy matters. sshd_config controls remote forwarding with AllowTcpForwarding and GatewayPorts.

| Setting | Effect |
|---|---|
| AllowTcpForwarding yes/no/local/remote | Whether forwarding is allowed |
| GatewayPorts no | Remote forwarded ports bind only loopback by default |
| GatewayPorts clientspecified | Client may request bind address |

Remote forwards are powerful and easy to misuse. Treat them as temporary access unless your team has a defined pattern.
        `,
        code: String.raw`ssh -N -R 9000:localhost:3000 dev@testbox.example.com
ssh -N -R 127.0.0.1:9000:localhost:3000 dev@testbox.example.com

# Server-side effective policy
sudo sshd -T | rg "allowtcpforwarding|gatewayports"`,
        language: "bash",
      },
      {
        id: "dynamic-forwarding",
        title: "Dynamic SOCKS Proxy",
        content: String.raw`
Dynamic forwarding creates a SOCKS proxy on your client. Applications that support SOCKS can send traffic through the SSH server.

Pattern:

~~~bash
ssh -D 1080 user@bastion.example.com
~~~

Then configure an application or browser to use SOCKS5 at localhost:1080.

Use cases:

- Access several private HTTP services through one SSH session.
- Debug network reachability from a remote environment.
- Temporarily route tool traffic through a bastion.

Limits:

- It is not a full VPN.
- DNS behavior depends on the application.
- It should not replace managed enterprise access controls.
        `,
        code: String.raw`ssh -N -D 127.0.0.1:1080 ops@bastion.example.com

# curl through SOCKS, resolving DNS through the proxy
curl --socks5-hostname 127.0.0.1:1080 http://internal.service.local/health`,
        language: "bash",
      },
      {
        id: "jump-hosts",
        title: "Jump Hosts and Bastions",
        content: String.raw`
A bastion is an SSH entry point into a private network. A jump host is the SSH client feature that connects through it.

Modern command:

~~~bash
ssh -J ops@bastion.example.com ubuntu@app01.internal
~~~

Config:

~~~sshconfig
Host bastion
  HostName bastion.example.com
  User ops

Host *.internal
  User ubuntu
  ProxyJump bastion
~~~

Why bastions exist:

- Keep private hosts off the public internet.
- Centralize audit logs.
- Enforce MFA, certificates, or device trust.
- Reduce exposed SSH attack surface.

Better bastion discipline:

| Practice | Reason |
|---|---|
| Log user identity clearly | Shared accounts destroy audit quality |
| Avoid copying private keys to bastions | Use ProxyJump or certificates |
| Patch bastions aggressively | They are high-value entry points |
| Restrict onward access | Bastion access should not mean entire network access |
        `,
        diagram: String.raw`
graph LR
  Client[Admin laptop] -->|ssh -J| Bastion[Bastion]
  Bastion --> App1[app01.internal]
  Bastion --> App2[app02.internal]
  Bastion --> DB[db01.internal]
        `,
        code: String.raw`ssh -J bastion app01.internal
scp -o ProxyJump=bastion ./file.txt app01.internal:/tmp/
sftp -J bastion app01.internal`,
        language: "bash",
      },
    ],
  },
  {
    id: "automation-and-production",
    title: "Automation and Production",
    description: "Non-interactive SSH, CI deploys, Ansible, host keys, and operational safety.",
    icon: "Server",
    sections: [
      {
        id: "automation-keys",
        title: "Automation Keys",
        content: String.raw`
Automation keys are different from human keys. They should be scoped, rotated, and restricted.

Automation key principles:

| Principle | Practice |
|---|---|
| Least privilege | Use a deploy user, not root |
| Narrow purpose | Separate CI, backup, monitoring, and deploy keys |
| Server restrictions | Use command=, from=, and no-* options when possible |
| Rotation | Replace keys when jobs, vendors, or people change |
| No passphrase only when necessary | CI cannot type passphrases without a secret manager |

Better deploy design:

1. CI receives a private deploy key from a secret manager.
2. Server authorized_keys restricts that public key.
3. Deploy user has limited sudo for restart/reload commands only.
4. CI verifies the server host key before connecting.
5. Every deploy is logged with commit SHA and actor.

<details>
<summary>Do not disable host checking in CI</summary>

StrictHostKeyChecking=no makes automation convenient but removes server identity protection. Prefer preloading known_hosts with the expected host key.

</details>
        `,
        code: String.raw`# CI-friendly known_hosts setup
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan -t ed25519 app01.example.com >> ~/.ssh/known_hosts
chmod 600 ~/.ssh/known_hosts

# Deploy with a specific key
ssh -i "$DEPLOY_KEY_PATH" -o IdentitiesOnly=yes deploy@app01.example.com "deploy-myapp $GIT_SHA"`,
        language: "bash",
      },
      {
        id: "ansible-and-parallel",
        title: "Ansible and Parallel Operations",
        content: String.raw`
Configuration management tools often ride on SSH. Ansible is the classic example: it connects to hosts over SSH, copies small modules, executes them, and returns structured results.

SSH features that matter for automation:

| Feature | Why |
|---|---|
| ControlMaster | Faster repeated connections |
| BatchMode yes | Fail instead of prompting |
| ConnectTimeout | Avoid long hangs |
| Strict host keys | Prevent accidental wrong-host deploys |
| ProxyJump | Reach private hosts through bastions |

BatchMode is important: automation should fail clearly, not wait forever for a password prompt.
        `,
        code: String.raw`ssh -o BatchMode=yes -o ConnectTimeout=10 deploy@app01 "true"

ansible all -i inventory.ini -m ping
ansible-playbook -i inventory.ini deploy.yml

# Example inventory variable
# ansible_ssh_common_args='-o ProxyJump=bastion'`,
        language: "bash",
      },
      {
        id: "host-key-management",
        title: "Host Key Management at Scale",
        content: String.raw`
known_hosts is a security database. It says: "When I connect to this name or address, I expect this host key."

At small scale, users accept host keys manually. At larger scale, teams manage host keys with:

- prebuilt known_hosts files.
- DNS SSHFP records with DNSSEC.
- SSH host certificates.
- infrastructure inventory and configuration management.
- cloud instance identity verification.

Host key changed warnings can mean:

| Cause | Severity |
|---|---|
| Server was rebuilt | Expected, but verify |
| IP or DNS now points elsewhere | Investigate |
| Load balancer sends different backend host keys | Fix architecture or use host certs |
| Man-in-the-middle attack | Treat as serious until disproven |

Do not train yourself to delete known_hosts entries blindly. Verify first, then update.
        `,
        code: String.raw`ssh-keygen -F app01.example.com
ssh-keygen -R app01.example.com
ssh-keyscan -t ed25519 app01.example.com

# Compare fingerprints out of band
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`,
        language: "bash",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Debug connection, DNS, keys, permissions, algorithms, and server-side failures.",
    icon: "Search",
    sections: [
      {
        id: "debug-method",
        title: "Debugging Method",
        content: String.raw`
SSH failures are easier when you isolate the layer.

Debug ladder:

| Layer | Question | Tool |
|---|---|---|
| DNS | Does the name resolve? | nslookup, dig |
| Network | Can I reach port 22? | nc, Test-NetConnection |
| Server | Is sshd running? | systemctl, logs |
| Host key | Is the server identity expected? | known_hosts, ssh-keygen |
| User auth | Is the right key/password accepted? | ssh -vvv, auth logs |
| Session | Does shell, command, or subsystem start? | logs, ForceCommand, shell |

Client-side first command:

~~~bash
ssh -vvv user@host
~~~

Server-side first command:

~~~bash
sudo journalctl -u ssh -f
~~~

Read the debug output around these phrases:

- Connecting to
- Host key verification
- Offering public key
- Authentications that can continue
- Permission denied
- Entering interactive session
        `,
        code: String.raw`nslookup app01.example.com
nc -vz app01.example.com 22
ssh -vvv -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 user@app01.example.com

# Windows network test
Test-NetConnection app01.example.com -Port 22`,
        language: "bash",
      },
      {
        id: "common-errors",
        title: "Common Errors",
        content: String.raw`
Common SSH errors usually point to a specific layer.

| Error | Likely cause | Fix |
|---|---|---|
| Connection timed out | Firewall, routing, host down | Check network path and security groups |
| Connection refused | Host reachable, sshd not listening | Start sshd or check port |
| Permission denied (publickey) | Wrong user/key, missing authorized_keys | Use -vvv and inspect server logs |
| Too many authentication failures | Client offered too many agent keys | Use IdentitiesOnly yes |
| Host key verification failed | known_hosts mismatch | Verify fingerprint, then update |
| WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED | Server identity changed | Investigate before removing old key |
| Bad owner or permissions | Insecure .ssh files | Fix chmod/chown |
| no matching host key type | Legacy server algorithms | Upgrade server or use temporary compatibility |
| subsystem request failed | SFTP disabled/misconfigured | Check Subsystem sftp line |

The fastest path is often:

1. Confirm you are using the correct remote username.
2. Force the exact key with -i and IdentitiesOnly.
3. Watch server logs during the attempt.
4. Check permissions on home, .ssh, and authorized_keys.
        `,
        code: String.raw`ssh -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 user@host

# On server
ls -ld /home/user /home/user/.ssh /home/user/.ssh/authorized_keys
sudo tail -f /var/log/auth.log
sudo tail -f /var/log/secure`,
        language: "bash",
      },
      {
        id: "legacy-algorithms",
        title: "Legacy Algorithms",
        content: String.raw`
Modern OpenSSH disables or removes weak algorithms over time. This is good for security but can break old routers, appliances, Git servers, and forgotten VMs.

Common legacy symptoms:

- no matching key exchange method found.
- no matching host key type found.
- no mutual signature algorithm.
- server accepts only ssh-rsa/SHA-1 signatures.

Preferred fix:

1. Upgrade the old SSH server.
2. Regenerate modern host keys if needed.
3. Enable modern algorithms.
4. Replace old user keys.

Temporary compatibility should be narrow and documented:

~~~sshconfig
Host old-appliance
  HostName 192.0.2.50
  User admin
  HostKeyAlgorithms +ssh-rsa
  PubkeyAcceptedAlgorithms +ssh-rsa
~~~

Do not put legacy algorithm exceptions under Host *.

<details>
<summary>Important distinction</summary>

RSA keys are not automatically bad. The old ssh-rsa signature algorithm based on SHA-1 is the problem. Modern RSA with SHA-2 signatures can still be acceptable where policy permits.

</details>
        `,
        code: String.raw`ssh -vvv old-appliance
ssh -Q key
ssh -Q kex
ssh -Q sig

# Narrow one-time test
ssh -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa admin@old-appliance`,
        language: "bash",
      },
    ],
  },
  {
    id: "mastery-labs",
    title: "Mastery Labs",
    description: "Hands-on drills, interview answers, checklists, and reference sources.",
    icon: "Target",
    sections: [
      {
        id: "hands-on-labs",
        title: "Hands-on Labs",
        content: String.raw`
Use a disposable VM, local container with sshd, cloud test instance, or home lab machine. Do not practice destructive hardening on your only production access path.

Lab path:

| Lab | Goal |
|---|---|
| 1. First login | Connect with password or existing key |
| 2. Key auth | Generate Ed25519 key and install public key |
| 3. Disable passwords | Turn off password auth after key login works |
| 4. Client config | Replace long command with a Host alias |
| 5. File transfer | Copy files with scp, sftp, and rsync |
| 6. Local tunnel | Reach a private service through SSH |
| 7. Bastion | Connect to a private host through ProxyJump |
| 8. Troubleshooting | Break permissions, read logs, fix access |
| 9. Hardening | Apply baseline and validate with sshd -t |
| 10. Automation | Run non-interactive command with BatchMode |

Success criteria:

- You can explain host keys versus user keys.
- You can debug public key failure from both client and server.
- You can use ~/.ssh/config without guessing.
- You can tunnel safely and explain the traffic path.
- You can harden sshd without locking yourself out.
        `,
        code: String.raw`# Lab: create a key, connect, and verify
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/lab_ed25519 -C "ssh lab"
ssh-copy-id -i ~/.ssh/lab_ed25519.pub lab@lab-server
ssh -o IdentitiesOnly=yes -i ~/.ssh/lab_ed25519 lab@lab-server "whoami && hostname"

# Lab: config alias
cat ~/.ssh/config
ssh labbox "uptime"`,
        language: "bash",
      },
      {
        id: "interview-answers",
        title: "Interview Answers",
        content: String.raw`
Strong answers are short, precise, and operational.

### What happens when you SSH into a server?

The client connects to sshd, negotiates cryptographic algorithms, verifies the server host key against known_hosts, authenticates the user, then opens an encrypted channel for a shell, command, tunnel, or subsystem.

### What is the difference between a host key and a user key?

A host key identifies the server to the client. A user key identifies a user to the server. Host keys prevent server impersonation; user keys authorize login.

### Why disable password authentication?

Public internet SSH gets constant password guessing. Key auth removes reusable passwords from the network login path and is stronger when private keys are passphrase-protected and access is logged.

### How would you avoid copying private keys to a bastion?

Use ProxyJump so the client connects through the bastion while keeping private keys local. For larger environments, use short-lived SSH certificates or identity-aware access.

### How do you debug Permission denied (publickey)?

Run ssh -vvv with the exact key and IdentitiesOnly yes. Confirm the remote username, check that the public key is in the target user's authorized_keys, verify permissions and ownership, and watch server auth logs.

### What is agent forwarding and why is it risky?

Agent forwarding lets a remote host request signatures from your local ssh-agent. It avoids copying keys, but a compromised remote host can use the forwarded agent while the session is active.

### What is a local port forward?

It opens a local port on my machine and carries traffic through the SSH server to a destination reachable from the SSH server, such as a private database.
        `,
        code: String.raw`# Answer-supporting commands to remember
ssh -vvv user@host
ssh -J bastion private-host
ssh -L 5433:db.internal:5432 bastion
ssh -G host
sudo sshd -T
sudo journalctl -u ssh -f`,
        language: "bash",
      },
      {
        id: "cheatsheet",
        title: "Command Cheat Sheet",
        content: String.raw`
| Task | Command |
|---|---|
| Login | ssh user@host |
| Remote command | ssh user@host "command" |
| Debug | ssh -vvv user@host |
| Generate Ed25519 key | ssh-keygen -t ed25519 -a 100 |
| Copy public key | ssh-copy-id -i key.pub user@host |
| Use exact key | ssh -o IdentitiesOnly=yes -i key user@host |
| Add key to agent | ssh-add key |
| List agent keys | ssh-add -l |
| Copy file to server | scp file user@host:/path/ |
| Sync directory | rsync -avz ./dir/ user@host:/path/ |
| SFTP | sftp user@host |
| Local tunnel | ssh -N -L 8080:target:80 user@host |
| Remote tunnel | ssh -N -R 9000:localhost:3000 user@host |
| SOCKS proxy | ssh -N -D 1080 user@host |
| Jump host | ssh -J bastion user@private |
| Show effective client config | ssh -G host |
| Test server config | sudo sshd -t |
| Show effective server config | sudo sshd -T |
| Remove old host key | ssh-keygen -R host |
| Find host in known_hosts | ssh-keygen -F host |

Memorize the patterns, not every flag. Mastery is recognizing which side owns the problem: client config, network path, server policy, file permissions, or identity.
        `,
        code: String.raw`# Golden debug bundle
ssh -vvv -o IdentitiesOnly=yes -i ~/.ssh/id_ed25519 user@host
ssh -G host
ssh-keygen -lf ~/.ssh/id_ed25519.pub
ssh-keygen -F host
sudo sshd -t
sudo sshd -T`,
        language: "bash",
      },
      {
        id: "research-sources",
        title: "Research and Source Map",
        content: String.raw`
Primary references to continue learning:

- OpenSSH project: https://www.openssh.com/
- OpenSSH release notes: https://www.openssh.org/releasenotes.html
- OpenSSH manual pages: https://man.openbsd.org/ssh
- ssh_config client manual: https://man.openbsd.org/ssh_config
- sshd_config server manual: https://man.openbsd.org/sshd_config
- ssh-keygen manual: https://man.openbsd.org/ssh-keygen
- scp manual: https://man.openbsd.org/scp
- sftp manual: https://man.openbsd.org/sftp
- OpenSSH post-quantum notes: https://www.openssh.com/pq.html
- Microsoft OpenSSH Server configuration: https://learn.microsoft.com/windows-server/administration/OpenSSH/openssh-server-configuration

Study strategy:

1. Read ssh(1) for client behavior.
2. Read ssh_config(5) for client options.
3. Read sshd_config(5) for server policy.
4. Use ssh -vvv and sshd logs to connect theory to reality.
5. Practice on disposable machines until the flow is automatic.
        `,
        code: String.raw`man ssh
man ssh_config
man sshd_config
man ssh-keygen
man authorized_keys`,
        language: "bash",
      },
    ],
  },
];

export const sshTopics = topics.map((topic) => ({
  ...topic,
  sections: topic.sections.map((section) => ({
    ...section,
    content:
      section.id === "research-sources"
        ? section.content
        : `${section.content}${practiceNote}`,
  })),
}));
