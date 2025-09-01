import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">ExamGuard Forensics</CardTitle>
          <p className="text-muted-foreground">
            Real-time exam security monitoring and analytics platform
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/admin" className="flex items-center justify-center">
              Access Admin Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
