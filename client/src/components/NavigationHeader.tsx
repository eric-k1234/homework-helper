import { useState } from "react";
import { Link } from "wouter";
import { Search, Bell, ChevronDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function NavigationHeader() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <GraduationCap className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold text-foreground">StudyHelper</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="link-dashboard">
                Dashboard
              </Link>
              <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-browse">
                Browse Questions
              </Link>
              <Link href="/ask" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-ask">
                Ask Question
              </Link>
              <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-leaderboard">
                Leaderboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search questions..." 
                className="pl-10 w-64 bg-muted"
                data-testid="input-search"
              />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* User Profile */}
            {currentUser && (
              <div className="flex items-center space-x-3">
                <img 
                  src={currentUser.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full ring-2 ring-primary"
                  data-testid="img-user-avatar"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground" data-testid="text-user-name">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-user-rank">
                    {currentUser.rank}
                  </p>
                </div>
                <Button variant="ghost" size="sm" data-testid="button-user-menu">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
