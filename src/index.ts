import "dotenv/config"; // должен идти первым: загружает .env в process.env до чтения конфига
import { createApp } from "./app";
import { config } from "./config";

const app = createApp();

app.listen(config.port, config.host, () => {
  console.log(`\n🎉  POVOD backend запущен: http://localhost:${config.port}`);
  console.log(`    health:  GET /health`);
  console.log(`    events:  GET /api/Events`);
  console.log(`    persist: ${config.persist ? "on (data/db.json)" : "off (in-memory)"}`);
  console.log(`    cors:    ${config.corsOrigin}\n`);
});
