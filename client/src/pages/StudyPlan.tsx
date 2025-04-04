import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveStudyPlan } from "@/lib/storage";
import { generateStudyPlan } from "@/lib/aiService";

export default function StudyPlan() {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDateTime, setExamDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !topics || !examDateTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating a study plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const topicsList = topics.split(",").map(topic => topic.trim());
      
      // Call AI service to generate the study plan
      await generateStudyPlan(subject, topicsList, examDateTime);
      
      // Save the study plan to local storage
      saveStudyPlan({
        subject,
        topics: topicsList,
        examDateTime
      });
      
      toast({
        title: "Study Plan Created",
        description: "Your personalized study plan has been generated successfully!"
      });
      
      // Redirect to dashboard
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate study plan. Please try again later.",
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
            <h2 className="text-2xl font-bold text-secondary">Study Plan <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Your personalized roadmap to exam success</p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-purple-400">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter your subject (e.g., Chemistry)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topics" className="text-purple-400">Topics (comma separated)</Label>
                  <Textarea
                    id="topics"
                    rows={4}
                    placeholder="Enter topics separated by commas (e.g., Chemical Bonding, Thermodynamics, Organic Chemistry)"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="examDate" className="text-purple-400">Exam Date & Time</Label>
                  <Input
                    id="examDate"
                    type="datetime-local"
                    value={examDateTime}
                    onChange={(e) => setExamDateTime(e.target.value)}
                  />
                </div>
                
                <Button className="gradient-btn" type="submit" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Study Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
