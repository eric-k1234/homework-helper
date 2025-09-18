import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertQuestionSchema, type InsertQuestion } from "@shared/schema";

interface QuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const questionFormSchema = insertQuestionSchema.extend({
  subject: insertQuestionSchema.shape.subject,
  gradeLevel: insertQuestionSchema.shape.gradeLevel,
  difficulty: insertQuestionSchema.shape.difficulty,
});

export function QuestionModal({ open, onOpenChange }: QuestionModalProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertQuestion>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      subject: "",
      gradeLevel: "",
      difficulty: "",
      authorId: "",
      images: [],
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      const response = await apiRequest("POST", "/api/questions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Question Posted!",
        description: "Your question has been posted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      form.reset();
      setSelectedImages([]);
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating question:", error);
    },
  });

  const onSubmit = (data: InsertQuestion) => {
    createQuestionMutation.mutate(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedImages(Array.from(files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-question-modal">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What's your question about?" {...field} data-testid="input-question-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-question-subject">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-question-grade">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-question-difficulty">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={6} 
                      placeholder="Describe your question in detail. The more specific you are, the better help you'll receive!" 
                      {...field}
                      data-testid="textarea-question-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Attach Images (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm mb-2">Drag and drop images here, or click to browse</p>
                <Input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageChange}
                  data-testid="input-question-images"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  data-testid="button-upload-images"
                >
                  Choose Files
                </Button>
                {selectedImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedImages.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-question"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createQuestionMutation.isPending}
                data-testid="button-submit-question"
              >
                {createQuestionMutation.isPending ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
