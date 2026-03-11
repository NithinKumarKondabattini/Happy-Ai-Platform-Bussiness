const http = require("http");
const next = require("next");
const { parse } = require("url");

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOST || "127.0.0.1";
const app = next({ dev: true, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
