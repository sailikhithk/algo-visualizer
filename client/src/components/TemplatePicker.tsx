import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { SAMPLE_CODES, CATEGORY_SAMPLES } from "@/lib/sampleCode";

interface TemplatePickerProps {
  onSelect: (key: string) => void;
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  return (
    <Card className="p-3 bg-card border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Templates
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(CATEGORY_SAMPLES).map(([category, keys]) => (
          <Select key={category} onValueChange={onSelect}>
            <SelectTrigger
              className="h-7 w-auto text-[11px] bg-muted/50 border-0 px-2.5 gap-1"
              data-testid={`select-${category}`}
            >
              <SelectValue placeholder={category} />
            </SelectTrigger>
            <SelectContent>
              {keys.map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {SAMPLE_CODES[key]?.title || key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </Card>
  );
}
