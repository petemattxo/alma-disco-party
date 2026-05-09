# Cloudflare Pages Setup Guide

This guide explains how to deploy this Astro invitation site to Cloudflare Pages and how to prepare it for a secure RSVP form that forwards to an n8n webhook using Basic Auth.

## Official Cloudflare documentation

Start here if you want the source-of-truth docs:

- Cloudflare Pages overview: <https://developers.cloudflare.com/pages/>
- Pages Git integration: <https://developers.cloudflare.com/pages/get-started/git-integration/>
- Pages build configuration: <https://developers.cloudflare.com/pages/configuration/build-configuration/>
- Pages custom domains: <https://developers.cloudflare.com/pages/configuration/custom-domains/>
- Pages Functions overview: <https://developers.cloudflare.com/pages/functions/>
- Pages Functions get started: <https://developers.cloudflare.com/pages/functions/get-started/>
- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>
- Pages Functions bindings, variables, and secrets: <https://developers.cloudflare.com/pages/functions/bindings/>
- Pages limits: <https://developers.cloudflare.com/pages/platform/limits/>

## Recommended architecture for this project

Use Cloudflare Pages for the static Astro site and a small Pages Function for the form.

```txt
Visitor browser
  -> Cloudflare Pages static site
  -> POST /api/rsvp
  -> Cloudflare Pages Function
  -> n8n webhook with Basic Auth
```

Do **not** submit directly from the browser to the n8n webhook if it requires Basic Auth. Anything in the browser can be inspected, including the webhook URL and authorization header.

## Before you start

You need:

- A GitHub account with this project pushed to a repository.
- A Cloudflare account. The Free plan is enough for this project.
- Your n8n webhook URL.
- Your n8n Basic Auth username and password.
- Optional: a custom domain.

This project is an Astro project. Cloudflare Pages should use:

```txt
Build command: npm run build
Build output directory: dist
```

## Step 1: Check whether you already have a Cloudflare account

1. Go to <https://dash.cloudflare.com/>.
2. Try logging in with your usual email addresses.
3. If Cloudflare says no account exists, create a new account.
4. Choose the Free plan if prompted.
5. After login, you should land in the Cloudflare dashboard.

You do not need to buy anything to deploy to a free `*.pages.dev` URL.

## Step 2: Make sure the project is on GitHub

Cloudflare Pages works best for beginners when connected to GitHub.

1. Open GitHub.
2. Create a repository for this project if you do not already have one.
3. Push the project code to GitHub.
4. Confirm that GitHub shows files such as:
   - `package.json`
   - `astro.config.mjs`
   - `src/`
   - `public/`

## Step 3: Create the Cloudflare Pages project

1. Open <https://dash.cloudflare.com/>.
2. Select your account.
3. Go to **Workers & Pages**.
4. Select **Create application**.
5. Select **Pages**.
6. Select **Connect to Git**.
7. Choose GitHub.
8. Authorize Cloudflare to access the repository.
9. Select this project repository.
10. Click **Begin setup**.

## Step 4: Configure build settings

Use these settings:

```txt
Project name: alma-60-invitation
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: / or leave blank
```

If the repository uses `master` instead of `main`, choose `master` as the production branch.

Then select **Save and Deploy**.

## Step 5: Wait for the first deployment

Cloudflare will install dependencies, run the build command, and upload the built site.

When it succeeds, you will get a URL like:

```txt
https://alma-60-invitation.pages.dev
```

Open that URL and verify:

- The page loads.
- Images and fonts load.
- The layout looks correct on desktop and mobile.
- Any RSVP form UI appears as expected.

## Step 6: Prepare the Pages Function for the RSVP form

For the n8n webhook, the frontend should submit to an internal endpoint such as:

```txt
/api/rsvp
```

In Cloudflare Pages, that route should be implemented with a file like:

```txt
functions/api/rsvp.ts
```

The function should:

1. Only allow `POST` requests.
2. Validate required fields.
3. Build the Basic Auth header server-side.
4. Forward the request to the n8n webhook.
5. Return a safe success/error response to the browser.

Do not put these values in frontend code:

```txt
N8N_WEBHOOK_URL
N8N_BASIC_AUTH_USER
N8N_BASIC_AUTH_PASSWORD
```

They must be Cloudflare secrets or encrypted environment variables.

## Step 7: Add n8n secrets in Cloudflare

After the Pages project exists:

1. Go to **Workers & Pages**.
2. Select the `alma-60-invitation` Pages project.
3. Go to **Settings**.
4. Go to **Variables and Secrets**.
5. Add these values:

```txt
N8N_WEBHOOK_URL
N8N_BASIC_AUTH_USER
N8N_BASIC_AUTH_PASSWORD
```

For each sensitive value, choose **Encrypt** before saving.

Recommended setup:

| Name | Type | Notes |
|---|---|---|
| `N8N_WEBHOOK_URL` | Secret or variable | Secret is safest. |
| `N8N_BASIC_AUTH_USER` | Secret | Do not expose in frontend code. |
| `N8N_BASIC_AUTH_PASSWORD` | Secret | Do not expose in frontend code. |

After adding or changing these values, redeploy the Pages project so the Function receives the new environment.

## Step 8: Redeploy after adding the Function or secrets

Cloudflare deploys automatically when you push to the production branch.

To redeploy manually:

1. Go to **Workers & Pages**.
2. Select the Pages project.
3. Go to **Deployments**.
4. Select the latest production deployment.
5. Choose **Retry deployment** if available.

Alternatively, push a small commit to GitHub.

## Step 9: Test the form

Test in this order:

1. Open the `*.pages.dev` URL.
2. Fill out the RSVP form with test data.
3. Submit the form.
4. Confirm the page shows a success state.
5. Check n8n and confirm the webhook received the submission.
6. Test a missing required field and confirm the page/function rejects it cleanly.

If the form fails:

- In Cloudflare, open the Pages project.
- Go to **Functions** or deployment logs.
- Look for errors from `/api/rsvp`.
- Confirm the secret names exactly match the names used in the Function code.
- Confirm the n8n webhook URL is correct.
- Confirm Basic Auth is enabled and the credentials are correct in n8n.

## Step 10: Optional custom domain

If you want to spend $0, skip this step and use the `*.pages.dev` URL.

If you want a cleaner invite URL, buy a domain from one of:

- Cloudflare Registrar
- Porkbun
- Namecheap / Spaceship

Expect most normal domains to require a one-year registration even if the site is only needed for one or two months.

### Add the domain to Pages

1. In Cloudflare, go to **Workers & Pages**.
2. Select the Pages project.
3. Go to **Custom domains**.
4. Select **Set up a domain**.
5. Enter the domain or subdomain.
6. Follow the DNS instructions Cloudflare provides.

For an apex domain like:

```txt
alma60.com
```

Cloudflare usually expects the domain to be added to Cloudflare DNS.

For a subdomain like:

```txt
invite.alma60.com
```

you can usually create a CNAME pointing to:

```txt
alma-60-invitation.pages.dev
```

Important: add the custom domain inside the Pages project first. Do not only create the DNS record manually.

## Step 11: After the event

When the invitation is no longer needed:

1. Go to **Workers & Pages**.
2. Select the Pages project.
3. Go to **Settings**.
4. Delete the project if you no longer need it.
5. If you used a custom domain, remove the Pages custom domain and DNS record first.
6. If you bought a temporary domain, turn off auto-renewal at the registrar if you do not want to keep it.

## Beginner-friendly checklist

- [ ] Cloudflare account exists and is on the Free plan.
- [ ] Project is pushed to GitHub.
- [ ] Cloudflare Pages project is connected to GitHub.
- [ ] Framework preset is Astro.
- [ ] Build command is `npm run build`.
- [ ] Output directory is `dist`.
- [ ] First deployment succeeds.
- [ ] Site works at `*.pages.dev`.
- [ ] RSVP form posts to `/api/rsvp`, not directly to n8n.
- [ ] n8n webhook URL and Basic Auth credentials are stored as Cloudflare secrets.
- [ ] Form submission reaches n8n.
- [ ] Optional custom domain is connected.
- [ ] Auto-renewal is disabled for any temporary domain you do not want to keep.

## Recommended decision for this project

Use Cloudflare Pages with a Pages Function. Do not use a separate Worker unless the backend grows beyond this single RSVP forwarding endpoint.

This keeps the project cheap, simple, and secure.
