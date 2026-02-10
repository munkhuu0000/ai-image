import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ImageAnalysis } from "./ImageAnalysis";

export const Header = () => {
  return (
    <div className="flex flex-col justtify-left items-start gap-4">
      <ToggleGroup type="single" size="sm" defaultValue="ai" variant="outline">
        <ToggleGroupItem value="image-analysis" aria-label="Toggle top">
          Image analysis
        </ToggleGroupItem>
        <ToggleGroupItem value="ingredient" aria-label="Toggle bottom">
          Ingredient recognition
        </ToggleGroupItem>
        <ToggleGroupItem value="create" aria-label="Toggle left">
          Image creator
        </ToggleGroupItem>
      </ToggleGroup>
      <div>
        <ImageAnalysis />
      </div>
    </div>
  );
};
