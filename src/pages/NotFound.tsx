import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

const NotFound = () => {
  const location = useLocation();
  const { setSectionRef, isVisible } = useFadeInAnimation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/80">
      <div 
        ref={setSectionRef('content')}
        className={`text-center transition-all duration-700 ${
          isVisible('content') ? 'animate-fade-in' : 'opacity-100'
        }`}
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
