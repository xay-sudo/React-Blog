
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React from "react"; // Removed useEffect as it's no longer needed for form refresh here

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
import { getSiteSettings, type SiteSettings } from "@/data/siteSettings"; // SiteSettings type might be useful
import { saveAdSettingsAction } from './actions';
import type { AdSettingsActionInput } from './actions';
import type { SnippetLocation } from '@/types';
import { Trash2, PlusCircle } from "lucide-react";

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

  // Fetch initial settings once for initial form population
  const initialSettings = React.useMemo(() => getSiteSettings(), []);

  const form = useForm<AdSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adsTxtContent: initialSettings.adsTxtContent || "",
      snippets: initialSettings.snippets || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "snippets",
  });

  // The useEffect previously here for formRefreshKey is removed.
  // Form reset will now be handled in handleSubmit using data returned by the server action.

  const {formState: {isSubmitting, errors}} = form;

  const handleSubmit = async (values: AdSettingsFormValues) => {
    try {
      const updatedSettings: SiteSettings = await saveAdSettingsAction(values as AdSettingsActionInput);
      toast({
        title: "Ad Settings Updated",
        description: "Your advertising configurations have been saved.",
      });
      // Reset the form with the data returned directly from the server action
      form.reset({
        adsTxtContent: updatedSettings.adsTxtContent || "",
        snippets: updatedSettings.snippets || [],
      });
      router.refresh(); // Still useful to refresh other server components or global state if any
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
      id: `new-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      code: "",
      location: "globalHeader" as SnippetLocation,
      isActive: true,
    });
  };

  return (
    <div className="space-y-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Advertising Settings
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Card className="shadow-xl">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">ads.txt Content</CardTitle>
                  <CardDescription>
                      Manage the content of your <code>ads.txt</code> file. This will be served at <code>/ads.txt</code>.
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
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-4 border shadow-md bg-card/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name={`snippets.${index}.name`}
                                    render={({ field: f }) => (
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
                                    render={({ field: f }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <Select onValueChange={f.onChange} defaultValue={f.value as SnippetLocation}>
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
                                render={({ field: f }) => (
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
                                    render={({ field: f }) => (
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
                            {/* Display errors for individual snippets if necessary */}
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
