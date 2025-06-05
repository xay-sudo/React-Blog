
'use server';

import { z } from 'zod';
import { updateSiteSettings, type SiteSettings } from '@/data/siteSettings';
import type { CodeSnippet } from '@/types'; 

// Schema for a single code snippet
const CodeSnippetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Snippet name cannot be empty." }),
  code: z.string().min(1, { message: "Snippet code cannot be empty." }),
  location: z.enum([
    'globalHeader', 
    'globalFooter',
    'postHeader',
    'postFooter',
    'beforePostContent',
    'afterPostContent'
  ]),
  isActive: z.boolean(),
});

// Schema for validating the input to the server action.
const AdSettingsActionInputSchema = z.object({
  adsTxtContent: z.string().min(10, {
    message: "ads.txt content must be at least 10 characters if provided.",
  }).optional().or(z.literal('')),
  snippets: z.array(CodeSnippetSchema),
});

// Type for the input values the action expects.
export type AdSettingsActionInput = z.infer<typeof AdSettingsActionInputSchema>;

export async function saveAdSettingsAction(values: AdSettingsActionInput): Promise<void> {
  try {
    const validatedValues = AdSettingsActionInputSchema.parse(values);

    updateSiteSettings({
      adsTxtContent: validatedValues.adsTxtContent,
      snippets: validatedValues.snippets as CodeSnippet[], 
    });

  } catch (error) {
    console.error("Failed to update ad settings in server action:", error);
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid data: ${error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`);
    }
    throw new Error("Server failed to update ad settings. Please try again.");
  }
}
