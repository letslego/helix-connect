export interface ConnectionToolContext {
    headers: Record<string, string>;
    url?: string;
}
export interface ConnectionDefinition {
    name: string;
    description: string;
    kind: "mcp" | "openapi" | "http" | "oauth";
    url?: string;
    authEnv?: string;
    headers?: Record<string, string>;
    tools?: Array<{
        name: string;
        description: string;
        handler: (input: Record<string, unknown>, ctx?: ConnectionToolContext) => Promise<unknown> | unknown;
    }>;
}
export interface ConnectionRegistry {
    list(): ConnectionDefinition[];
    call(connection: string, tool: string, input: Record<string, unknown>): Promise<unknown>;
}
export interface ConnectAuth {
    /** Env var holding a bearer/API token — never injected into model context. */
    tokenEnv?: string;
    /** Optional static headers (values may reference env via `$ENV:NAME`). */
    headers?: Record<string, string>;
}
/**
 * Helix Connect — credential-brokered service connections.
 * The model only sees connection/tool names; tokens stay in the app runtime.
 */
export declare function connect(auth?: ConnectAuth): ConnectAuth;
export declare function defineConnection(def: Omit<ConnectionDefinition, "name"> & {
    name?: string;
    auth?: ConnectAuth;
}): ConnectionDefinition;
export declare function defineMcpConnection(def: {
    name?: string;
    url: string;
    description: string;
    auth?: ConnectAuth;
    authEnv?: string;
    tools?: ConnectionDefinition["tools"];
}): ConnectionDefinition;
export declare function defineOpenApiConnection(def: {
    name?: string;
    url: string;
    description: string;
    auth?: ConnectAuth;
    tools?: ConnectionDefinition["tools"];
}): ConnectionDefinition;
export declare function createConnectionRegistry(connections: ConnectionDefinition[]): ConnectionRegistry;
export { defineConnection as defineConnect };
//# sourceMappingURL=index.d.ts.map