import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface SidebarProps {
  onOpenQuestionModal: () => void;
}

export function Sidebar({ onOpenQuestionModal }: SidebarProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={onOpenQuestionModal}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-ask-question"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
          <Button 
            variant="secondary"
            className="w-full"
            data-testid="button-upload-homework"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Homework
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card data-testid="card-filters">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger data-testid="select-subject">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="computer-science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Grade Level</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger data-testid="select-grade">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="grade-9">Grade 9</SelectItem>
                <SelectItem value="grade-10">Grade 10</SelectItem>
                <SelectItem value="grade-11">Grade 11</SelectItem>
                <SelectItem value="grade-12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedDifficulty === "easy" ? "accent" : "outline"}
                onClick={() => setSelectedDifficulty("easy")}
                data-testid="button-difficulty-easy"
              >
                Easy
              </Button>
              <Button
                size="sm"
                variant={selectedDifficulty === "medium" ? "accent" : "outline"}
                onClick={() => setSelectedDifficulty("medium")}
                data-testid="button-difficulty-medium"
              >
                Medium
              </Button>
              <Button
                size="sm"
                variant={selectedDifficulty === "hard" ? "accent" : "outline"}
                onClick={() => setSelectedDifficulty("hard")}
                data-testid="button-difficulty-hard"
              >
                Hard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      {currentUser && (
        <Card data-testid="card-user-stats">
          <CardHeader>
            <CardTitle className="text-base">Your Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Helper Points</span>
              <span className="font-semibold text-primary" data-testid="text-user-points">
                {currentUser.points}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Questions Answered</span>
              <span className="font-semibold text-foreground" data-testid="text-user-answered">
                {currentUser.questionsAnswered}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Rank</span>
              <span className="font-semibold text-secondary" data-testid="text-user-current-rank">
                {currentUser.rank}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress to Diamond</span>
                <span className="text-muted-foreground">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full" style={{width: "78%"}} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
