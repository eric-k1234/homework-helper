import { useState } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { RightSidebar } from "@/components/RightSidebar";
import { QuestionModal } from "@/components/QuestionModal";

export default function Dashboard() {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Sidebar onOpenQuestionModal={() => setIsQuestionModalOpen(true)} />
          </div>
          
          <div className="lg:col-span-2">
            <MainContent />
          </div>
          
          <div className="lg:col-span-1">
            <RightSidebar />
          </div>
        </div>
      </div>

      <QuestionModal 
        open={isQuestionModalOpen} 
        onOpenChange={setIsQuestionModalOpen} 
      />
    </div>
  );
}
