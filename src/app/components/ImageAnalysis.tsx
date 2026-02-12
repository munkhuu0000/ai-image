"use client";

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
  image: z.string(),
});

export const ImageAnalysis = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
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
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Imgae
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Upload your food image here"
                    autoComplete="username"
                  />
                  <FieldDescription>
                    Upload a food photo, and AI will detect the ingredients.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};
