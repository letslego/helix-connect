/**
 * Helix Connect — credential-brokered service connections.
 * The model only sees connection/tool names; tokens stay in the app runtime.
 */
export function connect(auth = {}) {
    return {
        tokenEnv: auth.tokenEnv,
        headers: auth.headers ?? {},
    };
}
export function defineConnection(def) {
    return {
        name: def.name ?? "connection",
        description: def.description,
        kind: def.kind,
        url: def.url,
        authEnv: def.auth?.tokenEnv ?? def.authEnv,
        headers: def.auth?.headers ?? def.headers,
        tools: def.tools ?? [],
    };
}
export function defineMcpConnection(def) {
    return defineConnection({
        name: def.name,
        kind: "mcp",
        url: def.url,
        description: def.description,
        auth: def.auth ?? (def.authEnv ? connect({ tokenEnv: def.authEnv }) : undefined),
        tools: def.tools,
    });
}
export function defineOpenApiConnection(def) {
    return defineConnection({
        name: def.name,
        kind: "openapi",
        url: def.url,
        description: def.description,
        auth: def.auth,
        tools: def.tools,
    });
}
export function createConnectionRegistry(connections) {
    const byName = new Map(connections.map((c) => [c.name, c]));
    return {
        list: () => connections.map((c) => ({
            name: c.name,
            description: c.description,
            kind: c.kind,
            url: c.url,
            tools: (c.tools ?? []).map((t) => ({
                name: t.name,
                description: t.description,
                handler: t.handler,
            })),
            // Never expose authEnv/headers via list()
        })),
        async call(connection, tool, input) {
            const conn = byName.get(connection);
            if (!conn)
                throw new Error(`Unknown connection: ${connection}`);
            // Resolve credentials in-process; never return them to the model.
            const authHeaders = resolveAuthHeaders(conn);
            const t = (conn.tools ?? []).find((x) => x.name === tool);
            if (t) {
                return t.handler(input, { headers: authHeaders, url: conn.url });
            }
            if (!conn.url) {
                return {
                    connection,
                    tool,
                    ok: false,
                    error: `No local tool handler or URL for ${connection}/${tool}`,
                };
            }
            // Generic HTTP bridge for OpenAPI/MCP-style endpoints.
            const res = await fetch(joinUrl(conn.url, tool), {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(input ?? {}),
            }).catch((err) => ({ ok: false, error: err.message }));
            if ("error" in res) {
                return { connection, tool, ok: false, error: res.error, brokered: true };
            }
            if (!res.ok) {
                return {
                    connection,
                    tool,
                    ok: false,
                    status: res.status,
                    error: await res.text(),
                    brokered: true,
                };
            }
            return { connection, tool, ok: true, brokered: true, data: await res.json() };
        },
    };
}
function resolveAuthHeaders(conn) {
    const headers = {};
    if (conn.authEnv) {
        const token = process.env[conn.authEnv];
        if (token)
            headers.authorization = `Bearer ${token}`;
    }
    for (const [key, value] of Object.entries(conn.headers ?? {})) {
        const match = value.match(/^\$ENV:([A-Z0-9_]+)$/);
        headers[key] = match ? process.env[match[1]] ?? "" : value;
    }
    return headers;
}
function joinUrl(base, tool) {
    return `${base.replace(/\/$/, "")}/${tool.replace(/^\//, "")}`;
}
// Back-compat re-exports used by older imports.
export { defineConnection as defineConnect };
//# sourceMappingURL=index.js.map