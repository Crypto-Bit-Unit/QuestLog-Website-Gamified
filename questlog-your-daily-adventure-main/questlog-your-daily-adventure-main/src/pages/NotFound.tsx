import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-8">
      <div className="text-center panel-glow p-12 max-w-md">
        <div className="pixel-text text-xs text-primary mb-4">⚠ DUNGEON NOT FOUND</div>
        <h1 className="text-7xl font-bold gold-text mb-3">404</h1>
        <p className="text-muted-foreground mb-6">This realm does not exist on any map.</p>
        <Link to="/" className="inline-block bg-gradient-xp text-primary-foreground font-bold px-6 py-2 rounded shadow-glow-primary">
          Return to Command Center
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
