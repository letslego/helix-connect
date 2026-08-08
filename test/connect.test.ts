import assert from "node:assert/strict";
import { test } from "node:test";
import { connect, createConnectionRegistry, defineMcpConnection } from "../src/index.js";

test("brokers auth", async () => {
  process.env.T = "secret";
  const registry = createConnectionRegistry([
    defineMcpConnection({
      name: "demo",
      url: "https://example.local",
      description: "d",
      auth: connect({ tokenEnv: "T" }),
      tools: [{ name: "ping", description: "p", async handler(_i, ctx) { return { auth: !!ctx?.headers.authorization }; } }],
    }),
  ]);
  assert.equal((registry.list()[0] as any).authEnv, undefined);
  assert.equal((await registry.call("demo", "ping", {}) as any).auth, true);
});
