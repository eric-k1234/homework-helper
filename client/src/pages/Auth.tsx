import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogIn } from "lucide-react";
import { signInWithGoogle, handleRedirect, onAuthStateChange } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      firebaseUid: string;
      email: string;
      name: string;
      avatar?: string;
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user account. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Handle redirect result from Firebase
    handleRedirect().then((result) => {
      if (result?.user) {
        const user = result.user;
        createUserMutation.mutate({
          firebaseUid: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split("@")[0],
          avatar: user.photoURL || undefined,
        });
      }
    }).catch((error) => {
      console.error("Error handling redirect:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    }).finally(() => {
      setIsLoading(false);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        setLocation("/");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setLocation, createUserMutation, toast]);

  const handleGoogleSignIn = () => {
    signInWithGoogle().catch((error) => {
      console.error("Error signing in:", error);
      toast({
        title: "Sign In Error",
        description: "Failed to initiate sign in. Please try again.",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-primary animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to StudyHelper</CardTitle>
          <CardDescription>
            Join our collaborative homework platform where students help each other learn and grow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>✨ Upload homework questions</p>
            <p>🤝 Get help from peers</p>
            <p>🏆 Earn rewards for helping others</p>
          </div>
          
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={createUserMutation.isPending}
            data-testid="button-sign-in-google"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {createUserMutation.isPending ? "Setting up account..." : "Sign in with Google"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
