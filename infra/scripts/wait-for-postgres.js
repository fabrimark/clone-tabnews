const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { setTimeout: sleep } = require("node:timers/promises");

const execFileAsync = promisify(execFile);
const serviceName = process.env.POSTGRES_SERVICE_NAME || "database";
const MAX_ATTEMPTS = 30;
const COMMAND_TIMEOUT_MS = 1000;
const RETRY_DELAY_MS = 1000;

async function waitForPostgres() {
  let lastError;

  process.stdout.write("\n\n🔴 Aguardando PostgreSQL");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { stdout } = await execFileAsync(
        "docker",
        [
          "compose",
          "-f",
          "infra/compose.yaml",
          "exec",
          "-T",
          serviceName,
          "pg_isready",
          "--host",
          "localhost",
        ],
        { timeout: COMMAND_TIMEOUT_MS },
      );

      if (stdout.includes("accepting connections")) {
        console.log("\n🟢 Postgres está pronto e aceitando conexões!\n");
        return;
      }

      lastError = new Error(`Resposta inesperada do pg_isready: ${stdout}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      process.stdout.write(".");
      await sleep(RETRY_DELAY_MS);
    }
  }

  const errorMessage =
    lastError instanceof Error ? ` Último erro: ${lastError.message}` : "";
  throw new Error(
    `Postgres não ficou pronto após ${MAX_ATTEMPTS} tentativas.${errorMessage}`,
  );
}

waitForPostgres().catch((error) => {
  console.error(`\n🔴 ${error.message}`);
  process.exitCode = 1;
});
