import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuestionCard } from "./QuestionCard";
import { useQuery } from "@tanstack/react-query";
import type { QuestionWithAuthor, User } from "@shared/schema";

export function MainContent() {
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: questions = [], isLoading } = useQuery<QuestionWithAuthor[]>({
    queryKey: ["/api/questions", sortBy],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="gradient-bg rounded-lg p-6 text-white">
          <div className="h-6 bg-white/20 rounded animate-pulse mb-2" />
          <div className="h-4 bg-white/20 rounded animate-pulse w-3/4" />
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-bg rounded-lg p-6 text-white" data-testid="banner-welcome">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser?.name || "Student"}! 👋
        </h1>
        <p className="opacity-90">
          Ready to help fellow students and earn points? You're 3 questions away from Diamond rank!
        </p>
      </div>

      {/* Recent Questions Feed */}
      <Card data-testid="card-questions-feed">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Recent Questions</h2>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={sortBy === "newest" ? "default" : "outline"}
                onClick={() => setSortBy("newest")}
                data-testid="button-sort-newest"
              >
                Newest
              </Button>
              <Button
                size="sm"
                variant={sortBy === "helpful" ? "default" : "outline"}
                onClick={() => setSortBy("helpful")}
                data-testid="button-sort-helpful"
              >
                Most Helpful
              </Button>
              <Button
                size="sm"
                variant={sortBy === "unanswered" ? "default" : "outline"}
                onClick={() => setSortBy("unanswered")}
                data-testid="button-sort-unanswered"
              >
                Unanswered
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="divide-y divide-border">
          {questions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground" data-testid="text-no-questions">
              No questions found. Be the first to ask a question!
            </div>
          ) : (
            questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          )}
        </div>

        {questions.length > 0 && (
          <div className="p-4 border-t border-border text-center">
            <Button variant="ghost" data-testid="button-load-more">
              Load More Questions
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
