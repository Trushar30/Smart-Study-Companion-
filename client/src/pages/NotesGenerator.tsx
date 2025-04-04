import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateNotes } from "@/lib/aiService";
import { saveNote, getTopicsProgress } from "@/lib/storage";

export default function NotesGenerator() {
  const [topic, setTopic] = useState("");
  const [detailLevel, setDetailLevel] = useState("advanced");
  const [format, setFormat] = useState("bulletPoints");
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const topics = getTopicsProgress();

  const handleGenerateNotes = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic before generating notes",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const notes = await generateNotes(topic, detailLevel, format);
      setGeneratedNotes(notes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate notes. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveNotes = () => {
    if (!generatedNotes) return;
    
    try {
      saveNote({
        id: Date.now().toString(),
        topic,
        content: generatedNotes,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-accent">Notes Generator <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Generate smart study notes with AI assistance</p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-cyan-400">Topic</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="detailLevel" className="text-cyan-400">Detail Level</Label>
                <Select value={detailLevel} onValueChange={setDetailLevel}>
                  <SelectTrigger id="detailLevel">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format" className="text-cyan-400">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bulletPoints">Bullet Points</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="conceptMap">Concept Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="gradient-btn w-full" 
              onClick={handleGenerateNotes}
              disabled={isLoading || !topic}
            >
              {isLoading ? "Generating..." : "Generate Notes"}
            </Button>
          </CardContent>
        </Card>
        
        {generatedNotes && (
          <Card>
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle className="text-xl font-semibold text-accent">Generated Notes</CardTitle>
              <Button variant="outline" className="text-green-500 border-green-500" onClick={handleSaveNotes}>
                <Save className="w-4 h-4 mr-1" />
                Save Notes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-card/70 p-6 rounded-md prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">{topic}: Comprehensive Study Notes</h2>
                <div dangerouslySetInnerHTML={{ __html: generatedNotes }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
