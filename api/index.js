export const config = { runtime: "edge" };

//best project
// send data
const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

//
//
//
// location system file
const STRIP_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);
///////// ttttf handler project binde
export default async function handler(req) {
  if (!TARGET_BASE) {
    return new Response("Misconfigured: TARGET_DOMAIN is not set", { status: 500 });
  }

  // test exeption
  try {
    const pathStart = req.url.indexOf("/", 8);
    const targetUrl =
      pathStart === -1 ? TARGET_BASE + "/" : TARGET_BASE + req.url.slice(pathStart);

    const out = new Headers();
    let clientIp = null;
    // looop back check is null
    for (const [k, v] of req.headers) {
      if (STRIP_HEADERS.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;
      if (k === "x-real-ip") {
        clientIp = v;
        continue;
      }
      // test product
      if (k === "x-forwarded-for") {
        if (!clientIp) clientIp = v;
        continue;
      }
      out.set(k, v);
    }
    // ask clint why
    // what 's ip
    if (clientIp) out.set("x-forwarded-for", clientIp);

    // vercel is good
    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    // reyurn binded
    return await fetch(targetUrl, {
      method,
      headers: out,
      body: hasBody ? req.body : undefined,
      duplex: "half",
      redirect: "manual",
    });
  } catch (err) { //lorem ipsomm
    console.error("relay error:", err);
    return new Response("Bad Gateway: Tunnel Failed", { status: 502 });
  }// chek system
  // finall shop product
}