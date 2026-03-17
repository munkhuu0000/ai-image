"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pipeline } from "@huggingface/transformers";
import { BookText, Loader2, RotateCw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ChatWidget from "./components/ChatWidget";
import Image from "next/image";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [ingredientText, setIngredientText] = useState("");
  const [ingredientResult, setIngredientResult] = useState<string | null>(null);
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [foodDescription, setFoodDescription] = useState("");
  const [descriptionResult, setDescriptionResult] = useState<string | null>(
    null,
  );
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const captionRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setResult(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
  };
  const handleCreate = async () => {
    if (!foodDescription.trim()) return;
    setDescriptionLoading(true);
    try {
      const res = await fetch("/api/image-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: foodDescription }),
      });
      const data = await res.json();
      setDescriptionResult(data.imageURL || data.error);
    } catch {
      setDescriptionResult("Error creating image. Please try again.");
    } finally {
      setDescriptionLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!ingredientText.trim()) return;
    setIngredientLoading(true);
    try {
      const res = await fetch("/api/food-recipe-maker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingredientText }),
      });
      const data = await res.json();
      setIngredientResult(data.ingredients || data.error);
    } catch {
      setIngredientResult("Error recognizing ingredients. Please try again.");
    } finally {
      setIngredientLoading(false);
    }
  };

  const handleRecognize = async () => {
    if (!imagePreview || !selectedFile) return;
    setIsLoading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      const res = await fetch("api/ingredient-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      setResult(data.ingredients || data.error);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult("Error analyzing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg  font-semibold">AI tools</h1>
      </header>
      <main className="flex justify-center px-6 py-8">
        <div className="w-full  max-w-xl">
          <Tabs defaultValue="image-analysis" className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3 gap-3">
              <TabsTrigger value="image-analysis" className="mx-3">
                Image analysis
              </TabsTrigger>
              <TabsTrigger
                value="ingredient-recognition"
                className="mx-3 w-fit"
              >
                Ingredient recognition
              </TabsTrigger>
              <TabsTrigger value="image-creator" className="mx-3 w-fit">
                Image creator
              </TabsTrigger>
            </TabsList>
            <TabsContent value="image-analysis">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold">Image analysis</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Upload a food photo, and AI will detect the ingredients.
                </p>
                <Card>
                  <CardContent className="">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          Choose file
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedFile ? selectedFile.name : "JPG , PNG"}
                        </span>
                        <Input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </div>
                      {imagePreview && (
                        <div className="relative w-75 h-45">
                          <Image
                            fill
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-64 object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    className="bg-zinc-800 hover:bg-zinc-700"
                    onClick={handleRecognize}
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isModelLoading ? "Loading model..." : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <div className="flex flex-row w-full gap-2 items-center">
                    <BookText className="h-4 w-4" />
                    <h2 className="text-xl font-semibold">
                      Here is the summary
                    </h2>
                  </div>
                  {result ? (
                    <p>{result}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      First, enter your image to recognize food ingredients.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ingredient-recognition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold">
                      Ingredient recognition
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIngredientText("");
                      setIngredientResult(null);
                    }}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Describe the food, and AI will detect the ingredients.
                </p>
                <Card>
                  <CardContent className="pt-6">
                    <Input
                      className="w-full h-full"
                      placeholder="e.g. Tsuivan, Buuz, Mongolian beef soup..."
                      type="text"
                      value={ingredientText}
                      onChange={(e) => setIngredientText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    className="bg-zinc-800 hover:bg-zinc-700"
                    onClick={handleGenerate}
                    disabled={!ingredientText.trim() || ingredientLoading}
                  >
                    {ingredientLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Recognize
                      </>
                    )}
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="flex flex-row w-full gap-2 items-center">
                    <BookText className="h-4 w-4" />
                    <h2 className="text-xl font-semibold">
                      Identified Ingredients
                    </h2>
                  </div>
                  {ingredientResult ? (
                    <p className="whitespace-pre-line">{ingredientResult}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      Enter a food name or description to get its ingredients.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="image-creator">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold">Image creator</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Write name of the food and AI will create a photo.
                </p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Input
                        className="w-full h-full"
                        placeholder="e.g. Tsuivan, Buuz, Mongolian beef soup..."
                        type="text"
                        value={foodDescription}
                        onChange={(e) => setFoodDescription(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    className="bg-zinc-800 hover:bg-zinc-700"
                    onClick={handleCreate}
                    disabled={!foodDescription.trim() || isLoading}
                  >
                    {descriptionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {descriptionLoading
                          ? "Loading model..."
                          : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create image
                      </>
                    )}
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <div className="flex flex-row w-full gap-2 items-center">
                    <BookText className="h-4 w-4" />
                    <h2 className="text-xl font-semibold">Here is the image</h2>
                  </div>
                  {descriptionResult ? (
                    <img
                      src={descriptionResult}
                      alt="Generated"
                      className="rounded-lg max-h-96 object-contain w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      First, enter your food description to create an image.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
