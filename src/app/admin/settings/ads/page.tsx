
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDefaultSiteSettings, type SiteSettings } from "@/data/siteSettings"; // Get default for initialization
import { saveAdSettingsAction } from './actions';
import type { AdSettingsActionInput } from './actions';
import type { SnippetLocation, CodeSnippet } from '@/types';
import { Trash2, PlusCircle } from "lucide-react";
import { useLocalStorage } from '@/hooks/use-local-storage';

const SITE_SETTINGS_LOCAL_STORAGE_KEY = 'bloggerVerseAdminAdSettings';

const codeSnippetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Snippet name is required."),
  code: z.string().min(1, "Snippet code is required."),
  location: z.enum([
    'globalHeader',
    'globalFooter',
    'postHeader',
    'postFooter',
    'beforePostContent',
    'afterPostContent'
  ], { required_error: "Location is required."}),
  isActive: z.boolean(),
});

const formSchema = z.object({
  adsTxtContent: z.string().min(10, {
    message: "ads.txt content must be at least 10 characters if provided.",
  }).optional().or(z.literal('')),
  snippets: z.array(codeSnippetSchema),
});

type AdSettingsFormValues = z.infer<typeof formSchema>;

export default function AdSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Use localStorage for the primary state of this form
  const [localSettings, setLocalSettings] = useLocalStorage<AdSettingsFormValues>(
    SITE_SETTINGS_LOCAL_STORAGE_KEY,
    () => {
        const defaults = getDefaultSiteSettings();
        return {
            adsTxtContent: defaults.adsTxtContent || "",
            snippets: defaults.snippets || [],
        };
    }
  );

  const form = useForm<AdSettingsFormValues>({
    resolver: zodResolver(formSchema),
    // Default values will be set by useEffect below to ensure localStorage is primary
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "snippets",
  });

  // Sync form with localStorage state on mount and when localSettings change
  useEffect(() => {
    form.reset(localSettings);
    // Ensure field array is also synced if `replace` is available and snippets differ
    // For more complex scenarios, you might need a deep compare or specific handling
    // For now, form.reset should handle snippets if localSettings are structured correctly.
    // If `useFieldArray` doesn't update correctly with just `form.reset`, we might need `replace(localSettings.snippets)`
  }, [localSettings, form]);


  const {formState: {isSubmitting, errors}} = form;

  const handleSubmit = async (values: AdSettingsFormValues) => {
    try {
      // 1. Update server's in-memory store (for ads.txt, etc.)
      // The server action is still useful for any server-side logic or if ads.txt needs live updates from server memory
      await saveAdSettingsAction(values as AdSettingsActionInput); 
      
      // 2. Update localStorage with the new values
      setLocalSettings(values);

      toast({
        title: "Ad Settings Updated",
        description: "Your advertising configurations have been saved to your browser and server.",
      });
      // Form is already reset via useEffect reacting to localSettings change,
      // or can be explicitly reset here if preferred:
      // form.reset(values); 
      router.refresh(); // Potentially re-fetch server data if other parts of admin depend on it
    } catch (error) {
      toast({
        title: "Error Updating Settings",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const addNewSnippet = () => {
    append({
      id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      code: "",
      location: "globalHeader" as SnippetLocation, // Default, will be picked up by Controller
      isActive: true,
    });
  };

  return (
    <div className="space-y-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Advertising Settings
        </h1>
        <p className="text-muted-foreground">
            Settings are saved in your browser&apos;s local storage and also sent to the server for features like <code>ads.txt</code>.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Card className="shadow-xl">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">ads.txt Content</CardTitle>
                  <CardDescription>
                      Manage the content of your <code>ads.txt</code> file. This will be served at <code>/ads.txt</code> based on server data.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="adsTxtContent"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel className="sr-only">ads.txt Content</FormLabel>
                      <FormControl>
                          <Textarea
                          placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0..."
                          {...field}
                          rows={8}
                          className="font-mono text-sm"
                          />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline text-2xl">Code Snippets</CardTitle>
                            <CardDescription>
                                Manage custom HTML/JS/CSS code snippets to be injected into your site.
                            </CardDescription>
                        </div>
                        <Button type="button" onClick={addNewSnippet} variant="outline">
                            <PlusCircle className="mr-2 h-5 w-5" /> Add Snippet
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {fields.map((item, index) => ( // `item` instead of `field` to avoid conflict
                        <Card key={item.id} className="p-4 border shadow-md bg-card/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name={`snippets.${index}.name`}
                                    render={({ field: f }) => ( // `f` for inner field
                                        <FormItem>
                                            <FormLabel>Snippet Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., Google Analytics" {...f} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`snippets.${index}.location`}
                                    render={({ field: f }) => ( // `f` for inner field
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <Select onValueChange={f.onChange} value={f.value as SnippetLocation} defaultValue={f.value as SnippetLocation}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="globalHeader">Global: Header (&lt;head&gt;)</SelectItem>
                                                    <SelectItem value="globalFooter">Global: Footer (before &lt;/body&gt;)</SelectItem>
                                                    <SelectItem value="postHeader">Post Page: Header (&lt;head&gt;)</SelectItem>
                                                    <SelectItem value="postFooter">Post Page: Footer (before &lt;/body&gt;)</SelectItem>
                                                    <SelectItem value="beforePostContent">Post Page: Before Content</SelectItem>
                                                    <SelectItem value="afterPostContent">Post Page: After Content</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name={`snippets.${index}.code`}
                                render={({ field: f }) => ( // `f` for inner field
                                    <FormItem className="mb-4">
                                        <FormLabel>Code</FormLabel>
                                        <FormControl><Textarea placeholder="<script>...</script> or <style>...</style>" {...f} rows={6} className="font-mono text-sm" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center">
                                <FormField
                                    control={form.control}
                                    name={`snippets.${index}.isActive`}
                                    render={({ field: f }) => ( // `f` for inner field
                                        <FormItem className="flex flex-row items-center space-x-2">
                                            <FormControl><Switch checked={f.value} onCheckedChange={f.onChange} /></FormControl>
                                            <FormLabel className="cursor-pointer">Active</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Snippet
                                </Button>
                            </div>
                            {errors.snippets?.[index] && (
                                <FormMessage className="mt-2 text-destructive">
                                    There are errors in this snippet. Please check all fields.
                                </FormMessage>
                            )}
                        </Card>
                    ))}
                    {fields.length === 0 && <p className="text-muted-foreground text-center py-4">No snippets added yet. Click "Add Snippet" to create one.</p>}
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background py-4 border-t border-border -mx-8 px-8">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                {isSubmitting ? "Saving Settings..." : "Save All Settings"}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
