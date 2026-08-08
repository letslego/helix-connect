# @letslego/helix-connect

**Connect** — credential brokering for Helix agents.

- `connect({ tokenEnv })` keeps secrets in the app runtime
- MCP + OpenAPI adapters
- Tokens never appear in model context

```bash
npm install @letslego/helix-connect
```

```ts
import { connect, defineMcpConnection } from "@letslego/helix-connect";

export default defineMcpConnection({
  url: "https://mcp.example/places",
  description: "Places",
  auth: connect({ tokenEnv: "PLACES_TOKEN" }),
});
```

## Ecosystem

| Package | Role |
| --- | --- |
| [@letslego/helix](https://github.com/letslego/helix) | Agent framework |
| [@letslego/helix-workflow](https://github.com/letslego/helix-workflow) | Durable workflows |
| [@letslego/helix-gateway](https://github.com/letslego/helix-gateway) | AI Gateway |
| [@letslego/helix-sandbox](https://github.com/letslego/helix-sandbox) | Isolated compute |
| [@letslego/helix-connect](https://github.com/letslego/helix-connect) | Credential brokering |
| [@letslego/helix-channels](https://github.com/letslego/helix-channels) | Delivery surfaces |

Overview: https://letslego.github.io/helix-ecosystem/


## License

Apache-2.0 © LetsLego
