
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDataStore } from "@/lib/data-store";

const clubTeamFormSchema = z.object({
  clubTeam: z.string().min(1, "Club team name is required"),
});

type ClubTeamFormValues = z.infer<typeof clubTeamFormSchema>;

export function ClubTeamForm() {
  const { userSettings, setUserSettings, recalculatePerformanceSummary } = useDataStore();
  
  const form = useForm<ClubTeamFormValues>({
    resolver: zodResolver(clubTeamFormSchema),
    defaultValues: {
      clubTeam: "VV Dongen", // Set the default club team to VV Dongen
    },
  });

  function onSubmit(values: ClubTeamFormValues) {
    setUserSettings({ ...userSettings, clubTeam: values.clubTeam });
    recalculatePerformanceSummary();
    toast.success("Club team updated successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clubTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club Team</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your club team name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">Save Club Team</Button>
        </div>
      </form>
    </Form>
  );
}
