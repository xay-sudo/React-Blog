
import type { SiteSettings, CodeSnippet } from '@/types';

// Initial default settings
let settings: SiteSettings = {
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

export const getSiteSettings = (): SiteSettings => {
  // In a real app, you'd fetch this from a database
  // Return a deep copy to prevent direct mutation of the settings object from outside
  return JSON.parse(JSON.stringify(settings));
};

export const updateSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  // In a real app, you'd save this to a database

  if (newSettings.adsTxtContent !== undefined) {
    settings.adsTxtContent = newSettings.adsTxtContent;
  }
  if (newSettings.snippets) {
    // Assign the new array of snippets. The Zod schema on the action input ensures isActive is a boolean.
    settings.snippets = newSettings.snippets.map(snippet => ({
        ...snippet,
        // isActive is guaranteed to be a boolean by Zod validation in the action
    })) as CodeSnippet[];
  }
  
  // console.log("Site settings updated in mock data (src/data/siteSettings.ts):", JSON.parse(JSON.stringify(settings)));
  // Return a deep copy of the updated settings
  return JSON.parse(JSON.stringify(settings));
};

