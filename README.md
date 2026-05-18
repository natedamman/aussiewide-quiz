# Aussiewide Financial Services — Quiz Funnel

Standalone quiz funnel. Pure HTML, CSS, and vanilla JavaScript. No build tools, no frameworks, no external dependencies (except the optional Calendly embed and Meta Pixel, both of which are loaded at runtime and degrade gracefully if unavailable).

---

## Quick start

Open `index.html` in any browser. No server required.

---

## 1. Swap placeholder values in config.js

All client-specific values live in one file: `config.js`. Edit this file only — nothing else needs to change.

| Key | What to replace | Example |
|---|---|---|
| `metaPixelId` | Meta Pixel ID from Events Manager | `'1234567890123456'` |
| `webhookUrl` | Zapier / Make / n8n webhook URL | `'https://hooks.zapier.com/hooks/catch/...'` |
| `calendlyUrl` | Full Calendly scheduling link | `'https://calendly.com/aussiewide/strategy'` |
| `businessPhone` | Phone number displayed on thank-you page | `'1800 111 222'` |
| `businessEmail` | Contact email (used in mailto fallback) | `'hello@aussiewidefs.com.au'` |
| `businessName` | Display name (currently used in title/meta) | `'Aussiewide Financial Services'` |
| `googleReviewsUrl` | Google Reviews link for trust badge | `'https://g.page/r/...'` |

---

## 2. Other placeholders to replace before launch

Search the HTML files for these strings and replace each one:

- `[INSERT ACL NUMBER]` — Australian Credit Licence number (appears in footer of both pages)
- Testimonials on `thank-you.html` — marked with HTML comment `REPLACE WITH VERIFIED REAL CLIENT REVIEWS BEFORE LAUNCH`

---

## 3. Deploy (static hosting)

**Netlify (drag and drop)**
1. Go to [netlify.com](https://netlify.com) and log in
2. Drag the entire `aussiewide-quiz/` folder onto the deploy area
3. Done — you get a public URL immediately

**Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --dir aussiewide-quiz --prod
```

**Vercel**
```bash
npm install -g vercel
cd aussiewide-quiz
vercel --prod
```

**Any static host** (Cloudflare Pages, GitHub Pages, AWS S3 + CloudFront, etc.)
Upload all five files as-is. No server-side processing required.

---

## 4. Meta Pixel verification

1. Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
2. Open `index.html` (hosted or via file://)
3. Verify these events fire:
   - `PageView` — on page load
   - `ViewContent` — when quiz overlay opens (click any CTA)
   - `QuizTrackSelected` (custom) — when user picks FHB / Refi / Investor
   - `Lead` — on contact form submission
4. Open `thank-you.html?audience=fhb` and verify `Lead` fires on page load (backup event)
5. Cross-check in Meta Events Manager under Test Events tab

---

## 5. Test the webhook

1. Set `webhookUrl` in `config.js` to a [webhook.site](https://webhook.site) test URL temporarily
2. Complete the quiz end-to-end with test data
3. Check webhook.site — you should see a JSON payload including:
   - `firstName`, `email`, `phone`
   - `track` (fhb / refi / investor)
   - `score` (number of high-value answers)
   - `priority` (high / normal)
   - `answers` object with all responses
   - `timestamp` and `sourceUrl`
4. Replace with your real Zapier/Make/n8n webhook URL
5. Map fields in your automation tool as needed

**High-value lead flag:** If `priority === 'high'` (3 or more high-value answers), consider routing to a priority CRM pipeline or triggering an immediate SMS to the broker.

---

## 6. Pre-launch checklist

- [ ] `config.js` — all placeholder values replaced
- [ ] ACL number inserted in both HTML files (search `[INSERT ACL NUMBER]`)
- [ ] Real client testimonials replace sample reviews on `thank-you.html`
- [ ] Meta Pixel verified firing (PageView, ViewContent, Lead)
- [ ] Webhook tested end-to-end with real form submission
- [ ] Calendly URL configured and booking embed tested
- [ ] Privacy policy link updated (currently `href="#"`)
- [ ] Phone number correct and `tel:` link updated
- [ ] MFAA / aggregator badge added if required for compliance
- [ ] Test all three quiz tracks (FHB, Refi, Investor) through to thank-you page
- [ ] Test on mobile (real device, not just browser devtools)
- [ ] URL parameters tested: `?audience=fhb`, `?audience=refi`, `?audience=investor`

---

## File structure

```
aussiewide-quiz/
├── index.html      Landing page + quiz overlay
├── thank-you.html  Post-submission confirmation + Calendly booking
├── config.js       All placeholder values — edit this first
├── quiz.js         Quiz engine, question data, scoring, pixel events
├── styles.css      Mobile-first CSS with custom properties
└── README.md       This file
```

---

## URL parameter targeting

Drive Meta ad traffic with audience-specific landing pages using the `?audience=` parameter:

| URL | Audience | Hero headline |
|---|---|---|
| `/` or `/?audience=` | Universal | Know exactly where you stand with property in 60 seconds. |
| `/?audience=fhb` | First home buyers | You're closer to your first home than you think. |
| `/?audience=refi` | Refinancers | Most homeowners are overpaying on their mortgage right now. |
| `/?audience=investor` | Investors | Find out how much you can borrow for your next property. |

Use these as separate ad destination URLs for each campaign audience.
