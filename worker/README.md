# Worker: hosting and the contact form

One Cloudflare Worker serves the static export in `out/` and answers `POST /api/contact`.
The endpoint validates the submission, drops anything that fills the hidden `website`
field, checks the Turnstile token, then emails the enquiry through Email Routing's
`send_email` binding with Reply-To set to the visitor.

- `index.ts`: routing and the `send_email` call
- `contact.ts`: validation, Turnstile check and the email itself (tested with `npm test`)
- `../wrangler.jsonc`: assets, the binding, and the to/from addresses
- `../src/components/ContactForm/useTurnstile.ts`: the widget on the form

## Run it locally

```bash
cp .dev.vars.example .dev.vars   # once: Turnstile's test secret
npm run preview                  # builds with the test site key, serves on :8787
```

Both test keys always pass. Emails aren't sent locally; Wrangler logs the path of a
`.eml` file under `.wrangler/tmp/` instead. Plain `next dev` has no Worker, so the form
shows its email fallback there.

## Cloudflare setup (once, in the dashboard)

Emails only arrive after these steps.

1. **Turnstile.** Add a widget for `webondevices.com` (and the `*.workers.dev`
   preview host if you want to test there). Put the site key in `.env.production`
   as `NEXT_PUBLIC_TURNSTILE_SITE_KEY=...` (it's public, so commit it). Set the
   secret with `npx wrangler secret put TURNSTILE_SECRET_KEY`.
2. **DNS.** Move `webondevices.com` to Cloudflare, copying the existing MX records
   first. Email Routing needs the zone on Cloudflare.
3. **Email Routing.** Enable it on the zone and verify `webondevices@gmail.com` as a
   destination address. `CONTACT_FROM` (`contact@webondevices.com`) must be on this
   domain. If the address changes, update `CONTACT_TO` and `destination_address`
   in `wrangler.jsonc` together.
4. **Deploy.** `npm run deploy`, then add `webondevices.com` as a custom domain on
   the Worker.

Until step 1 the Worker refuses to send (`not_configured`), and the form shows the
email fallback. If DNS can't move to Cloudflare, swap the `send_email` call in
`index.ts` for a request to Resend's API; nothing else changes.

After changing `wrangler.jsonc`, run `npm run cf-typegen` to refresh the `Env` types.
