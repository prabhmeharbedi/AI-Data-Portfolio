import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import AITools from "@/pages/AITools";
import Resume from "@/pages/Resume";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GenerativeBackground from "@/components/GenerativeBackground";
import ScrollProgress from "@/components/ScrollProgress";
import ChatAssistant from "@/components/ChatAssistant";
import CustomCursor from "@/components/CustomCursor";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/ai-tools" component={AITools} />
      <Route path="/resume" component={Resume} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-light dark:bg-dark text-dark dark:text-light font-body relative">
        <ScrollProgress />
        <CustomCursor />
        <GenerativeBackground />
        <Navigation theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Router />
        </main>
        <Footer />
        <ChatAssistant />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
