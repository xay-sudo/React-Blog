
// Simulates a simple data store for site-wide settings.
// In a real application, this would be stored in a database.

export interface SiteSettings {
  adsTxtContent: string;
  headerScripts: string;
  footerScripts: string;
}

let settings: SiteSettings = {
  adsTxtContent: `google.com, pub-YOUR_ADSENSE_PUBLISHER_ID, DIRECT, f08c47fec0942fa0\n# Add other ad network entries here`,
  headerScripts: `<!-- Global site tag (gtag.js) - Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'GA_MEASUREMENT_ID');\n</script>`,
  footerScripts: `<!-- Example footer script -->\n<script>\n  console.log("Footer script loaded");\n</script>`,
};

export const getSiteSettings = (): SiteSettings => {
  // In a real app, you'd fetch this from a database
  return settings;
};

export const updateSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  // In a real app, you'd save this to a database
  settings = { ...settings, ...newSettings };
  console.log("Site settings updated:", settings);
  return settings;
};
