export function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    console.warn(`Warning: Missing required environment variable: ${key}`);
  }
  return value || '';
}

export function getOptionalEnvVar(key: string): string {
  return getEnvVar(key, false);
}
