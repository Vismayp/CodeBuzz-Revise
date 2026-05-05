export const topics = [
  {
    id: "orientation",
    title: "Orientation",
    description: "How Git thinks, what GitHub adds, and the mastery path.",
    icon: "GitBranch",
    sections: [
      {
        id: "mental-model",
        title: "Git Mental Model",
        content: String.raw`
Git is a distributed version-control system. Your local repository contains the working tree, the staging area, local commits, branch names, tags, and remote-tracking references.

Think in four places:

| Place | Meaning | Common commands |
|---|---|---|
| Working tree | Files you are editing now | git status, git diff |
| Staging area | The next snapshot you are preparing | git add, git restore --staged |
| Local repository | Committed history on your machine | git commit, git log |
| Remote repository | Shared repository such as GitHub | git fetch, git pull, git push |

Mastery begins when you stop seeing Git as a save button and start seeing it as a graph of snapshots. A commit points to a tree, parent commits, author data, and a message. Branches are movable names that point to commits.

<details>
<summary>Interactive check: Where is the change?</summary>

1. You edited a file but did not run git add: working tree.
2. You ran git add but not git commit: staging area.
3. You ran git commit but not git push: local repository.
4. You pushed to origin: remote repository.

</details>
        `,
        diagram: String.raw`
graph LR
  A[Working Tree] -->|git add| B[Index / Staging]
  B -->|git commit| C[Local Repository]
  C -->|git push| D[GitHub Remote]
  D -->|git fetch| E[Remote Tracking Ref]
  E -->|git merge or rebase| C
        `,
        code: String.raw`git status
git diff
git add src/App.jsx
git diff --cached
git commit -m "Add user profile shell"
git log --oneline --decorate --graph --all`,
        language: "bash",
      },
      {
        id: "git-vs-github",
        title: "Git vs GitHub",
        content: String.raw`
Git is the version-control engine. GitHub is a collaboration platform built around Git repositories.

Git handles:

- snapshots, branches, merges, rebases, tags, history search, object storage, and local recovery.
- offline work and peer-to-peer workflows.
- command-line and tool integrations.

GitHub adds:

- pull requests, code review, issues, discussions, releases, projects, security scanning, branch rules, repository settings, and GitHub Actions automation.
- hosted remotes named by URLs such as https://github.com/org/repo.git or git@github.com:org/repo.git.

The daily professional loop:

1. Create or sync a branch.
2. Make small commits.
3. Push the branch.
4. Open a pull request.
5. Discuss, test, review, update.
6. Merge with the project policy.

<details>
<summary>Scenario drill: Which tool owns it?</summary>

- "Show me uncommitted local changes" is Git.
- "Require two reviewers before merging" is GitHub.
- "Run tests on every pull request" is GitHub Actions.
- "Find the commit that introduced a bug" is Git, usually git bisect.

</details>
        `,
        code: String.raw`git remote -v
git remote add origin https://github.com/OWNER/REPO.git
git push -u origin main

# GitHub CLI examples, if gh is installed and authenticated
gh repo view
gh pr create --fill
gh pr checks`,
        language: "bash",
      },
      {
        id: "setup",
        title: "Professional Setup",
        content: String.raw`
A professional setup makes Git predictable across machines.

Minimum setup:

- user.name and user.email identify your commits.
- init.defaultBranch avoids old default branch surprises.
- pull.rebase or pull.ff controls how local branches integrate remote changes.
- core.editor decides what opens for messages and rebases.
- credential helpers or SSH keys handle authentication.

Recommended habits:

| Habit | Why it matters |
|---|---|
| Configure identity once | Prevents anonymous or wrong-author commits |
| Prefer SSH or credential manager | Reduces password/token friction |
| Use small commits | Easier review, rollback, and cherry-pick |
| Learn git help | The built-in manual is always available |

<details>
<summary>Interactive setup audit</summary>

Run the commands in the example block. If any output is blank, configure it before serious project work. If git status says you are not in a repository, create a practice folder and run git init.

</details>
        `,
        code: String.raw`git --version
git config --global user.name
git config --global user.email
git config --global init.defaultBranch main
git config --global pull.ff only
git config --global core.editor "code --wait"
git config --global --list
git help status`,
        language: "bash",
      },
    ],
  },
  {
    id: "daily-workflow",
    title: "Daily Workflow",
    description: "Status, diff, add, commit, restore, ignore, and clean habits.",
    icon: "Terminal",
    sections: [
      {
        id: "status-diff-add",
        title: "Status, Diff, Add",
        content: String.raw`
The most important daily skill is reading what Git is telling you before changing history.

Use this loop many times:

1. git status to classify files.
2. git diff to inspect unstaged changes.
3. git add selectively.
4. git diff --cached to inspect the next commit.
5. git commit only when the staged snapshot is coherent.

Staging is not a chore. It is how you shape meaningful commits from messy working sessions.

<details>
<summary>Practice: Build one clean commit from mixed work</summary>

1. Edit two files.
2. Stage only one file with git add path.
3. Confirm the staged snapshot with git diff --cached.
4. Commit it.
5. Stage and commit the second file separately.

If both changes belong to one logical unit, one commit is fine. If they answer different review questions, split them.

</details>
        `,
        code: String.raw`git status --short
git diff
git add README.md
git diff --cached
git commit -m "Document local setup"

# Stage hunks interactively
git add -p
git diff --cached --stat`,
        language: "bash",
      },
      {
        id: "commit-messages",
        title: "Commit Messages",
        content: String.raw`
A good commit message explains intent, not just files changed.

Strong format:

- Subject: short imperative phrase.
- Body: why the change exists, what tradeoff was made, and anything risky.
- Footer: issue links or breaking-change notes when needed.

Good subjects:

- Add checkout retry for transient payment failures
- Fix stale cache invalidation after profile update
- Remove unused dashboard polling endpoint

Weak subjects:

- changes
- fixed stuff
- update file

<details>
<summary>Rewrite challenge</summary>

Weak: "fix bug"

Better: "Fix duplicate invoice emails after retry"

Why: it names the behavior, the domain, and the trigger.

</details>
        `,
        code: String.raw`git commit -m "Add checkout retry for transient payment failures"

git commit
# Opens editor for:
# Subject line
#
# Body explaining why and what changed.

git log --oneline -5
git show --stat HEAD`,
        language: "bash",
      },
      {
        id: "restore-reset-clean",
        title: "Undo Local Changes Safely",
        content: String.raw`
Undo commands are powerful because they operate on different places.

| Need | Safer command |
|---|---|
| Unstage a file | git restore --staged path |
| Discard working-tree edits | git restore path |
| Move branch and index to a commit | git reset --mixed commit |
| Move branch, index, and working tree | git reset --hard commit |
| Remove ignored/untracked build output | git clean -fdX |

Rule: run git status and git diff before destructive cleanup. Use git stash or a temporary commit if you are unsure.

<details>
<summary>Decision drill</summary>

Question: You staged the wrong file but want to keep your edits.

Answer: git restore --staged path

Question: You generated dist files and want them gone, but keep normal untracked files.

Answer: git clean -fdX

Question: You want to throw away all local changes to a tracked file.

Answer: git restore path

</details>
        `,
        code: String.raw`git status
git restore --staged src/App.jsx
git restore src/App.jsx

# Preview before cleaning
git clean -fdXn
git clean -fdX

# Last-resort reset after review
git reset --hard HEAD`,
        language: "bash",
      },
      {
        id: "ignore-attributes",
        title: "Ignore and Attributes",
        content: String.raw`
.gitignore prevents accidental tracking of generated files, secrets, editor state, and dependency folders. It does not remove files that are already tracked.

.gitattributes controls repository-wide file handling, such as line endings, diff drivers, linguist overrides, and merge strategies.

Common ignore targets:

- node_modules, dist, build, coverage.
- .env, .env.local, local database files.
- OS/editor files like .DS_Store or .vscode when project-specific settings are not intended.

<details>
<summary>Fix challenge: Why is ignored.env still tracked?</summary>

Because ignore rules only affect untracked files. Remove it from the index without deleting your local copy:

git rm --cached ignored.env

Then commit the removal and keep the ignore rule.

</details>
        `,
        code: String.raw`# .gitignore
node_modules/
dist/
coverage/
.env
.env.local

# Stop tracking a file but keep local copy
git rm --cached .env
git commit -m "Stop tracking local environment file"

# .gitattributes
*.sh text eol=lf
*.png binary`,
        language: "bash",
      },
    ],
  },
  {
    id: "branching",
    title: "Branching",
    description: "Branches, switching, merging, rebasing, and conflict resolution.",
    icon: "GitBranch",
    sections: [
      {
        id: "branch-basics",
        title: "Branches in Practice",
        content: String.raw`
A branch is a movable pointer to a commit. Creating branches is cheap, so use them for features, fixes, experiments, and releases.

Branch naming examples:

| Work | Branch name |
|---|---|
| Feature | feature/search-filters |
| Bug fix | fix/login-redirect-loop |
| Chore | chore/upgrade-vite |
| Release | release/2026-05 |

Local branch commands:

- Create and switch: git switch -c feature/name
- List branches: git branch -vv
- Rename current branch: git branch -m new-name
- Delete merged branch: git branch -d branch-name

<details>
<summary>Interactive check</summary>

If you want an isolated place to try an idea, create a branch. If the idea works, merge or open a PR. If it fails, delete the branch. Your main branch stays clean.

</details>
        `,
        code: String.raw`git switch main
git pull --ff-only
git switch -c feature/profile-tabs

# Work, stage, commit
git add src/pages/Profile.jsx
git commit -m "Add profile tab navigation"

git branch -vv
git log --oneline --decorate --graph --all`,
        language: "bash",
      },
      {
        id: "merge",
        title: "Merge",
        content: String.raw`
Merging joins histories. A fast-forward merge simply moves the branch pointer when no divergent commits exist. A three-way merge creates a merge commit when both branches have unique work.

Use merge when:

- you want to preserve the true branch topology.
- the team accepts merge commits in shared history.
- you are merging completed branches into integration branches.

Conflict resolution loop:

1. Run merge.
2. Open conflicted files.
3. Choose the final content.
4. Stage resolved files.
5. Commit or continue the merge.

<details>
<summary>Conflict markers explained</summary>

<<<<<<< HEAD means your current branch version starts here.

======= separates the two versions.

>>>>>>> feature/name means the incoming branch version ends here.

Delete the markers and leave only the correct final code.

</details>
        `,
        diagram: String.raw`
gitGraph
  commit id: "A"
  branch feature
  checkout feature
  commit id: "B"
  checkout main
  commit id: "C"
  merge feature id: "M"
        `,
        code: String.raw`git switch main
git pull --ff-only
git merge feature/profile-tabs

# If conflicts occur
git status
git diff
git add src/pages/Profile.jsx
git commit

# Abort if you need to step back before resolving
git merge --abort`,
        language: "bash",
      },
      {
        id: "rebase",
        title: "Rebase",
        content: String.raw`
Rebase replays commits onto a new base. It is useful for making a feature branch look as if it started from the latest main branch.

Use rebase when:

- cleaning your own local branch before review.
- updating a feature branch without a merge commit.
- editing, squashing, reordering, or dropping local commits with interactive rebase.

Do not casually rebase shared public history that other people already based work on. Rewriting shared history forces coordination.

<details>
<summary>Merge or rebase?</summary>

Use merge when preserving collaboration history matters.

Use rebase when polishing your own branch before it is merged.

Use the project policy when working in a team. Consistency beats personal taste.

</details>
        `,
        code: String.raw`git switch feature/profile-tabs
git fetch origin
git rebase origin/main

# If conflicts occur
git status
git add src/pages/Profile.jsx
git rebase --continue

# Back out of the rebase attempt
git rebase --abort

# Interactive cleanup of your last 4 commits
git rebase -i HEAD~4`,
        language: "bash",
      },
      {
        id: "conflicts",
        title: "Conflict Mastery",
        content: String.raw`
Conflicts are not errors. They are Git asking a human to choose the final truth.

Conflict strategy:

1. Slow down and read the intent of both sides.
2. Prefer the smallest correct final file.
3. Run tests after resolving.
4. Review the resolved diff before committing.

Useful tools:

| Command | Use |
|---|---|
| git status | See conflicted paths |
| git diff | See conflict details |
| git checkout --ours path | Keep current branch version |
| git checkout --theirs path | Keep incoming version |
| git mergetool | Use configured visual merge tool |

<details>
<summary>Mini lab</summary>

Create two branches that edit the same line differently. Merge one into the other. Resolve the conflict, run the project test/build, and inspect the merge commit.

</details>
        `,
        code: String.raw`git status
git diff --check
git checkout --ours package.json
git checkout --theirs package-lock.json
git add package.json package-lock.json
git commit

# During rebase, "ours" and "theirs" can feel reversed.
# Read git status and the file before choosing.`,
        language: "bash",
      },
    ],
  },
  {
    id: "remotes",
    title: "Remotes",
    description: "Clone, fetch, pull, push, upstreams, forks, and remote hygiene.",
    icon: "Share2",
    sections: [
      {
        id: "clone-fetch-pull",
        title: "Clone, Fetch, Pull",
        content: String.raw`
Clone copies a repository and sets up a remote, usually named origin.

Fetch downloads remote updates without changing your current branch. Pull is fetch plus integration, usually merge or rebase depending on configuration.

Professional default:

- Use git fetch when you want to inspect first.
- Use git pull --ff-only when your local branch should simply move forward.
- Use git pull --rebase when your team expects rebased feature branches.

<details>
<summary>Two-dot and three-dot check</summary>

git log main..origin/main shows commits in origin/main that are not in main.

git log main...origin/main shows commits reachable from either side but not both. It is useful for divergence.

</details>
        `,
        code: String.raw`git clone https://github.com/OWNER/REPO.git
cd REPO

git remote -v
git fetch origin
git log --oneline main..origin/main
git pull --ff-only

# Inspect all remote-tracking branches
git branch -r`,
        language: "bash",
      },
      {
        id: "push-upstream",
        title: "Push and Upstreams",
        content: String.raw`
An upstream connects your local branch to a remote branch. After setting it, git push and git pull know where to operate.

Common push outcomes:

| Situation | Command |
|---|---|
| First push of branch | git push -u origin branch |
| Normal update | git push |
| Tags | git push origin v1.2.0 |
| Deleted remote branch | git push origin --delete branch |
| Rewritten own branch | git push --force-with-lease |

Prefer --force-with-lease over --force. It refuses to overwrite remote work you have not seen.

<details>
<summary>Safety check before force push</summary>

Run git fetch origin and git log --oneline --left-right --graph HEAD...origin/your-branch. If someone else added commits, talk before overwriting.

</details>
        `,
        code: String.raw`git switch -c fix/profile-timezone
git push -u origin fix/profile-timezone

# Later
git push

# After local interactive rebase on your own branch
git fetch origin
git push --force-with-lease

# Cleanup
git push origin --delete fix/profile-timezone`,
        language: "bash",
      },
      {
        id: "forks",
        title: "Fork Workflow",
        content: String.raw`
A fork is your copy of someone else's repository on GitHub. Open-source work often uses fork plus upstream.

Common remote names:

- origin: your fork.
- upstream: the original project.

Daily fork loop:

1. Fetch upstream.
2. Update your local main.
3. Push your fork main.
4. Create a feature branch.
5. Push feature branch to origin.
6. Open a pull request to upstream.

<details>
<summary>Fork sync challenge</summary>

If your fork is behind upstream, fetch upstream and fast-forward your local main. Then push main to origin. Never put feature commits directly on main if you can avoid it.

</details>
        `,
        code: String.raw`git remote -v
git remote add upstream https://github.com/ORIGINAL_OWNER/REPO.git

git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main

git switch -c feature/better-errors
git push -u origin feature/better-errors`,
        language: "bash",
      },
    ],
  },
  {
    id: "history",
    title: "History Surgery",
    description: "Reset, revert, amend, cherry-pick, reflog, bisect, and blame.",
    icon: "RotateCw",
    sections: [
      {
        id: "amend-reset-revert",
        title: "Amend, Reset, Revert",
        content: String.raw`
These commands solve different undo problems.

| Command | Best for | Rewrites history? |
|---|---|---|
| git commit --amend | Fix latest local commit | Yes |
| git reset | Move current branch to another commit | Yes |
| git revert | Create a new commit that undoes an old commit | No |

Use revert on shared branches because it preserves history. Use amend and reset on private work when cleaning before push.

<details>
<summary>Pick the command</summary>

You forgot one file in the last unpushed commit: git add file, then git commit --amend.

You pushed a bad commit to main: git revert bad-sha, then push the revert.

You made three local commits and want to start over: git reset --hard HEAD~3 after confirming there is nothing to keep.

</details>
        `,
        code: String.raw`# Fix last local commit
git add src/App.jsx
git commit --amend

# Undo a pushed commit safely
git revert 2f4a9c1
git push

# Move branch back but keep changes staged
git reset --soft HEAD~1

# Move branch back and keep changes unstaged
git reset --mixed HEAD~1`,
        language: "bash",
      },
      {
        id: "cherry-pick",
        title: "Cherry-Pick",
        content: String.raw`
Cherry-pick copies a commit from one branch onto another by creating a new commit with the same patch.

Use it for:

- backporting a fix to a release branch.
- rescuing one useful commit from an abandoned branch.
- moving a small fix without merging unrelated work.

Avoid cherry-picking huge feature branches one commit at a time. If the whole branch belongs together, merge or rebase it.

<details>
<summary>Backport lab</summary>

Imagine main has a production bug fix and release/1.4 needs only that fix. Switch to release/1.4, cherry-pick the fix commit, run tests, then push the release branch.

</details>
        `,
        code: String.raw`git log --oneline main
git switch release/1.4
git cherry-pick a1b2c3d

# Resolve conflicts if needed
git status
git add src/payments.js
git cherry-pick --continue

# Abort the operation
git cherry-pick --abort`,
        language: "bash",
      },
      {
        id: "reflog-bisect-blame",
        title: "Reflog, Bisect, Blame",
        content: String.raw`
Git keeps recovery and investigation tools that make it hard to truly lose committed work.

| Tool | Purpose |
|---|---|
| git reflog | See where HEAD and branches recently pointed |
| git bisect | Binary search history to find the first bad commit |
| git blame | See last commit that changed each line |
| git show | Inspect one commit |
| git grep | Search tracked content |

Use blame to understand context, not to assign shame. The line author may not be the person who introduced the real problem.

<details>
<summary>Investigation drill</summary>

1. Start with a known good commit and a known bad commit.
2. Run git bisect start.
3. Mark bad and good.
4. Run the test Git asks for at each step.
5. Mark good or bad until Git identifies the culprit.

</details>
        `,
        code: String.raw`git reflog
git switch -c recovery HEAD@{2}

git bisect start
git bisect bad
git bisect good v1.2.0
npm test
git bisect good
git bisect reset

git blame src/App.jsx
git show --stat HEAD`,
        language: "bash",
      },
    ],
  },
  {
    id: "advanced-git",
    title: "Advanced Git",
    description: "Stash, worktree, tags, submodules, sparse checkout, hooks, and internals.",
    icon: "Cpu",
    sections: [
      {
        id: "stash-worktree",
        title: "Stash and Worktree",
        content: String.raw`
Stash temporarily stores unfinished work. Worktree creates another working directory attached to the same repository.

Use stash for quick interruptions. Use worktree for parallel work that deserves its own directory.

Common cases:

| Need | Tool |
|---|---|
| Pull latest before returning to work | git stash |
| Fix urgent bug while feature branch is dirty | git worktree |
| Compare two branches side by side | git worktree |
| Save WIP with a label | git stash push -m |

<details>
<summary>Interactive choice</summary>

Dirty feature branch and urgent production fix? Prefer git worktree. It avoids hiding unfinished files and lets you build/test both branches separately.

</details>
        `,
        code: String.raw`git stash push -m "wip profile form"
git stash list
git stash show -p stash@{0}
git stash pop

git worktree add ../repo-hotfix main
cd ../repo-hotfix
git switch -c hotfix/login
git worktree list
git worktree remove ../repo-hotfix`,
        language: "bash",
      },
      {
        id: "tags-releases",
        title: "Tags and Releases",
        content: String.raw`
Tags name important commits. Releases on GitHub add release notes, assets, and collaboration metadata around tags.

Tag types:

- Lightweight tag: just a name pointing to a commit.
- Annotated tag: full object with tagger, date, message, and optional signature.

Use annotated tags for release points.

Versioning habits:

- v1.2.0 for semantic versions.
- release notes explain user impact.
- signed tags increase supply-chain confidence.

<details>
<summary>Release checklist</summary>

1. Tests pass on the release commit.
2. Changelog or release notes are ready.
3. Tag points to the intended commit.
4. Tag is pushed.
5. GitHub release is created from that tag.

</details>
        `,
        code: String.raw`git switch main
git pull --ff-only
npm test

git tag -a v1.2.0 -m "Release v1.2.0"
git show v1.2.0
git push origin v1.2.0

# GitHub CLI
gh release create v1.2.0 --generate-notes`,
        language: "bash",
      },
      {
        id: "submodules-sparse",
        title: "Submodules and Sparse Checkout",
        content: String.raw`
Submodules embed another Git repository at a specific commit. They are useful for tightly pinned external dependencies, but they add workflow complexity.

Sparse checkout lets you work with only part of a repository. Partial clone reduces transferred object data. These tools help with large monorepos.

Use carefully:

| Feature | Best fit | Risk |
|---|---|---|
| Submodule | Pin external repo exactly | Confusing updates for newcomers |
| Sparse checkout | Work on part of large repo | Missing files may surprise tooling |
| Partial clone | Reduce network/storage cost | Some operations fetch later |

<details>
<summary>Submodule update rule</summary>

A submodule records a commit, not a floating branch. To update it, enter the submodule, fetch/checkout the desired commit, return to the parent repo, then commit the changed submodule pointer.

</details>
        `,
        code: String.raw`# Submodule basics
git submodule add https://github.com/OWNER/LIB.git vendor/lib
git submodule update --init --recursive
git status

# Sparse checkout basics
git clone --filter=blob:none --sparse https://github.com/OWNER/MONOREPO.git
cd MONOREPO
git sparse-checkout set apps/web packages/ui
git sparse-checkout list`,
        language: "bash",
      },
      {
        id: "hooks-internals",
        title: "Hooks and Internals",
        content: String.raw`
Hooks are scripts that run at Git lifecycle points. Client hooks can format or validate locally. Server-side hooks enforce repository policy, usually on hosted systems.

Git internals worth knowing:

- .git/objects stores compressed objects.
- HEAD points to the current branch or commit.
- refs/heads contains local branch refs.
- refs/remotes contains remote-tracking refs.
- index is the staging area.

Knowing internals helps you debug detached HEAD, broken refs, unexpected staging, and recovery cases.

<details>
<summary>Detached HEAD explained</summary>

Detached HEAD means HEAD points directly to a commit instead of a branch name. You can inspect safely. If you commit and want to keep the work, create a branch before switching away:

git switch -c keep-this-work

</details>
        `,
        code: String.raw`ls .git
git cat-file -t HEAD
git cat-file -p HEAD
git rev-parse --show-toplevel
git rev-parse --abbrev-ref HEAD

# Example pre-commit hook path
.git/hooks/pre-commit`,
        language: "bash",
      },
    ],
  },
  {
    id: "github-collaboration",
    title: "GitHub Collaboration",
    description: "GitHub flow, pull requests, review, issues, discussions, and projects.",
    icon: "Users",
    sections: [
      {
        id: "github-flow",
        title: "GitHub Flow",
        content: String.raw`
GitHub Flow is a lightweight branch-based collaboration model.

Flow:

1. Create a branch from main.
2. Commit changes.
3. Push branch.
4. Open a pull request.
5. Review and discuss.
6. Deploy/test.
7. Merge.

The key idea: main should remain deployable, and pull requests are the collaboration unit.

<details>
<summary>Flow simulation</summary>

Pretend you are fixing login validation:

branch: fix/login-validation-message

commit: Fix login validation message for empty email

PR title: Fix empty-email validation on login

Review question: Does this affect signup validation too?

</details>
        `,
        code: String.raw`git switch main
git pull --ff-only
git switch -c fix/login-validation-message
git add src/pages/Login.jsx
git commit -m "Fix empty-email validation on login"
git push -u origin fix/login-validation-message
gh pr create --title "Fix empty-email validation on login" --body "Updates login validation and adds coverage."`,
        language: "bash",
      },
      {
        id: "pull-requests",
        title: "Pull Request Mastery",
        content: String.raw`
A pull request is both a proposed code change and a conversation.

Strong PRs include:

- clear title.
- short context.
- screenshots or recordings for UI changes.
- test plan.
- risk notes.
- linked issue.

Review habits:

| Reviewer asks | Author provides |
|---|---|
| What changed? | Focused summary |
| Why? | Problem context |
| How was it checked? | Test plan |
| What could break? | Risk notes |

<details>
<summary>PR body template</summary>

Summary:

- What changed?

Test plan:

- Commands run.
- Manual checks.

Risk:

- Migration, cache, auth, performance, or UI risk.

</details>
        `,
        code: String.raw`gh pr status
gh pr view --web
gh pr checks
gh pr diff
gh pr comment --body "Added test coverage for the empty email case."
gh pr ready`,
        language: "bash",
      },
      {
        id: "issues-projects",
        title: "Issues, Discussions, Projects",
        content: String.raw`
GitHub issues track actionable work. Discussions hold open-ended conversation. Projects organize work across repositories and teams.

Use issues for:

- bugs.
- feature requests.
- tasks.
- RFC checklists.

Use discussions for:

- questions.
- proposals not ready for implementation.
- community support.

Use projects for:

- prioritization.
- roadmap views.
- sprint boards.
- cross-repository status.

<details>
<summary>Convert vague request to issue</summary>

Vague: "Search is bad."

Actionable: "Search results ignore exact title matches when filters are active."

Add reproduction steps, expected behavior, actual behavior, environment, and screenshots.

</details>
        `,
        code: String.raw`gh issue create --title "Search ignores exact title matches with filters" --body "Steps, expected result, actual result, screenshots."
gh issue list --label bug
gh issue view 123
gh issue close 123 --comment "Fixed in #456"`,
        language: "bash",
      },
    ],
  },
  {
    id: "github-automation",
    title: "GitHub Automation",
    description: "Actions, CI, branch protection, releases, Dependabot, and CODEOWNERS.",
    icon: "Zap",
    sections: [
      {
        id: "actions-ci",
        title: "GitHub Actions CI",
        content: String.raw`
GitHub Actions runs workflows from YAML files in .github/workflows. Workflows respond to events such as push, pull_request, schedule, workflow_dispatch, and release.

Core terms:

| Term | Meaning |
|---|---|
| Workflow | Automation file |
| Job | Group of steps on a runner |
| Step | Shell command or action |
| Runner | Machine executing the job |
| Matrix | Run job across versions or platforms |

Start with fast checks on every pull request: install, lint, test, build.

<details>
<summary>CI debugging checklist</summary>

1. Read the first failing step, not just the last line.
2. Compare local Node/package versions with CI.
3. Check secrets and permissions.
4. Re-run only after changing something meaningful.

</details>
        `,
        code: String.raw`name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
        language: "yaml",
      },
      {
        id: "branch-protection",
        title: "Branch Protection and Rulesets",
        content: String.raw`
Branch protection and repository rules prevent risky changes to important branches.

Common protections:

- require pull request reviews.
- require status checks.
- require branches to be up to date.
- require signed commits.
- restrict who can push.
- block force pushes and deletion.
- require linear history when the team wants rebased/squashed history.

Good policy is strict enough to protect main and light enough that developers do not route around it.

<details>
<summary>Design a main branch rule</summary>

For a professional team, a good baseline is: require PR, require one or two approvals, require CI, dismiss stale approvals after new commits, block force pushes, and restrict direct pushes to automation or release managers only.

</details>
        `,
        code: String.raw`# Inspect branch protection with GitHub CLI API
gh api repos/OWNER/REPO/branches/main/protection

# Common local habit before opening PR
git fetch origin
git rebase origin/main
npm run build
git push --force-with-lease`,
        language: "bash",
      },
      {
        id: "dependabot-codeowners",
        title: "Dependabot and CODEOWNERS",
        content: String.raw`
Dependabot can raise pull requests for dependency updates and security fixes. CODEOWNERS automatically requests review from owners of matching paths.

Use Dependabot to:

- keep dependency versions current.
- receive vulnerability update PRs.
- reduce manual upgrade scanning.

Use CODEOWNERS to:

- route reviews.
- protect sensitive areas like auth, billing, infra, or migrations.
- make ownership visible.

<details>
<summary>Ownership drill</summary>

If database migrations are risky, add a CODEOWNERS rule for migrations and require code owner review through branch protection.

</details>
        `,
        code: String.raw`# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly

# .github/CODEOWNERS
/src/auth/ @org/security-team
/src/billing/ @org/payments-team
/migrations/ @org/database-team`,
        language: "yaml",
      },
      {
        id: "security-features",
        title: "GitHub Security Features",
        content: String.raw`
Modern GitHub repositories can use multiple security layers.

Key features:

| Feature | Purpose |
|---|---|
| Secret scanning | Detect committed secrets |
| Push protection | Block supported secrets before they land |
| Dependabot alerts | Warn about vulnerable dependencies |
| Dependency review | Show dependency risk in PRs |
| Code scanning | Find security issues through static analysis |
| Security advisories | Coordinate vulnerability disclosure |

Security maturity path:

1. Never commit secrets.
2. Add branch protection and required CI.
3. Enable Dependabot.
4. Add code scanning.
5. Define CODEOWNERS for sensitive paths.
6. Practice incident response for leaked secrets.

<details>
<summary>Secret leak response</summary>

Revoke the secret first. Then remove it from current code. If required, rewrite history and coordinate all clones, but never treat history rewrite as enough. A leaked secret must be considered exposed.

</details>
        `,
        code: String.raw`# Search tracked files for a suspicious token name
git grep -n "API_KEY"

# Remove local secret from tracking
git rm --cached .env
git commit -m "Stop tracking local environment file"

# Rotate/revoke the secret in the provider dashboard before anything else.`,
        language: "bash",
      },
    ],
  },
  {
    id: "workflows",
    title: "Team Workflows",
    description: "Trunk-based development, GitFlow, release branches, and enterprise patterns.",
    icon: "Network",
    sections: [
      {
        id: "workflow-models",
        title: "Workflow Models",
        content: String.raw`
Different teams need different branch strategies.

| Model | Best for | Tradeoff |
|---|---|---|
| GitHub Flow | Web apps, continuous delivery | Requires healthy main |
| Trunk-based development | Fast teams with strong CI | Needs discipline and feature flags |
| GitFlow | Scheduled releases with support branches | More branch overhead |
| Fork workflow | Open source contributions | Extra remote sync steps |

Choose based on release frequency, review needs, compliance, team size, and rollback strategy.

<details>
<summary>Choose a workflow</summary>

SaaS app deploying daily: GitHub Flow or trunk-based development.

Library with long-lived version support: release branches plus tags.

Open-source project with external contributors: fork workflow.

</details>
        `,
        code: String.raw`# GitHub Flow
main -> feature branch -> PR -> merge -> deploy

# Release branch
main -> release/1.8 -> tag v1.8.0 -> hotfix branch -> tag v1.8.1

# Fork flow
upstream/main -> origin/feature -> PR to upstream/main`,
        language: "text",
      },
      {
        id: "release-hotfix",
        title: "Release and Hotfix Flow",
        content: String.raw`
Release branches let teams stabilize a version while main continues moving.

Hotfix flow:

1. Branch from the released tag or release branch.
2. Apply the minimal fix.
3. Test.
4. Merge/cherry-pick to the release branch.
5. Tag a patch release.
6. Bring the fix back to main.

The important rule: do not let release-only fixes disappear. Main must receive them too unless intentionally obsolete.

<details>
<summary>Hotfix drill</summary>

Production v2.3.0 has a login bug. Create hotfix/login-from-v2.3 from v2.3.0, commit the fix, tag v2.3.1 after merge, then merge or cherry-pick the fix back to main.

</details>
        `,
        code: String.raw`git fetch origin --tags
git switch -c hotfix/login-from-v2.3 v2.3.0
git commit -am "Fix login callback for patch release"
git push -u origin hotfix/login-from-v2.3

# After merge to release branch
git switch release/2.3
git pull --ff-only
git tag -a v2.3.1 -m "Release v2.3.1"
git push origin v2.3.1`,
        language: "bash",
      },
      {
        id: "large-repo-hygiene",
        title: "Large Repo Hygiene",
        content: String.raw`
Large repositories need stronger conventions.

Useful practices:

- keep generated artifacts out of Git unless required.
- use Git LFS for large binary assets.
- use CODEOWNERS for review routing.
- use sparse checkout for large monorepos.
- keep CI incremental and cache dependency installs.
- prune stale branches.
- protect release and main branches.

<details>
<summary>Repo health checklist</summary>

Can a new developer clone, install, test, and open a PR in under one hour? If not, improve README, scripts, env examples, CI speed, and onboarding issues.

</details>
        `,
        code: String.raw`git count-objects -vH
git remote prune origin
git branch --merged main

# Git LFS example
git lfs install
git lfs track "*.psd"
git add .gitattributes
git commit -m "Track design assets with Git LFS"`,
        language: "bash",
      },
    ],
  },
  {
    id: "practical-labs",
    title: "Interactive Labs",
    description: "Hands-on drills to repeat until the commands feel natural.",
    icon: "Target",
    sections: [
      {
        id: "lab-first-repo",
        title: "Lab 1: First Repository",
        content: String.raw`
Goal: create a repository, make several commits, and inspect the graph.

Repeat this lab until you can explain the working tree, staging area, and commit history without looking.

<details>
<summary>Expected learning</summary>

You should see how git add stages content, how git commit records snapshots, and how git log shows the commit chain.

</details>
        `,
        code: String.raw`mkdir git-lab
cd git-lab
git init
git config user.name "Practice User"
git config user.email practice@example.com

echo "# Git Lab" > README.md
git status
git add README.md
git commit -m "Add README"

echo "First note" > notes.txt
git add notes.txt
git commit -m "Add notes"

git log --oneline --decorate --graph --all`,
        language: "bash",
      },
      {
        id: "lab-branch-conflict",
        title: "Lab 2: Branch and Conflict",
        content: String.raw`
Goal: intentionally create a conflict and resolve it.

This removes fear. Conflicts become normal once you have created and solved a few on purpose.

<details>
<summary>Expected learning</summary>

You should understand divergent branches, conflict markers, staging the resolution, and the final merge commit.

</details>
        `,
        code: String.raw`git switch -c feature/a
echo "color=blue" > settings.txt
git add settings.txt
git commit -m "Set color to blue"

git switch main
echo "color=green" > settings.txt
git add settings.txt
git commit -m "Set color to green"

git merge feature/a
# Open settings.txt, choose final value, remove markers.
git add settings.txt
git commit
git log --oneline --decorate --graph --all`,
        language: "bash",
      },
      {
        id: "lab-rebase-cleanup",
        title: "Lab 3: Rebase Cleanup",
        content: String.raw`
Goal: create noisy commits, then clean them with interactive rebase.

Interactive rebase is where Git starts feeling like a craft tool. Use it on private branches.

<details>
<summary>Expected learning</summary>

You should be able to squash small fixup commits, reword a weak message, and safely force-push your own branch with --force-with-lease.

</details>
        `,
        code: String.raw`git switch -c feature/noisy-history
echo "one" > cleanup.txt
git add cleanup.txt
git commit -m "wip"

echo "two" >> cleanup.txt
git add cleanup.txt
git commit -m "fix"

echo "three" >> cleanup.txt
git add cleanup.txt
git commit -m "final maybe"

git log --oneline -3
git rebase -i HEAD~3
git log --oneline -3`,
        language: "bash",
      },
      {
        id: "lab-bisect",
        title: "Lab 4: Bisect a Bug",
        content: String.raw`
Goal: use binary search to find the first bad commit.

In real projects, replace the manual check with a test command. Git can automate bisect with git bisect run when your test exits 0 for good and nonzero for bad.

<details>
<summary>Expected learning</summary>

You should understand that debugging history is faster when you can identify one known good point and one known bad point.

</details>
        `,
        code: String.raw`git bisect start
git bisect bad
git bisect good v1.0.0

# Run your check at each step, then mark:
git bisect good
# or
git bisect bad

git bisect reset

# Automated form
git bisect start HEAD v1.0.0
git bisect run npm test`,
        language: "bash",
      },
    ],
  },
  {
    id: "cheatsheets",
    title: "Cheatsheets",
    description: "Command recipes, scenarios, anti-patterns, and source map.",
    icon: "BookOpen",
    sections: [
      {
        id: "command-map",
        title: "Command Map",
        content: String.raw`
Use this as your quick lookup.

| Goal | Command |
|---|---|
| See state | git status |
| See unstaged changes | git diff |
| See staged changes | git diff --cached |
| Stage file | git add path |
| Stage hunks | git add -p |
| Commit | git commit -m "Message" |
| See graph | git log --oneline --graph --decorate --all |
| Create branch | git switch -c branch |
| Merge branch | git merge branch |
| Rebase branch | git rebase origin/main |
| Fetch remote | git fetch origin |
| Pull fast-forward only | git pull --ff-only |
| Push first time | git push -u origin branch |
| Stash | git stash push -m "message" |
| Recover movement | git reflog |
| Find bug commit | git bisect |

<details>
<summary>Memory drill</summary>

Say the four-place model out loud: working tree, staging area, local repository, remote repository. Then map one command to each movement between places.

</details>
        `,
        code: String.raw`# Daily golden loop
git status
git diff
git add -p
git diff --cached
git commit -m "Clear focused message"
git fetch origin
git rebase origin/main
git push`,
        language: "bash",
      },
      {
        id: "scenario-recipes",
        title: "Scenario Recipes",
        content: String.raw`
Real mastery is choosing the right command under pressure.

| Scenario | Recipe |
|---|---|
| I committed to wrong branch | git switch correct-branch, git cherry-pick sha, then clean wrong branch |
| I need only one file from another branch | git restore --source branch -- path |
| I need to undo pushed bad commit | git revert sha |
| I lost a commit after reset | git reflog, then branch from the old HEAD |
| My branch is behind main | git fetch origin, git rebase origin/main |
| I need a clean PR | git rebase -i, squash/reword, push --force-with-lease |
| I have dirty work and urgent fix | git worktree add ../hotfix main |

<details>
<summary>Pressure test</summary>

Production branch has a bad pushed commit. Do not reset shared history first. Revert the bad commit, push, and open a PR or emergency change according to policy.

</details>
        `,
        code: String.raw`# Take one file from another branch
git restore --source feature/search -- src/search.js

# Recover after accidental reset
git reflog
git switch -c recovered-work HEAD@{1}

# Wrong branch fix
git log --oneline -1
git switch correct-branch
git cherry-pick HEAD@{1}`,
        language: "bash",
      },
      {
        id: "anti-patterns",
        title: "Anti-Patterns",
        content: String.raw`
Avoid these habits:

- committing secrets.
- using git add . blindly in large changes.
- force-pushing shared branches without coordination.
- rebasing public history others depend on.
- making huge mixed commits.
- ignoring CI failures.
- merging main into a feature branch repeatedly when the team expects rebase.
- deleting branches before work is merged or recovered.
- treating git blame as personal blame.

Better replacements:

| Anti-pattern | Better habit |
|---|---|
| git add . always | git add -p or specific paths |
| one giant commit | several reviewable commits |
| force push | force-with-lease on your own branch |
| panic reset | inspect status, reflog, stash/branch first |

<details>
<summary>Final readiness quiz</summary>

Can you explain the difference between merge and rebase?

Can you recover a lost commit with reflog?

Can you resolve a conflict manually?

Can you protect main with required reviews and CI?

Can you create a PR with a useful test plan?

If yes, you are ready for real team Git work. Keep practicing the labs until the answers are automatic.

</details>
        `,
        code: String.raw`# Safer review before committing
git status --short
git diff --stat
git add -p
git diff --cached --check
git commit

# Safer push after history cleanup
git fetch origin
git push --force-with-lease`,
        language: "bash",
      },
      {
        id: "research-sources",
        title: "Research and Source Map",
        content: String.raw`
This guide is grounded in the official Git and GitHub documentation.

Primary references:

- Git tutorial and command reference: https://git-scm.com/docs/gittutorial
- Pro Git branching model: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
- Pro Git reset model: https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified
- GitHub rebase guide: https://docs.github.com/en/get-started/using-git/about-git-rebase
- GitHub Flow: https://docs.github.com/en/get-started/using-github/github-flow
- GitHub Actions: https://docs.github.com/en/actions
- Protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub security features: https://docs.github.com/en/code-security/getting-started/github-security-features

<details>
<summary>How to continue researching</summary>

For any Git command, run git help command-name locally. For GitHub platform behavior, prefer docs.github.com because UI and security features change over time.

</details>
        `,
        code: String.raw`git help rebase
git help reset
git help worktree
git help revisions
git help gitignore`,
        language: "bash",
      },
    ],
  },
];
