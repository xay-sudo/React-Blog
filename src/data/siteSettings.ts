
import type { SiteSettings, CodeSnippet } from '@/types';

// Initial default settings
let settings: SiteSettings = {
  adsTxtContent: `google.com, pub-YOUR_ADSENSE_PUBLISHER_ID, DIRECT, f08c47fec0942fa0\n# Add other ad network entries here`,
  snippets: [
    {
      id: 'default-ga',
      name: 'Google Analytics (Example)',
      code: `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_MEASUREMENT_ID');
</script>`,
      location: 'header',
      isActive: true,
    },
    {
      id: 'default-footer-log',
      name: 'Footer Console Log (Example)',
      code: `<script>
  console.log("Default footer script loaded via snippet manager.");
</script>`,
      location: 'footer',
      isActive: true,
    },
    {
      id: 'example-pixel-inactive',
      name: 'Example Pixel (Inactive)',
      code: `<script>
  console.log("This is an example pixel script and it is currently inactive.");
</script>`,
      location: 'header',
      isActive: false,
    }
  ],
};

export const getSiteSettings = (): SiteSettings => {
  // In a real app, you'd fetch this from a database
  // Make sure to return a deep copy if mockPosts can be mutated elsewhere,
  // or ensure this is the single source of truth.
  return JSON.parse(JSON.stringify(settings));
};

export const updateSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  // In a real app, you'd save this to a database
  // Merge snippet arrays carefully if newSettings.snippets is partial.
  // For this mock, we'll assume newSettings.snippets is the complete new array if provided.
  if (newSettings.snippets) {
    settings.snippets = newSettings.snippets;
  }
  if (newSettings.adsTxtContent !== undefined) {
    settings.adsTxtContent = newSettings.adsTxtContent;
  }
  
  console.log("Site settings updated:", settings);
  return JSON.parse(JSON.stringify(settings));
};
