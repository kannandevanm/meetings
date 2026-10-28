# Check-In Mobile Prototype

Clickable prototype of the Zoho CRM mobile app Check-In / Check-Out feature (Phase I: single user, manual and automatic). It is a static web client with no backend and no external dependencies.

## Structure

```
checkin-mobile-prototype/
  catalyst.json            Catalyst project config (client source = client/)
  client/
    client-package.json    Web client hosting config (homepage = index.html)
    index.html             Page markup
    styles.css             Styles
    app.js                 Prototype logic and simulation
  functions/               Empty; reserved for future serverless functions
```

## Deploy with the Catalyst CLI

1. Install the CLI and sign in:
   `npm install -g zcatalyst-cli` then `catalyst login`
2. From this folder, link it to your Catalyst project (creates `.catalystrc`):
   `catalyst init` and choose **Client** (select the existing `client` directory when asked). Pick the project and environment.
3. Test locally (optional): `catalyst serve`
4. Deploy: `catalyst deploy --only client`

The CLI prints the hosted URL when the deploy finishes. The same page is also available under your project's Web Client Hosting settings in the Catalyst console.

## Notes

- Everything runs in the browser; no data is sent anywhere.
- To change the behaviour, edit `client/app.js` (scenarios and rules) or `client/styles.css`, then deploy again.
