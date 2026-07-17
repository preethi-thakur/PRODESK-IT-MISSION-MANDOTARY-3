import { config } from "./config/index.js";
import createApp from "./app.js";

const app = createApp();

console.log("config.port =", config.port);
console.log("process.env.PORT =", process.env.PORT);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});