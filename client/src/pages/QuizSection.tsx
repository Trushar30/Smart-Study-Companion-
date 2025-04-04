import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz } from "@/lib/aiService";
import { updateTopicProgress, getTopicsProgress } from "@/lib/storage";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export default function QuizSection() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionsCount, setQuestionsCount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const topics = getTopicsProgress();
  
  const handleGenerateQuiz = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic before generating a quiz",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const quiz = await generateQuiz(topic, difficulty, parseInt(questionsCount));
      setQuestions(quiz);
      
      // Initialize answers
      const initialAnswers: Record<string, number | null> = {};
      quiz.forEach(q => {
        initialAnswers[q.id] = null;
      });
      setCurrentAnswers(initialAnswers);
      
      setQuizStarted(true);
      setQuizSubmitted(false);
      setScore(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    const unanswered = Object.values(currentAnswers).filter(a => a === null).length;
    if (unanswered > 0) {
      toast({
        title: "Incomplete Quiz",
        description: `You have ${unanswered} unanswered question(s). Please answer all questions before submitting.`,
        variant: "destructive"
      });
      return;
    }
    
    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correctOption) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    
    // Update topic progress
    const selectedTopic = topics.find(t => t.name === topic);
    if (selectedTopic) {
      // If the quiz score is higher than current progress, update it
      if (finalScore > selectedTopic.progress) {
        updateTopicProgress(selectedTopic.id, finalScore);
        
        toast({
          title: "Progress Updated",
          description: `Your progress for ${topic} has been updated to ${finalScore}%!`
        });
      }
    }
    
    setQuizSubmitted(true);
  };
  
  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-400">Quiz Section <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Test your knowledge with AI-generated quizzes</p>
          </div>
        </div>
        
        {!quizStarted ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-purple-400">Topic</Label>
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
                  <Label htmlFor="difficulty" className="text-purple-400">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionsCount" className="text-purple-400">Number of Questions</Label>
                  <Select value={questionsCount} onValueChange={setQuestionsCount}>
                    <SelectTrigger id="questionsCount">
                      <SelectValue placeholder="Select number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="gradient-btn w-full" 
                onClick={handleGenerateQuiz}
                disabled={isLoading || !topic}
              >
                {isLoading ? "Generating..." : "Generate Quiz"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
            {quizSubmitted ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-accent">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-2">
                      Your Score: <span className={score >= 70 ? "text-accent" : "text-destructive"}>{score}%</span>
                    </div>
                    <p className="text-muted-foreground">
                      {score >= 90 ? "Excellent! You've mastered this topic." :
                       score >= 70 ? "Great job! You're on the right track." :
                       score >= 50 ? "Good effort! Keep studying to improve." :
                       "Keep practicing. You'll get better with more study."}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {questions.map((q, index) => (
                      <div key={q.id} className={`p-4 rounded-md ${currentAnswers[q.id] === q.correctOption ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                        <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                        <div className="space-y-2 ml-4">
                          {q.options.map((option, i) => (
                            <div key={i} className={`p-2 rounded ${i === q.correctOption ? 'bg-green-900/30' : (i === currentAnswers[q.id] ? 'bg-red-900/30' : '')}`}>
                              {option}
                              {i === q.correctOption && <span className="text-green-400 ml-2">✓</span>}
                              {i === currentAnswers[q.id] && i !== q.correctOption && <span className="text-red-400 ml-2">✗</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="gradient-btn w-full mt-6" onClick={handleResetQuiz}>
                    Take Another Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-purple-400">
                    Quiz: {topic} ({difficulty})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {questions.map((q, index) => (
                      <div key={q.id} className="p-4 border border-border rounded-md">
                        <p className="font-medium mb-4">{index + 1}. {q.question}</p>
                        <RadioGroup
                          value={currentAnswers[q.id]?.toString() || ""}
                          onValueChange={(value) => handleAnswerSelect(q.id, parseInt(value))}
                        >
                          {q.options.map((option, i) => (
                            <div key={i} className="flex items-center space-x-2 p-2">
                              <RadioGroupItem value={i.toString()} id={`q${q.id}-option${i}`} />
                              <Label htmlFor={`q${q.id}-option${i}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="gradient-btn w-full mt-6" onClick={handleSubmitQuiz}>
                    Submit Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
