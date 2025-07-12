import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Home, FileText, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/img/logo.png"
            alt="Nab Millers Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-foreground">
            Nab Millers Factory Management
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={location.pathname === "/" ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={
                location.pathname === "/new-transaction" ? "default" : "outline"
              }
              size="sm"
              asChild
            >
              <Link to="/new-transaction" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Transaction
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/records" ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link to="/records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Records
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
