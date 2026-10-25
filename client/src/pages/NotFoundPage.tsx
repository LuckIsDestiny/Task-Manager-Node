import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40 text-center gap-6">
      <div className="space-y-3">
        <h1 className="text-7xl font-extrabold tracking-tighter text-primary">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-100 mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* The asChild prop passes all shadcn button styles directly to the Link */}
      <Button asChild size="lg">
        <Link to="/tasks">Return to Tasks</Link>
      </Button>
    </div>
  );
};
