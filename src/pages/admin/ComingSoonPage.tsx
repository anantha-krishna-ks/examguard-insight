import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Construction } from "lucide-react";

export default function ComingSoonPage() {
  const navigate = useNavigate();

  const handleBackToMonitor = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Construction className="h-24 w-24 text-primary/80" />
              <Clock className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Coming Soon
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
            This feature is currently under development. We're working hard to bring you an amazing experience.
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            
            <Button 
              onClick={handleBackToMonitor}
              className="mt-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Live Monitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}