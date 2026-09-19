const REQUIRED_ENV_VARS = ["JWT_SECRET", "DATABASE_URL"] as const;

export function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variable(s): ${missing.join(", ")}\n` +
        `   Check your .env file — the server cannot start without these.`
    );
    process.exit(1);
  }
}