import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Medal, Star, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function RightSidebar() {
  const { data: topHelpers = [] } = useQuery<User[]>({
    queryKey: ["/api/users/top-helpers"],
  });

  return (
    <div className="space-y-6">
      {/* Top Helpers */}
      <Card data-testid="card-top-helpers">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Trophy className="text-secondary mr-2 h-5 w-5" />
            Top Helpers This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topHelpers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No helpers found</p>
          ) : (
            topHelpers.slice(0, 3).map((helper, index) => (
              <div key={helper.id} className="flex items-center space-x-3" data-testid={`helper-${index + 1}`}>
                <div className="relative">
                  <img 
                    src={helper.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`} 
                    alt="Top helper avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground" data-testid={`helper-name-${index + 1}`}>
                    {helper.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`helper-rank-${index + 1}`}>
                    {helper.rank} • {helper.points} pts
                  </p>
                </div>
              </div>
            ))
          )}
          <Button variant="ghost" className="w-full mt-4 text-primary" data-testid="button-view-leaderboard">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>

      {/* Study Groups */}
      <Card data-testid="card-study-groups">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Users className="text-primary mr-2 h-5 w-5" />
            Active Study Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm text-foreground">AP Physics Study Group</h4>
              <span className="text-xs text-accent font-medium">12 active</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Working on mechanics problems together</p>
            <Button size="sm" variant="ghost" className="text-xs text-primary p-0 h-auto" data-testid="button-join-physics">
              Join Group
            </Button>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm text-foreground">Calculus Homework Help</h4>
              <span className="text-xs text-accent font-medium">8 active</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Daily homework solving sessions</p>
            <Button size="sm" variant="ghost" className="text-xs text-primary p-0 h-auto" data-testid="button-join-calculus">
              Join Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      <Card data-testid="card-achievements">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Medal className="text-secondary mr-2 h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Star className="text-white text-sm h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Quick Responder</p>
              <p className="text-xs text-muted-foreground">Answered 5 questions in 1 hour</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Heart className="text-white text-sm h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Helpful Helper</p>
              <p className="text-xs text-muted-foreground">Received 50+ likes this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
