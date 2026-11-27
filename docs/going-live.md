# Going live

Everything is built. Going live is only creating three free accounts and pasting their keys in two places: **GitHub** (database, app builds, housekeeping) and **Vercel** (website). Until then, the website and the app run on sample data.

Allow about 30 minutes.

---

## 1. Supabase (database, sign-in, photos)

1. Go to [supabase.com](https://supabase.com) → **New project**.
   - Name: `selit` · Region: **West EU (London)** or the closest to Nigeria · set a strong **database password** and save it.
2. When it's ready, open **Project Settings → API** and copy:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key
   - **service_role** key (secret, never put it in an app)
   - The **project reference** is the `abcd1234` part of the URL.
3. Open **Account (top right) → Access Tokens → Generate new token**, name it `github`, copy it.
4. Open **Authentication → URL Configuration**:
   - **Site URL**: your website address, e.g. `https://selit.ng`
   - **Redirect URLs** → add `https://selit.ng/**` and `selit://**`
5. Open **Authentication → Sign In / Providers → Email** and make sure **Confirm email** is on.

## 2. GitHub (the repository)

Open the repository → **Settings → Secrets and variables → Actions → New repository secret**, and add each of these:

| Secret                      | Value                               |
| --------------------------- | ----------------------------------- |
| `SUPABASE_URL`              | Project URL from step 1.2           |
| `SUPABASE_ANON_KEY`         | anon public key                     |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key                    |
| `SUPABASE_PROJECT_REF`      | the project reference               |
| `SUPABASE_DB_PASSWORD`      | the database password from step 1.1 |
| `SUPABASE_ACCESS_TOKEN`     | the access token from step 1.3      |
| `EXPO_TOKEN`                | from step 3 below                   |

Then open **Actions → Database → Run workflow**. It tests the rules and creates every table, rule and photo bucket in Supabase.

## 3. Expo (the Android and iOS app)

1. Sign in at [expo.dev](https://expo.dev) as **malvis** (or change `owner` in `mobile/app.json` to your Expo username).
2. **Account settings → Access tokens → Create**, copy it into the GitHub secret `EXPO_TOKEN`.
3. In GitHub **Actions**, run **Setup Expo project** once. It links the app and turns on over-the-air updates.
4. Run **Build Android APK**. When it finishes (about 15 minutes), the run summary shows the APK link. Open it on your phone to install.

From then on, every push that changes the app reaches installed phones by itself. Close and reopen the app twice to load an update.

## 4. Vercel (the website)

1. At [vercel.com](https://vercel.com) → **Add New → Project** → import the `selit` repository.
2. **Root Directory**: `web`. Framework: Next.js (detected).
3. **Environment Variables**:

| Name                            | Value                                         |
| ------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key                               |
| `NEXT_PUBLIC_SITE_URL`          | your website address, e.g. `https://selit.ng` |
| `NEXT_PUBLIC_SUPPORT_EMAIL`     | your support inbox                            |

4. **Deploy**. Add your domain under **Settings → Domains**.

## 5. Make yourself an admin

Sign up on the website or the app, confirm your email, then in Supabase open **SQL Editor → New query**, paste this with your email, and **Run**:

```sql
update public.profiles
set role = 'admin', verification_status = 'verified'
where id = (select id from auth.users where email = 'you@example.com');
```

Sign out and back in. **Admin** now appears in your account menu.

---

## What runs by itself

| Job                | When                           | What it does                                                                                  |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------- |
| CI                 | every push                     | Type checks, lint, website build, secret scan, dependency audit                               |
| Database           | push to `backend/`             | Tests the rules, then applies new migrations                                                  |
| Publish app update | push to `mobile/` or `shared/` | Sends the new version to installed phones                                                     |
| Housekeeping       | daily, 03:17 UTC               | Keeps the free project awake; deletes sold or expired listings after 30 days and their photos |

## Free plan limits

Supabase's free plan gives 500 MB of database and 1 GB of photo storage. Photos are shrunk to WebP on the phone (about 150 to 300 KB each), ID photos are deleted after review, and old listings are cleared daily, so these limits go a long way. The free project pauses after a week with no visits; the daily housekeeping job prevents that.
