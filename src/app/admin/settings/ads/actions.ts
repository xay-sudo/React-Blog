
'use server';

import { z } from 'zod';
import { updateSiteSettings, type SiteSettings } from '@/data/siteSettings';

// Schema for validating the input to the server action.
// This should ideally mirror the formSchema in AdSettingsPage.tsx.
const AdSettingsActionInputSchema = z.object({
  adsTxtContent: z.string().min(10, {
    message: "ads.txt content must be at least 10 characters if provided.",
  }).optional().or(z.literal('')),
  headerScripts: z.string().optional().or(z.literal('')),
  footerScripts: z.string().optional().or(z.literal('')),
});

// Type for the input values the action expects.
// Exporting this allows the client component to ensure type compatibility.
export type AdSettingsActionInput = z.infer<typeof AdSettingsActionInputSchema>;

export async function saveAdSettingsAction(values: AdSettingsActionInput): Promise<void> {
  try {
    // Optional: Server-side validation against the schema.
    // Useful if the action might be called from places other than this specific form.
    // AdSettingsActionInputSchema.parse(values);

    // The `values` object structurally matches Partial<SiteSettings>
    // as defined by the Zod schema.
    updateSiteSettings(values as Partial<SiteSettings>);

    // In a real application with a database, you might revalidate paths here:
    // revalidatePath('/ads.txt');
    // revalidatePath('/'); // If header/footer scripts affect all pages
  } catch (error) {
    console.error("Failed to update ad settings in server action:", error);

    // Re-throw the error so it can be caught by the try/catch block
    // in the client component's handleSubmit function, allowing for
    // user-facing error messages (e.g., via toast).
    if (error instanceof z.ZodError) {
      // More specific error message if Zod validation fails server-side
      throw new Error(`Invalid data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    // Generic error for other issues
    throw new Error("Server failed to update ad settings. Please try again.");
  }
}
