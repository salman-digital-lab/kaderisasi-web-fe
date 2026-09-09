import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { activities, clubs, paginate } from "../tests/instant/fixtures.mjs";
import { uiFixture } from "../tests/ui/fixtures.mjs";

// These endpoints serve synthetic public data only, on an OS-assigned test port.
const api = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.method === "OPTIONS") return response.end();
  let data = uiFixture(url, request.headers.authorization);
  if (data !== undefined) {
    return response.end(JSON.stringify({ message: "TEST_DATA", data }));
  }
  if (url.pathname === "/v2/activities/categories") {
    data = [1, 2, 3];
  } else if (url.pathname === "/v2/activities") {
    data = paginate(activities, url.searchParams);
  } else if (url.pathname === "/v2/clubs") {
    data = paginate(clubs, url.searchParams);
  } else if (url.pathname === "/v2/profiles") {
    response.statusCode = 401;
    return response.end(JSON.stringify({ message: "Unauthorized" }));
  } else {
    data = [];
  }
  response.end(JSON.stringify({ message: "TEST_DATA", data }));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const apiUrl = `http://127.0.0.1:${api.address().port}/v2`;
const env = {
  ...process.env,
  NEXT_INSTANT_TEST: "1",
  NEXT_PUBLIC_APP_ENV: "test",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  SERVER_BE_API: apiUrl,
  SERVER_BE_ADMIN_API: apiUrl,
  NEXT_PUBLIC_BE_API: apiUrl,
  NEXT_PUBLIC_BE_ADMIN_API: apiUrl,
};
let child;
function cleanup() {
  child?.kill("SIGTERM");
  api.close();
}
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

try {
  child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build"],
    {
      env,
      stdio: "inherit",
    },
  );
  const [buildCode] = await once(child, "exit");
  if (buildCode !== 0) process.exitCode = buildCode || 1;
  else {
    child = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start"],
      {
        env,
        stdio: "inherit",
      },
    );
    const [startCode] = await once(child, "exit");
    process.exitCode = startCode || 0;
  }
} finally {
  cleanup();
}
