import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "wouter";

export interface TopicProgress {
  id: string;
  name: string;
  progress: number;
}

interface StudyProgressProps {
  topics: TopicProgress[];
}

export function StudyProgress({ topics }: StudyProgressProps) {
  const getProgressFillColor = (progress: number) => {
    if (progress >= 90) return "primary";
    if (progress >= 50) return "secondary";
    if (progress >= 30) return "accent";
    return "destructive";
  };

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold text-accent">Study Progress</CardTitle>
        <Link href="/study-plan">
          <Button variant="ghost" className="text-sm h-8">
            <Edit className="mr-1 h-4 w-4" />
            Edit Plan
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.id} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{topic.name}</span>
                <span className="text-primary">{topic.progress}%</span>
              </div>
              <Progress 
                value={topic.progress}
                fillColor={getProgressFillColor(topic.progress)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
