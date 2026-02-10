import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  about: z
    .string()
    .min(10, "Please provide at least 10 characters.")
    .max(200, "Please keep it under 200 characters."),
});

export const ImageAnalysis = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {}
  return (
    <div className="flex flex-col justtify-center items-start gap-4 text-[#09090B] ">
      <div className="w-165 h-10 flex justify-between">
        <div className="h-7 w-44 flex flex-row gap-2">
          <Sparkles className="w-6 h-6" />
          <p>Image analysis</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Submit"
          className="w-12 h-10 text-[#09090B]"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <p>Upload a food photo, and AI will detect the ingredients. </p>
        <form>
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>
              Fill in your profile information.
            </FieldDescription>
            <FieldGroup>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <FieldDescription>
                    Provide your full name for identification
                  </FieldDescription>
                </FieldContent>
                <Input id="name" placeholder="Evil Rabbit" required />
              </Field>
              <Field orientation="responsive">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
};
