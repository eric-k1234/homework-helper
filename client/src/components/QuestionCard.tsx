import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuestionWithAuthor } from "@shared/schema";

interface QuestionCardProps {
  question: QuestionWithAuthor;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-accent/10 text-accent";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "mathematics":
        return "bg-primary/10 text-primary";
      case "physics":
        return "bg-secondary/10 text-secondary";
      case "chemistry":
        return "bg-purple-100 text-purple-700";
      case "biology":
        return "bg-green-100 text-green-700";
      case "computer science":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors" data-testid={`card-question-${question.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img 
            src={question.author.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`} 
            alt="Student avatar" 
            className="w-10 h-10 rounded-full flex-shrink-0"
            data-testid={`img-author-${question.id}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-foreground" data-testid={`text-author-${question.id}`}>
                {question.author.name}
              </span>
              <span className="text-xs text-muted-foreground" data-testid={`text-time-${question.id}`}>
                {question.createdAt ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true }) : 'Unknown'}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getSubjectColor(question.subject)}`}>
                {question.subject}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              {question.solved && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Solved
                </span>
              )}
            </div>
            <h3 className="font-medium text-foreground mb-2" data-testid={`text-title-${question.id}`}>
              {question.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-content-${question.id}`}>
              {question.content}
            </p>
            
            {/* Question Images */}
            {question.images && question.images.length > 0 && (
              <div className="mb-3">
                <img 
                  src={question.images[0]} 
                  alt="Question attachment" 
                  className="rounded-lg border border-border max-w-md"
                  data-testid={`img-attachment-${question.id}`}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="p-0 h-auto" data-testid={`button-comments-${question.id}`}>
                <MessageCircle className="mr-1 h-4 w-4" />
                <span>{question.commentCount} replies</span>
              </Button>
              <Button variant="ghost" size="sm" className="p-0 h-auto" data-testid={`button-likes-${question.id}`}>
                <Heart className="mr-1 h-4 w-4" />
                <span>{question.likes}</span>
              </Button>
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span data-testid={`text-views-${question.id}`}>{question.views} views</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
