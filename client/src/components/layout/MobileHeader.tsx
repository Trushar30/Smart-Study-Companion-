import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, FileText, Globe, HelpCircle, Calendar, Settings } from "lucide-react";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="sidebar-icon w-5 h-5" /> },
    { path: "/study-plan", label: "Study Plan", icon: <Calendar className="sidebar-icon w-5 h-5" /> },
    { path: "/notes-generator", label: "Notes Generator", icon: <FileText className="sidebar-icon w-5 h-5" /> },
    { path: "/real-world-explanations", label: "Real World Explanations", icon: <Globe className="sidebar-icon w-5 h-5" /> },
    { path: "/quiz-section", label: "Quiz Section", icon: <HelpCircle className="sidebar-icon w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="sidebar-icon w-5 h-5" /> },
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sm:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
        <h1 className="text-xl font-bold">
          <span className="text-primary">SmartStudy</span>
          <span className="text-accent">Companion</span>
        </h1>
        <button className="p-1" onClick={toggleMenu}>
          <Menu className="text-primary w-6 h-6" />
        </button>
      </header>
      
      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background bg-opacity-90 sm:hidden">
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={closeMenu}>
                <X className="text-primary w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-4">
              <ul>
                {navItems.map((item) => (
                  <li className="mb-4" key={item.path}>
                    <Link href={item.path}>
                      <a 
                        className={`sidebar-item ${location === item.path ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        {item.icon}
                        <span className={location === item.path ? 'text-primary' : ''}>{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
