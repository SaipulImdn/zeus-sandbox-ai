export function getConfig() {
  return {
    useApi: process.env.USE_API === "true",
    port: Number(process.env.PORT) || 3000,
  };
}
