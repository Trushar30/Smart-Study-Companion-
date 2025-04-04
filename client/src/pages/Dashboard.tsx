import { useEffect, useState } from "react";
import { ExamCountdown } from "@/components/dashboard/ExamCountdown";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { StudyProgress, TopicProgress } from "@/components/dashboard/StudyProgress";
import { NavigationCards } from "@/components/dashboard/NavigationCards";
import { getStudyPlan, getTopicsProgress } from "@/lib/storage";

export default function Dashboard() {
  const [studyPlan, setStudyPlan] = useState<{
    subject: string;
    topics: string[];
    examDateTime: string;
  } | null>(null);
  
  const [topicsProgress, setTopicsProgress] = useState<TopicProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  
  useEffect(() => {
    const plan = getStudyPlan();
    if (plan) {
      setStudyPlan(plan);
      
      const progress = getTopicsProgress();
      if (progress && progress.length > 0) {
        setTopicsProgress(progress);
        
        // Calculate overall progress
        const overall = progress.reduce((sum, topic) => sum + topic.progress, 0) / progress.length;
        setOverallProgress(Math.round(overall));
      }
    }
  }, []);
  
  if (!studyPlan) {
    return (
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Dashboard <span className="text-muted-foreground text-sm">•</span></h2>
              <p className="text-muted-foreground text-sm">Your study command center</p>
            </div>
          </div>
          
          <div className="card p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">No Study Plan Created Yet</h3>
            <p className="mb-6">Create a study plan to start tracking your progress</p>
            <a href="/study-plan" className="gradient-btn inline-block">Create Study Plan</a>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">Dashboard <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Your study command center</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExamCountdown 
            examName={studyPlan.subject} 
            examDateTime={studyPlan.examDateTime}
          />
          
          <ProgressOverview overallProgress={overallProgress} />
          
          <StudyProgress topics={topicsProgress} />
        </div>
        
        <NavigationCards />
      </div>
    </main>
  );
}
