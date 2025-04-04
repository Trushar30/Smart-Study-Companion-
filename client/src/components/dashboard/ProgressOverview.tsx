import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Timer, ChartBarStacked } from "lucide-react";

interface ProgressOverviewProps {
  overallProgress: number;
}

export function ProgressOverview({ overallProgress }: ProgressOverviewProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-secondary">Progress Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Calendar className="mx-auto w-6 h-6 text-purple-400 mb-1" />
            <div className="text-xs text-muted-foreground">Study Time</div>
          </div>
          
          <div className="text-center">
            <Timer className="mx-auto w-6 h-6 text-cyan-400 mb-1" />
            <div className="text-xs text-muted-foreground">Time per Topic</div>
          </div>
          
          <div className="text-center">
            <ChartBarStacked className="mx-auto w-6 h-6 text-green-400 mb-1" />
            <div className="text-xs text-muted-foreground">Quiz Scores</div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Progress</span>
            <span className="text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} />
        </div>
      </CardContent>
    </Card>
  );
}
