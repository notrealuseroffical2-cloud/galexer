# Galexer Scramjet setup

Galexer's existing interface remains a static GitHub Pages site. Scramjet's browser client assets are assembled into the `site/` artifact by `npm run build`; the Wisp WebSocket transport runs separately because GitHub Pages cannot host a Node/WebSocket server.

## 1. Deploy the transport backend

Deploy the `backend/` directory to a Node hosting service. The repository includes a `render.yaml` blueprint for Render. A free/paused service may sleep and cause a delay on the first connection. Use a service that supports WebSocket upgrades.

The backend should expose:
- `GET /healthz` health check
- `wss://YOUR-HOST/wisp/` WebSocket transport

## 2. Configure the frontend

Edit `proxy-config.js` and set the backend WebSocket endpoint, for example:

```js
window.GALEXER_WISP_URL = "wss://YOUR-HOST/wisp/";
```

Replace `YOUR-HOST` with the real hostname from your host. Do not use an HTTP URL here; the GitHub Pages site requires a secure `wss://` endpoint.

## 3. Enable GitHub Pages

Merge this branch to `main`, then in repository Settings → Pages choose **GitHub Actions** as the build/deployment source. The workflow installs the Scramjet packages, copies the runtime files into `site/`, and deploys them.

## Notes

- The backend is a public web proxy transport if exposed publicly. Add access controls/rate limits and monitor usage before sharing it.
- A successful frontend deployment does not mean the backend is running; verify `https://YOUR-HOST/healthz` and then test a WebSocket connection.
- Some destinations block proxies or require features that experimental proxy software may not fully support.
