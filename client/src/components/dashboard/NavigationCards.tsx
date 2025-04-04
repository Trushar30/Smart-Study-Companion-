import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { FileText, HelpCircle, Globe, Settings } from "lucide-react";

export function NavigationCards() {
  const navCards = [
    { 
      icon: <FileText className="text-3xl text-cyan-400 mb-2 w-8 h-8" />,
      label: "Generate Notes",
      path: "/notes-generator" 
    },
    { 
      icon: <HelpCircle className="text-3xl text-purple-400 mb-2 w-8 h-8" />,
      label: "Take Quiz",
      path: "/quiz-section" 
    },
    { 
      icon: <Globe className="text-3xl text-green-400 mb-2 w-8 h-8" />,
      label: "Explanations",
      path: "/real-world-explanations" 
    },
    { 
      icon: <Settings className="text-3xl text-blue-400 mb-2 w-8 h-8" />,
      label: "Settings",
      path: "/settings" 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {navCards.map((card) => (
        <Link key={card.path} href={card.path}>
          <Card className="flex flex-col items-center justify-center p-4 text-center cursor-pointer">
            {card.icon}
            <span className="text-sm">{card.label}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
