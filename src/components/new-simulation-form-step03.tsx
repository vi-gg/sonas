"use client";

import { Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionSheet, QuestionData } from "@/components/question-sheet";

interface NewSimulationFormStep03Props {
  className?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  formData?: any;
  updateFormData?: (data: any) => void;
}

export function NewSimulationFormStep03({
  className,
  onNext,
  onPrevious,
  formData,
  updateFormData,
}: NewSimulationFormStep03Props) {
  // Initialize with questions from formData if they exist, otherwise empty array
  const [questions, setQuestions] = useState<QuestionData[]>(
    formData?.questions || []
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<
    QuestionData | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize from form data when it changes
  useEffect(() => {
    if (formData?.questions) {
      setQuestions(formData.questions);
    }
  }, [formData?.questions]);

  const handleAddQuestionClick = () => {
    setCurrentQuestion(undefined);
    setIsEditing(false);
    setSheetOpen(true);
  };

  const handleEditQuestionClick = (questionData: QuestionData) => {
    setCurrentQuestion(questionData);
    setIsEditing(true);
    setSheetOpen(true);
  };

  const handleSaveQuestion = (questionData: QuestionData) => {
    let updatedQuestions;

    if (isEditing) {
      updatedQuestions = questions.map((q) =>
        q.id === questionData.id ? questionData : q
      );
    } else {
      updatedQuestions = [...questions, questionData];
    }

    setQuestions(updatedQuestions);

    // Update parent form data
    if (updateFormData) {
      updateFormData({ questions: updatedQuestions });
    }

    setSheetOpen(false);
  };

  const handleDeleteQuestion = () => {
    if (currentQuestion) {
      const updatedQuestions = questions.filter(
        (q) => q.id !== currentQuestion.id
      );
      setQuestions(updatedQuestions);

      // Update parent form data
      if (updateFormData) {
        updateFormData({ questions: updatedQuestions });
      }

      setSheetOpen(false);
    }
  };

  const handleNext = () => {
    // Make sure the parent form data is updated before proceeding
    if (updateFormData) {
      updateFormData({ questions });
    }

    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-8 w-[768px]",
        className
      )}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Step 03</p>
          <h2 className="text-2xl font-bold font-heading mt-1">
            Add questions which you want your personas to answer
          </h2>
        </div>

        <div className="space-y-3">
          {questions.length < 6 && (
            <Button
              variant="default"
              onClick={handleAddQuestionClick}
              className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center py-5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a question
            </Button>
          )}

          {questions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              onClick={() => handleEditQuestionClick(question)}
              className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit question {String(index + 1).padStart(2, "0")}
            </Button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            className="border border-border"
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>

      <QuestionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSaveQuestion}
        onDelete={handleDeleteQuestion}
        questionData={currentQuestion}
        isEditing={isEditing}
      />
    </div>
  );
}
