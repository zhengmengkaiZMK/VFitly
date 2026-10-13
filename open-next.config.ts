// OpenNext Cloudflare adapter configuration.
// The application assets remain in the existing VFitly R2 bucket; the R2
// binding below is reserved for OpenNext's incremental cache.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
