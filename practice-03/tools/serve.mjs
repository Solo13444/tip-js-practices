import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portArg = Number(process.argv[2] ?? 5503);
const port = Number.isInteger(portArg) && portArg > 0 && portArg < 65536 ? portArg : 5503;
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === "/") pathname = "/index.html";
    const target = path.resolve(directory, `.${pathname}`);
    if (!target.startsWith(`${directory}${path.sep}`) && target !== directory) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("403 Forbidden");
      return;
    }

    const body = await readFile(target);
    const contentType = contentTypes[path.extname(target)] ?? "application/octet-stream";
    response.writeHead(200, { "content-type": contentType, "x-content-type-options": "nosniff" });
    response.end(body);
  } catch (error) {
    const status = error?.code === "ENOENT" ? 404 : 500;
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    response.end(status === 404 ? "404 Not Found" : "500 Internal Server Error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Практическая работа № 3 доступна: http://127.0.0.1:${port}/`);
  console.log("Остановить сервер: Ctrl+C");
});
