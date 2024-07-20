// https://deno.land/x/silverbullet@0.8.2/lib/plugos/worker_runtime.ts
var runningAsWebWorker = typeof window === "undefined" && // @ts-ignore: globalThis
typeof globalThis.WebSocketPair === "undefined";
if (typeof Deno === "undefined") {
  self.Deno = {
    args: [],
    // @ts-ignore: Deno hack
    build: {
      arch: "x86_64"
    },
    env: {
      // @ts-ignore: Deno hack
      get() {
      }
    }
  };
}
var pendingRequests = /* @__PURE__ */ new Map();
var syscallReqId = 0;
function workerPostMessage(msg) {
  self.postMessage(msg);
}
if (runningAsWebWorker) {
  globalThis.syscall = async (name, ...args) => {
    return await new Promise((resolve, reject) => {
      syscallReqId++;
      pendingRequests.set(syscallReqId, { resolve, reject });
      workerPostMessage({
        type: "sys",
        id: syscallReqId,
        name,
        args
      });
    });
  };
}
function setupMessageListener(functionMapping2, manifest2) {
  if (!runningAsWebWorker) {
    return;
  }
  self.addEventListener("message", (event) => {
    (async () => {
      const data = event.data;
      switch (data.type) {
        case "inv":
          {
            const fn = functionMapping2[data.name];
            if (!fn) {
              throw new Error(`Function not loaded: ${data.name}`);
            }
            try {
              const result = await Promise.resolve(fn(...data.args || []));
              workerPostMessage({
                type: "invr",
                id: data.id,
                result
              });
            } catch (e) {
              console.error(
                "An exception was thrown as a result of invoking function",
                data.name,
                "error:",
                e.message
              );
              workerPostMessage({
                type: "invr",
                id: data.id,
                error: e.message
              });
            }
          }
          break;
        case "sysr":
          {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
          break;
      }
    })().catch(console.error);
  });
  workerPostMessage({
    type: "manifest",
    manifest: manifest2
  });
}
function base64Decode(s) {
  const binString = atob(s);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}
function base64Encode(buffer) {
  if (typeof buffer === "string") {
    buffer = new TextEncoder().encode(buffer);
  }
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}
async function sandboxFetch(reqInfo, options) {
  if (typeof reqInfo !== "string") {
    const body = new Uint8Array(await reqInfo.arrayBuffer());
    const encodedBody = body.length > 0 ? base64Encode(body) : void 0;
    options = {
      method: reqInfo.method,
      headers: Object.fromEntries(reqInfo.headers.entries()),
      base64Body: encodedBody
    };
    reqInfo = reqInfo.url;
  }
  return syscall("sandboxFetch.fetch", reqInfo, options);
}
globalThis.nativeFetch = globalThis.fetch;
function monkeyPatchFetch() {
  globalThis.fetch = async function(reqInfo, init) {
    const encodedBody = init && init.body ? base64Encode(
      new Uint8Array(await new Response(init.body).arrayBuffer())
    ) : void 0;
    const r = await sandboxFetch(
      reqInfo,
      init && {
        method: init.method,
        headers: init.headers,
        base64Body: encodedBody
      }
    );
    return new Response(r.base64Body ? base64Decode(r.base64Body) : null, {
      status: r.status,
      headers: r.headers
    });
  };
}
if (runningAsWebWorker) {
  monkeyPatchFetch();
}

// E:/Repos/silverbullet-dailyquote/daily-quote.ts
async function dailyQuote() {
  const quoteAPI = "https://api.quotable.io/quotes/random";
  const response = await fetch(quoteAPI);
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }
  const data = await response.json();
  const quoteData = Array.isArray(data) ? data[0] : data;
  if (quoteData.content && quoteData.author) {
    const quote = quoteData.content;
    const author = quoteData.author;
    const formattedQuote = `${quote}
> \u2014 ${author}`;
    console.log(formattedQuote);
    return formattedQuote;
  } else {
    throw new Error("No quote in response");
  }
}

// 7647aeb3fd1834bb.js
var functionMapping = {
  dailyQuote
};
var manifest = {
  "name": "Daily-Quote",
  "requiredPermissions": [
    "fetch"
  ],
  "functions": {
    "dailyQuote": {
      "path": "daily-quote.ts:dailyQuote",
      "command": {
        "name": "Daily Quote: Fetch"
      }
    }
  },
  "assets": {}
};
var plug = { manifest, functionMapping };
setupMessageListener(functionMapping, manifest);
export {
  plug
};
//# sourceMappingURL=Daily-Quote.plug.js.map
