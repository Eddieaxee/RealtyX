import { AIChat } from "@/components/ai/ai-chat";
import { AIInsights } from "@/components/ai/ai-insights";

export default function AIAssistantPage() {
  return (
    <div className="space-y-8 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground mt-1">Your personal real estate investment copilot.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2">
          <AIChat />
        </div>
        <AIInsights />
      </div>
    </div>
  );
}