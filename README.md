# Lichengda industrial heating and temperature sensing website

English B2B catalog for Xiamen Lichengda Precision Manufacturing Co., Ltd. (厦门利诚达精密制造有限公司), covering made-to-spec thermocouples, tubular heaters, immersion heaters and related industrial heating elements.

## Local development

Requires Node.js 22 or newer. There are no npm dependencies.

```sh
npm run dev
```

Open `http://localhost:4173`. Set `PORT` to use another port. Run `npm run build` after editing the source to regenerate `dist/`. The local server reads the built pages on each request.

- `src/catalog.mjs` defines catalog entries, configurations, applications and guides.
- `src/build.mjs` generates HTML pages.
- `public/` contains styles, browser behavior and assets.

## Production build

Use the actual hosting domain for the production build.

```sh
SITE_URL='https://example.com' npm run build
```

Publish the contents of `dist/` to a static host at the root of the configured domain. The build adds canonical URLs, a sitemap, a sitemap reference in robots.txt and a curated `llms.txt` index when `SITE_URL` is set.

The site displays Lichengda as the brand and the English and Chinese company names in the footer. The current logo mark is provisional, and the product illustrations should be replaced with approved product photography before public launch.

The footer and quote page link to `stella@lichengdaheating.com` and WhatsApp `+86 18606007249`. The quote form opens a prefilled WhatsApp message or email draft. The visitor reviews and sends it in the selected app. Download RFQ creates an email draft with any selected attachments and also supports long inquiries. Use `RFQ_EMAIL` to override the recipient and `SITE_NAME` to override the site brand during a build.
