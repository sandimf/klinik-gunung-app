import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";

export function PromptSuggestions({
  label,
  append,
  suggestions
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">{label}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 pb-6 px-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => append({ role: "user", content: suggestion })}
              className="min-w-[180px] h-max flex-shrink-0 rounded-xl border bg-background p-4 hover:bg-muted transition"
            >
              <p className="text-center">{suggestion}</p>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
