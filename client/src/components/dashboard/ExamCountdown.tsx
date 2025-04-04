import { useState, useEffect } from "react";
import { calculateTimeRemaining } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExamCountdownProps {
  examName: string;
  examDateTime: string;
}

export function ExamCountdown({ examName, examDateTime }: ExamCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(examDateTime));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(examDateTime));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [examDateTime]);
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Exam Countdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-sm">
          <span>{examName}</span>
          <div className="text-muted-foreground">Final examination</div>
        </div>
        
        <div className="flex flex-wrap justify-between mb-4">
          <div className="countdown-item w-full sm:w-1/4 p-4 text-center mb-2 sm:mb-0">
            <div className="text-3xl font-bold text-primary">{timeRemaining.days}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Days</div>
          </div>
          
          <div className="countdown-item w-full sm:w-1/4 p-4 text-center mb-2 sm:mb-0">
            <div className="text-3xl font-bold text-secondary">{timeRemaining.hours}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Hours</div>
          </div>
          
          <div className="countdown-item w-full sm:w-1/4 p-4 text-center mb-2 sm:mb-0">
            <div className="text-3xl font-bold text-accent">{timeRemaining.minutes}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Minutes</div>
          </div>
          
          <div className="countdown-item w-full sm:w-1/4 p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{timeRemaining.seconds}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Secs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
