# What to do next

Do these in order. Each step ends with what to send me.

Good to know: your domain's DNS is managed at **Sitechai**, and your email
already runs on **Zoho Mail**. Most steps below happen in those two places.

**Progress (Oct 1):**

- Steps 1–4 are done.
  - The contact form is live, and a test message was delivered to `hello@`.
  - The founder photo (taken from your portfolio site) is on the About page.
- Google's sitemap still showed "Couldn't fetch" right after you submitted it.
  See the note under Step 3.
- Step 5 is skipped for now.
- Steps 6 and 7 are for later.

---

## Step 1. Make the two email addresses real

The website shows `hello@somokolonlabs.com` and `security@somokolonlabs.com`.
Both must actually receive mail.

1. Log in to Zoho Mail Admin Console: <https://mailadmin.zoho.com>
2. Check that `hello@somokolonlabs.com` exists. If not, add it as a user or an
   alias.
3. Go to **Users** → click your user → **Email Alias** → **Add**.
4. Type `security`, pick `somokolonlabs.com`, save.
5. From your personal Gmail, send a test email to both addresses. Check they
   arrive.

Tell me: "both emails work".

---

## Step 2. Make the contact form send email (Resend)

1. Sign up at <https://resend.com>.
2. Go to **Domains** → **Add Domain** → type `somokolonlabs.com`.
3. Resend shows 3 or 4 DNS records. Keep that page open.
4. In another tab, log in to Sitechai → your domain → **DNS**.
5. Add each record exactly as Resend shows it (Type, Name, Value, Priority).
   - If Sitechai adds `.somokolonlabs.com` by itself, type only the short name
     (for example `send`, not `send.somokolonlabs.com`).
   - Do **not** touch the existing Zoho records (MX, SPF, zoho-verification).
     Resend's records use their own names, so they don't clash.
6. Back in Resend, click **Verify**. It can take a few minutes to a few hours.
   Wait until it says **Verified**.
7. Go to **API Keys** → **Create API Key** → permission **Sending access** →
   copy the key (starts with `re_`).
8. Open `.env.local` in the project and add this line:

   ```
   RESEND_API_KEY=re_your_key_here
   ```

   Put it in `.env.local` only. **Not** `.env.example`, because that file is
   public on GitHub.

Tell me: "Resend is verified and the key is in .env.local".
I will add it to Vercel, redeploy and send a test message through the form.

---

## Step 3. Show up on Google (Search Console)

1. Go to <https://search.google.com/search-console>.
2. Click **Add property** → choose **Domain** (left box) → type
   `somokolonlabs.com` → **Continue**.
3. Google shows a TXT record like `google-site-verification=...`. Copy it.
4. In Sitechai DNS, add a new record:
   - Type: `TXT`
   - Name: `@` (or leave blank if Sitechai uses blank for the main domain)
   - Value: the text you copied
   - Add it as a new record. Don't edit the TXT records that are already there.
5. Back in Google, click **Verify**. If it fails, wait an hour and try again.
6. When verified, open **Sitemaps** on the left, enter
   `https://www.somokolonlabs.com/sitemap.xml`, and click **Submit**.

Tell me: "Google is verified". You don't need to send the code.

**If the sitemap says "Couldn't fetch":** this is normal for a brand-new
property. The sitemap itself is fine (checked: valid, 40 pages, all open for
Google). Google usually updates it within 1 to 3 days.

- Meanwhile: click **URL inspection** at the top, paste
  `https://www.somokolonlabs.com/`, then click **Request indexing**.
- If it still says "Couldn't fetch" after 3 days: click the sitemap row →
  the ⋮ menu → **Remove sitemap**, then submit it again.

---

## Step 4. Founder photo ✅ done

To change the photo later, replace `public/founder.jpg` with a new square JPG.

1. Pick a clear photo of your face with a plain background.
2. Square is best, at least 800 × 800 pixels, JPG.
3. Save it in the project folder as `founder.jpg`.

Tell me: "photo is in". I will put it on the About page in place of the "SA"
circle.

---

## Step 5. One more number for Forge (skipped for now)

The other products show real numbers; Forge has fewer. Send me one true number
about it, for example:

- how long a typical run takes, or
- how many tests a run usually writes, or
- how many repos it has built.

Tell me the number and what it means. Only send something you can back up.

---

## Step 6. Demo links on your own domain (later)

Right now "Open live demo" goes to `something.vercel.app`. This moves them to
`cartograph.somokolonlabs.com` and similar.

1. In Sitechai DNS, add one record:
   - Type: `CNAME`
   - Name: `*`
   - Value: `cname.vercel-dns.com`
2. If Sitechai refuses `*`, tell me and I'll give you a short list of names to
   add one by one instead.

Tell me: "wildcard is added". I will attach every subdomain in Vercel, check
each demo loads, and switch the links over.

---

## Step 7. Phone versions of the videos (later)

Only the first clip (`flow`) has a tall phone version. The other five
(`discover`, `plan`, `build`, `run`, `process`) get cropped on phones.

1. Open `docs/video-prompts.md`.
2. Make each clip again in Google Flow with the same prompt, but choose the
   **9:16 (portrait)** shape.
3. Put the files in `video-src/` and name them after the clip, like
   `discover-portrait.mp4`.

Tell me: "phone clips are in". I will encode and add them.
