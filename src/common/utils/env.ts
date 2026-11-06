import "server-only";

export function isEnvConfigured(name: string): boolean {
  return Boolean(process.env[name]);
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}
