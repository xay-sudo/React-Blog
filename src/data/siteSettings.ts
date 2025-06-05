
import type { SiteSettings, CodeSnippet } from '@/types';

// This object now primarily serves as the *default* settings structure
// if localStorage is empty on the client, and as the server's in-memory store.
const defaultSettings: SiteSettings = {
  adsTxtContent: `google.com, pub-YOUR_ADSENSE_PUBLISHER_ID, DIRECT, f08c47fec0942fa0\n# Add other ad network entries here (e.g., for Adsterra, MGID, etc.)`,
  snippets: [
    {
      id: 'example-ga',
      name: 'Google Analytics (Example)',
      code: `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_MEASUREMENT_ID');
</script>`,
      location: 'globalHeader', 
      isActive: true,
    },
    {
      id: 'default-footer-log',
      name: 'Footer Console Log (Example)',
      code: `<script>
  console.log("Default footer script loaded via snippet manager.");
</script>`,
      location: 'globalFooter', 
      isActive: true,
    },
    {
      id: 'example-pixel-inactive',
      name: 'Example Pixel (Inactive)',
      code: `<script>
  console.log("This is an example pixel script and it is currently inactive.");
</script>`,
      location: 'globalHeader', 
      isActive: false,
    },
    {
      id: 'post-specific-ad-example',
      name: 'Example Ad Unit - Before Post Content',
      code: `<div style="margin: 1rem 0; padding: 1rem; background-color: #f0f0f0; text-align: center;">Your Ad Code Here (e.g., from Adsterra, MGID, etc.) - Before Post Content</div>`,
      location: 'beforePostContent',
      isActive: true,
    }
  ],
};

// Server's in-memory store
let serverInMemorySettings: SiteSettings = JSON.parse(JSON.stringify(defaultSettings));

// This function now returns the server's in-memory settings.
// For client-side, the AdSettingsPage will manage its own state from localStorage,
// using these defaults if localStorage is initially empty.
export const getSiteSettings = (): SiteSettings => {
  return JSON.parse(JSON.stringify(serverInMemorySettings));
};

// This function updates the server's in-memory settings.
// This is called by the server action.
export const updateSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  if (newSettings.adsTxtContent !== undefined) {
    serverInMemorySettings.adsTxtContent = newSettings.adsTxtContent;
  }
  if (newSettings.snippets) {
    serverInMemorySettings.snippets = newSettings.snippets.map(snippet => ({
        ...snippet,
    })) as CodeSnippet[];
  }
  return JSON.parse(JSON.stringify(serverInMemorySettings));
};

// Helper to get default settings, used by client if localStorage is empty.
export const getDefaultSiteSettings = (): SiteSettings => {
    return JSON.parse(JSON.stringify(defaultSettings));
}
