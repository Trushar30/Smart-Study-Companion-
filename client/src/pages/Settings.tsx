import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearAllData, getSavedNotes } from "@/lib/storage";
import { useLocation } from "wouter";

export default function Settings() {
  const [notesCount, setNotesCount] = useState(0);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const notes = getSavedNotes();
    setNotesCount(notes.length);
  }, []);

  const handleClearAllData = () => {
    clearAllData();
    
    toast({
      title: "Data Cleared",
      description: "All your data has been cleared successfully"
    });
    
    setLocation("/study-plan");
  };
  
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">Settings <span className="text-muted-foreground text-sm">•</span></h2>
            <p className="text-muted-foreground text-sm">Customize your study companion experience</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Turn on/off dark mode</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                  disabled 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive daily study reminders</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-destructive">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 font-medium">Your Data</p>
                <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                  <li>Study Plan: {notesCount > 0 ? "Active" : "None"}</li>
                  <li>Saved Notes: {notesCount}</li>
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setLocation("/study-plan")}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Study Plan
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <Trash className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your study data, notes, and progress.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllData}>
                        Yes, clear all data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-secondary">About Smart Study Companion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Smart Study Companion is an AI-powered study tool that helps you prepare for exams efficiently with personalized study plans, notes, real-world examples, and quizzes.
            </p>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0 • © 2023 Smart Study Companion
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
