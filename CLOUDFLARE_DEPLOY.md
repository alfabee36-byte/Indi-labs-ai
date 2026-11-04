# Deploy Indi Labs to Cloudflare Workers (Free)

This repository serves the Vite-built React app as static assets and handles the two AI endpoints in `worker.ts`. The Gemini key stays on the server as a Worker secret.

## 1. Create a Cloudflare account

Open https://dash.cloudflare.com/sign-up and create a free account. Choose the Workers Free plan. Do not start a paid subscription or add a payment method if you do not want to.

Cloudflare may apply account-verification checks depending on its current risk controls. If the signup flow itself insists on a payment card, stop; do not choose a paid plan. The free plan's published limits are documented at https://developers.cloudflare.com/workers/platform/limits/.

## 2. Deploy from GitHub

1. Sign in to https://dash.cloudflare.com/.
2. Open **Workers & Pages**.
3. Choose **Create application** / **Create Worker**, then the GitHub repository import option (the exact labels can change).
4. Connect GitHub and select `alfabee36-byte/Indi-labs-ai`, branch `main`.
5. Configure the build:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Deploy command, if requested: `npx wrangler deploy`
   - Root directory: repository root
6. Deploy. The `wrangler.jsonc` file configures the Worker and static assets.

If the dashboard only offers a Pages project, do not deploy this as a plain static Pages site: the `/api/ai/*` endpoints need the Worker runtime. Choose Workers with a GitHub build instead.

## 3. Add the Gemini secret (optional)

In the Worker settings, open **Settings → Variables and Secrets** and add:
- Name: `GEMINI_API_KEY`
- Value: your Google AI Studio API key

Mark it as a secret. Never commit the key to GitHub or put it in a Vite `VITE_*` variable. Without the secret, the app's AI endpoints return built-in fallback examples.

## 4. Configure Firebase sign-in

In Firebase Console → Authentication → Settings → Authorized domains, add the exact `*.workers.dev` hostname Cloudflare assigned to this app (without a path). Confirm Google sign-in is enabled. The Firebase project and Firestore database must remain active and correctly configured.

The Firebase web API key in `firebase-applet-config.json` is a browser client identifier, not a server secret. Do not publish service-account JSON or private keys.

## 5. Verify

Open the deployed HTTPS URL on Android Chrome. Test:
- app loads and mobile navigation works;
- Google/email sign-in;
- Script Studio calls `/api/ai/script`;
- Niche Radar calls `/api/ai/niche-insights`.

## Free-plan notes

Cloudflare's published Workers Free allowance currently includes up to 100,000 Worker requests per day; static asset requests are free and unlimited. Limits and signup verification policies can change. Gemini API usage may have separate Google quotas or charges, so check your Google AI Studio account before adding a key.
