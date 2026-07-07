import { Hono } from "hono";
import curation from "./curation.json";
import { buildPayload } from "./merge";
import type { Curation, ProjectsPayload } from "./types";

interface Env {
  PROJECTS_KV: KVNamespace;
  GITHUB_TOKEN?: string;
  ASSETS: Fetcher;
}

const KV_KEY = "projects:v1";
const MAX_AGE_MS = 60 * 60 * 1000; // 1h: after this, KV is considered stale

const app = new Hono<{ Bindings: Env }>();

function isStale(payload: ProjectsPayload): boolean {
  const age = Date.now() - new Date(payload.updatedAt).getTime();
  return Number.isNaN(age) || age > MAX_AGE_MS;
}

async function rebuild(env: Env): Promise<ProjectsPayload> {
  const payload = await buildPayload(curation as Curation, env.GITHUB_TOKEN);
  await env.PROJECTS_KV.put(KV_KEY, JSON.stringify(payload));
  return payload;
}

app.get("/api/projects", async (c) => {
  const cached = await c.env.PROJECTS_KV.get<ProjectsPayload>(KV_KEY, "json");

  let payload: ProjectsPayload;

  if (cached && !isStale(cached)) {
    // Fresh: return immediately.
    payload = cached;
  } else if (cached) {
    // Stale: return stale now, refresh in background (SWR).
    payload = cached;
    c.executionCtx.waitUntil(rebuild(c.env));
  } else {
    // Cold KV: build synchronously.
    payload = await rebuild(c.env);
  }

  c.header("Cache-Control", "public, max-age=600");
  return c.json(payload);
});

// Everything else falls through to static assets (the Vue SPA).
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
