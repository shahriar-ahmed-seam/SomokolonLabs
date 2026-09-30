# Org profile & repo setup (gh CLI)

Copy-pasteable commands for wiring up the `Somokolon-Labs` organization profile and the website
repository. Run them from a shell in the repo root unless a step says otherwise.

Legend:

- ✅ **Safe** — creates something new, easy to undo.
- ⚠️ **Careful** — changes visibility or settings on an existing repo.
- 🔴 **Irreversible** — cannot be undone from the CLI; may break links, clones, and CI.

## 0. Prerequisites (✅ safe)

```bash
gh --version
gh auth status
```

If you are not authenticated with an account that owns or admins the org:

```bash
gh auth login --scopes "repo,admin:org,read:org"
```

Confirm you can see the org:

```bash
gh api user/orgs --jq '.[].login'
```

## 1. Create the org `.github` repo (✅ safe)

This repo hosts the organization profile. The name must be exactly `.github`.

```bash
gh repo create Somokolon-Labs/.github --public \
  --description "Organization profile and shared community health files for Somokolon Labs"
```

## 2. Add `profile/README.md` (✅ safe)

Clone it somewhere outside this project, then copy the profile file in.

```bash
cd ~  # or any scratch directory outside the website repo
gh repo clone Somokolon-Labs/.github somokolon-dot-github
cd somokolon-dot-github
mkdir -p profile
```

Copy the prepared file (adjust the source path to wherever this project lives):

```bash
# macOS / Linux
cp "$HOME/Desktop/Checklist-APPS/Somokolon-Labs/SomokolonLabs/github-org-profile/README.md" profile/README.md
```

```powershell
# Windows PowerShell
Copy-Item "$HOME\Desktop\Checklist-APPS\Somokolon-Labs\SomokolonLabs\github-org-profile\README.md" -Destination profile\README.md
```

Remove the placement comment block at the top of `profile/README.md` if you would rather not ship
it, then commit and push:

```bash
git add profile/README.md
git commit -m "docs: add organization profile README"
git push origin HEAD
```

Verify: open https://github.com/Somokolon-Labs — the profile should render.

## 3. Website repo under the org

Pick **one** of 3a or 3b.

### 3a. Transfer the existing repo (🔴 irreversible)

Moves `shahriar-ahmed-seam/SomokolonLabs` to the org. GitHub sets up redirects, but the canonical
path changes: local remotes, deploy integrations (Vercel), badge URLs, and any hardcoded links
must be updated. **There is no CLI undo — transferring back is a second transfer, and some
settings (secrets, some webhooks, Actions caches) do not follow the repo.**

Before transferring, check what will move:

```bash
gh repo view shahriar-ahmed-seam/SomokolonLabs --json name,visibility,defaultBranchRef,url
gh secret list --repo shahriar-ahmed-seam/SomokolonLabs
gh variable list --repo shahriar-ahmed-seam/SomokolonLabs
```

Transfer (🔴 irreversible):

```bash
gh api -X POST repos/shahriar-ahmed-seam/SomokolonLabs/transfer \
  -f new_owner=Somokolon-Labs
```

Optionally rename to match the site domain (⚠️ careful — changes the URL again):

```bash
gh repo rename somokolonlabs.com --repo Somokolon-Labs/SomokolonLabs
```

Point your local clone at the new path (✅ safe, run inside the website repo):

```bash
git remote set-url origin https://github.com/Somokolon-Labs/somokolonlabs.com.git
git remote -v
```

Re-add any secrets that did not carry over (✅ safe):

```bash
gh secret set RESEND_API_KEY --repo Somokolon-Labs/somokolonlabs.com
```

<!-- TODO(you): decide transfer vs fresh repo, and confirm the final repo name. The CI badge in
     README.md must match whatever you land on. -->

### 3b. Create a fresh org repo instead (✅ safe)

Keeps the personal repo untouched and pushes the current code to a new org repo.

```bash
gh repo create Somokolon-Labs/somokolonlabs.com --public \
  --description "Website for Somokolon Labs — AI & software development studio" \
  --homepage "https://somokolonlabs.com"
```

Then, from the website repo root:

```bash
git remote add org https://github.com/Somokolon-Labs/somokolonlabs.com.git
git push org main
```

Once you are satisfied, make `org` the primary remote (⚠️ careful):

```bash
git remote rename origin personal
git remote rename org origin
```

## 4. Repo hygiene (⚠️ careful — overwrites existing settings)

```bash
gh repo edit Somokolon-Labs/somokolonlabs.com \
  --homepage "https://somokolonlabs.com" \
  --enable-issues \
  --enable-projects=false \
  --enable-wiki=false \
  --delete-branch-on-merge \
  --add-topic nextjs \
  --add-topic typescript \
  --add-topic tailwindcss \
  --add-topic website
```

## 5. Manual dashboard steps

These have no reliable CLI equivalent:

1. **Pin repositories on the org page** — go to https://github.com/Somokolon-Labs, click
   **Customize pins** (top right of the repo list), select up to six repos, then **Save pins**.
   Suggested order: the website, Nexus Agent Orchestrator, OrionStream ML, Vector Vault DB,
   ResoNet, POS Suite.
2. **Org profile details** — Organization **Settings → Profile**: upload the logo, set the
   display name "Somokolon Labs", location "Dhaka, Bangladesh", email hello@somokolonlabs.com,
   and website https://somokolonlabs.com.
3. **Branch protection on `main`** — repo **Settings → Branches → Add rule**: require the `build`
   status check from the CI workflow, require a pull request before merging.
4. **Vercel** — reconnect the project to the new repo path in the Vercel dashboard after a
   transfer or re-create, and re-check the production domain mapping.
5. **Private vulnerability reporting** — repo **Settings → Security** → enable, to match
   SECURITY.md.
