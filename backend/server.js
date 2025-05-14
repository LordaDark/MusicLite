const { serve } = require('@hono/node-server');
const { serveStatic } = require('@hono/node-server/serve-static');
const app = require('./hono').default;

const port = process.env.PORT || 3000;

// Middleware per logging delle richieste
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
});

// Aggiunge un endpoint di health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log(`Server starting on port ${port}...`);
serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
