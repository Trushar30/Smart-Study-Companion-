import { Link, useLocation } from "wouter";
import { Settings, Home, FileText, Globe, HelpCircle, Calendar } from "lucide-react";

interface SidebarProps {
  examDetails: {
    daysRemaining: number;
    subject: string;
  };
}

export function Sidebar({ examDetails }: SidebarProps) {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="sidebar-icon w-5 h-5" /> },
    { path: "/study-plan", label: "Study Plan", icon: <Calendar className="sidebar-icon w-5 h-5" /> },
    { path: "/notes-generator", label: "Notes Generator", icon: <FileText className="sidebar-icon w-5 h-5" /> },
    { path: "/real-world-explanations", label: "Real World Explanations", icon: <Globe className="sidebar-icon w-5 h-5" /> },
    { path: "/quiz-section", label: "Quiz Section", icon: <HelpCircle className="sidebar-icon w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="sidebar-icon w-5 h-5" /> },
  ];

  return (
    <div className="hidden sm:flex flex-col w-64 bg-sidebar h-screen border-r border-border">
      {/* Logo */}
      <div className="px-6 py-4 flex items-center border-b border-border">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Smart</span>
          <span className="text-secondary">Study</span><br />
          <span className="text-accent">Companion</span>
        </h1>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 pt-4 pb-8 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li className="mb-1" key={item.path}>
              <Link href={item.path}>
                <a className={`sidebar-item ${location === item.path ? 'active' : ''}`}>
                  {item.icon}
                  <span className={location === item.path ? 'text-primary' : ''}>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Exam Details Footer */}
      <div className="px-4 py-3 bg-card rounded-lg m-3">
        <div className="text-xs uppercase tracking-wider text-accent mb-2">EXAM DETAILS</div>
        <div className="flex items-center text-sm mb-1">
          <Calendar className="text-green-400 w-4 h-4 mr-2" />
          <span>{examDetails.daysRemaining} days remaining</span>
        </div>
        <div className="flex items-center text-sm">
          <FileText className="text-purple-400 w-4 h-4 mr-2" />
          <span>{examDetails.subject}</span>
        </div>
      </div>
    </div>
  );
}
