"use client"
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
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ChatWidget from "./components/ChatWidget";


export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const captionRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setResult(null);
    }
  }

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
  }

  const handleGenerate = async () => {
    if (!imagePreview) return;
    setIsLoading(true);

    try {
      if (!captionRef.current) {
        setIsModelLoading(true);
        captionRef.current = await pipeline(
          "image-to-text",
          "Xenova/vit-gpt2-image-captioning",
        )
        setIsModelLoading(false);
      }
      const output = await captionRef.current(imagePreview)
      if (Array.isArray(output) && output.length > 0) {
        const caption = (output[0] as { generated_text: string }).generated_text
        setResult(caption);
      }

    } catch (error) {
      console.error(error);
      setResult("Error analyzing image. Please try again.")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg  font-semibold">AI tools</h1>
      </header>
      <main className="flex justify-center px-6 py-8">
        <div className="w-full  max-w-xl">
          <Tabs defaultValue="image-to-analysis" className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="image-analysis">Image analysis</TabsTrigger>
              <TabsTrigger value="ingredient-recognition">Ingredient recognition</TabsTrigger>
              <TabsTrigger value="image-creator">Image creator</TabsTrigger>
            </TabsList>
            <TabsContent value="image-analysis" >
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
                <p className="text-sm text-muted-foreground"> Upload a food photo, and AI will detect the ingredients.</p>
                <Card>
                  <CardContent className="pt-6">
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
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="max-h-64 object-contain rounded-lg" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    className="bg-zinc-800 hover:bg-zinc-700"
                    onClick={handleGenerate}
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (<>
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
                    <h2 className="text-xl font-semibold">Here is the summary</h2>
                  </div>
                  {result ? <p>{result}</p> : <p className="text-muted-foreground">First, enter your image to recognize food ingredients.</p>}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ingredient-recognition">
              b
            </TabsContent>
            <TabsContent value="image-creator">
              a
            </TabsContent>
          </Tabs>
        </div>
      </main >
      <ChatWidget />
    </div >
  );
}
