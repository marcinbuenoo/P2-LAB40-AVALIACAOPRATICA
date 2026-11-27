const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const app = require("../src/app");

async function request(baseUrl, pathname, options) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  return { status: response.status, body: await response.json() };
}

async function run() {
  const server = createServer(app);
  let listening = false;

  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    listening = true;

    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const health = await request(baseUrl, "/health");
    assert.equal(health.status, 200);
    assert.deepEqual(health.body, { status: "ok", application: "LAB40" });

    const catalog = await request(baseUrl, "/api/features");
    assert.equal(catalog.status, 200);
    assert.equal(catalog.body.total, 40);
    assert.equal(catalog.body.items.length, 40);
    assert.equal(
      catalog.body.items.find(({ id }) => id === 14).implemented,
      true,
    );

    const success = await request(baseUrl, "/api/features/14", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: "A sacada da casa" }),
    });
    assert.equal(success.status, 200);
    assert.deepEqual(success.body.result, { palindromo: true });

    const invalid = await request(baseUrl, "/api/features/14", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: 14 }),
    });
    assert.equal(invalid.status, 400);
    assert.match(invalid.body.error, /string/u);

    console.log("Smoke test concluído com sucesso.");
  } finally {
    if (listening) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
