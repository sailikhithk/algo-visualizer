import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export interface Flashcard {
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

interface FlashcardsProps {
  cards: Flashcard[];
}

const difficultyColors = {
  easy: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  hard: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

export function Flashcards({ cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  if (!cards || cards.length === 0) return null;

  const card = cards[currentIndex];
  const colors = difficultyColors[card.difficulty] || difficultyColors.medium;

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Card counter + difficulty */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-mono text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
        <Badge
          variant="outline"
          className={`text-[9px] px-1.5 py-0 ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {card.difficulty}
        </Badge>
      </div>

      {/* Flip card */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentIndex}-${flipped ? "back" : "front"}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`w-full min-h-[120px] rounded-lg border-2 p-4 flex flex-col justify-center ${
              flipped
                ? "bg-[hsl(168,80%,48%/0.06)] border-[hsl(168,80%,48%/0.2)]"
                : "bg-muted/20 border-border/50"
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5 ${
                  flipped ? "text-[hsl(168,80%,48%)]" : "text-muted-foreground"
                }`}
              >
                {flipped ? "A" : "Q"}
              </span>
              <p
                className={`text-xs leading-relaxed ${
                  flipped ? "text-foreground" : "text-foreground/90"
                }`}
              >
                {flipped ? card.back : card.front}
              </p>
            </div>
            {!flipped && (
              <p className="text-[9px] text-muted-foreground/50 text-center mt-3">
                Click to reveal answer
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
                setFlipped(false);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentIndex
                  ? "bg-[hsl(168,80%,48%)]"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setCurrentIndex(0);
            setDirection(-1);
          }}
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors ml-1"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
