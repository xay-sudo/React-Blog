
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSiteSettings } from "@/data/siteSettings";
import { useEffect } from "react";
import { saveAdSettingsAction, type AdSettingsActionInput } from './actions';

const formSchema = z.object({
  adsTxtContent: z.string().min(10, {
    message: "ads.txt content must be at least 10 characters if provided.",
  }).optional().or(z.literal('')),
  headerScripts: z.string().optional().or(z.literal('')),
  footerScripts: z.string().optional().or(z.literal('')),
});

type AdSettingsFormValues = z.infer<typeof formSchema>;

export default function AdSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const currentSettings = getSiteSettings();

  const form = useForm<AdSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adsTxtContent: currentSettings.adsTxtContent || "",
      headerScripts: currentSettings.headerScripts || "",
      footerScripts: currentSettings.footerScripts || "",
    },
  });
  
  useEffect(() => {
    form.reset({
        adsTxtContent: currentSettings.adsTxtContent || "",
        headerScripts: currentSettings.headerScripts || "",
        footerScripts: currentSettings.footerScripts || "",
    });
  }, [currentSettings, form]);


  const {formState: {isSubmitting}} = form;

  const handleSubmit = async (values: AdSettingsFormValues) => {
    try {
      await saveAdSettingsAction(values as AdSettingsActionInput);
      toast({
        title: "Ad Settings Updated",
        description: "Your advertising configurations have been saved.",
      });
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Error Updating Settings",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Advertising Settings
        </h1>
        <Card className="shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline text-2xl sm:text-3xl">
            Manage Ad Configurations
            </CardTitle>
            <CardDescription>
            Configure your ads.txt file and inject custom scripts into your site's header or footer.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="adsTxtContent"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg">ads.txt Content</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0..."
                        {...field}
                        rows={8}
                        className="font-mono text-sm"
                        />
                    </FormControl>
                    <FormDescription>
                        Enter the full content for your <code>ads.txt</code> file. This file will be served at <code>/ads.txt</code>.
                        Ensure each entry is on a new line.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="headerScripts"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg">Header Scripts</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="<script>...</script> or <meta ...>"
                        {...field}
                        rows={8}
                        className="font-mono text-sm"
                        />
                    </FormControl>
                    <FormDescription>
                        Scripts or meta tags to be injected into the <code>&lt;head&gt;</code> section of every page.
                        Useful for AdSense auto-ads, analytics, verification tags, etc.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="footerScripts"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg">Footer Scripts</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="<script>...</script>"
                        {...field}
                        rows={8}
                        className="font-mono text-sm"
                        />
                    </FormControl>
                    <FormDescription>
                        Scripts to be injected right before the closing <code>&lt;/body&gt;</code> tag on every page.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <div className="flex justify-end space-x-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isSubmitting ? "Saving Settings..." : "Save Ad Settings"}
                </Button>
                </div>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
