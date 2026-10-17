// Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically at build time.
// No environment variables need to be configured by hand.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
