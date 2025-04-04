import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateRealWorldExplanation } from "@/lib/aiService";
import { getTopicsProgress } from "@/lib/storage";

export default function RealWorldExplanations() {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const topics = getTopicsProgress();

  const handleGenerateExplanation = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic before generating an explanation",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await generateRealWorldExplanation(topic);
      setExplanation(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Real-World Explanations <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Connect academic concepts to real-world applications</p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-cyan-400">Topic to Explain</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="gradient-btn w-full" 
                onClick={handleGenerateExplanation}
                disabled={isLoading || !topic}
              >
                {isLoading ? "Generating..." : "Generate Real-World Explanation"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {explanation && (
          <Card>
            <CardHeader>
              <div className="bg-accent bg-opacity-10 border-l-4 border-accent p-3 mb-4">
                <p className="text-sm">Connect theory to practice with real-world examples and analogies</p>
              </div>
              <CardTitle className="text-xl font-semibold text-accent">Explanation of {topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: explanation }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
