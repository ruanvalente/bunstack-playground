/**
 * Environment type definition
 */
export enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

/**
 * Application Configuration
 *
 * Centralizes environment variables and configuration logic
 */
export const config = {
  /**
   * Current environment
   */
  environment: (process.env.NODE_ENV || "development") as Environment,

  /**
   * Environment checks
   */
  isDevelopment(): boolean {
    return this.environment === Environment.DEVELOPMENT;
  },

  isProduction(): boolean {
    return this.environment === Environment.PRODUCTION;
  },

  isStaging(): boolean {
    return this.environment === Environment.STAGING;
  },

  /**
   * Features that should run in development only
   */
  shouldRunSeeds(): boolean {
    return this.isDevelopment();
  },

  /**
   * Features that should run in production
   */
  shouldEnableAnalytics(): boolean {
    return this.isProduction();
  },
};
