function normalizeBaseUrl(value) {
  const trimmed = (value || "").trim().replace(/\/$/, "");
  if (!trimmed) {
    return "http://127.0.0.1:8000";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `http://${trimmed}`;
}

const backendBase = normalizeBaseUrl(
  process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

function getBackendUrl(req) {
  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : req.query.path || "";
  const currentUrl = new URL(req.url || "/api", "http://localhost");
  return `${backendBase}/api/${path}${currentUrl.search}`;
}

function copyRequestHeaders(req) {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || ["host", "connection", "content-length"].includes(key)) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  return headers;
}

function copyResponseHeaders(response, res) {
  response.headers.forEach((value, key) => {
    if (["connection", "content-encoding", "transfer-encoding"].includes(key)) {
      return;
    }

    res.setHeader(key, value);
  });
}

export default async function handler(req, res) {
  const method = req.method || "GET";

  try {
    const init = {
      method,
      headers: copyRequestHeaders(req),
      redirect: "manual",
    };

    if (!["GET", "HEAD"].includes(method)) {
      init.body = await readRawBody(req);
    }

    const response = await fetch(getBackendUrl(req), init);
    const body = Buffer.from(await response.arrayBuffer());

    copyResponseHeaders(response, res);
    res.status(response.status).send(body);
  } catch (error) {
    res.status(502).json({
      detail: "Frontend proxy could not reach the FastAPI backend.",
      error: error instanceof Error ? error.message : "Unknown proxy error",
    });
  }
}
