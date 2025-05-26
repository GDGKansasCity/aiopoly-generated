"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  theme: z.string().min(2, { message: "Theme must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ThemeFormProps {
  onSubmit: (theme: string) => Promise<void>;
  isLoading: boolean;
}

export function ThemeForm({ onSubmit, isLoading }: ThemeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "",
    },
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    await onSubmit(data.theme);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="theme" className="text-lg font-semibold">Monopoly Theme</FormLabel>
              <FormControl>
                <Input
                  id="theme"
                  placeholder="e.g., Kansas City, Ancient Rome, Space Exploration"
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Properties"
          )}
        </Button>
      </form>
    </Form>
  );
}
