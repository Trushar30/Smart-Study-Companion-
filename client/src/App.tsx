import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import StudyPlan from "@/pages/StudyPlan";
import NotesGenerator from "@/pages/NotesGenerator";
import RealWorldExplanations from "@/pages/RealWorldExplanations";
import QuizSection from "@/pages/QuizSection";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { getStudyPlan } from "@/lib/storage";

function Router() {
  const [location] = useLocation();
  const [examDetails, setExamDetails] = useState({
    daysRemaining: 0,
    subject: "Not set yet",
  });

  useEffect(() => {
    const studyPlan = getStudyPlan();
    if (studyPlan) {
      const examDate = new Date(studyPlan.examDateTime);
      const currentDate = new Date();
      const diffTime = examDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setExamDetails({
        daysRemaining: diffDays > 0 ? diffDays : 0,
        subject: studyPlan.subject,
      });
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar examDetails={examDetails} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />
        
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/study-plan" component={StudyPlan} />
          <Route path="/notes-generator" component={NotesGenerator} />
          <Route path="/real-world-explanations" component={RealWorldExplanations} />
          <Route path="/quiz-section" component={QuizSection} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
