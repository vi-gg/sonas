"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface QuestionSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: QuestionData) => void;
  onDelete: () => void;
  questionData?: QuestionData;
  isEditing: boolean;
}

export interface QuestionData {
  id: string;
  question: string;
  options: string[];
}

export function QuestionSheet({
  className,
  open,
  onOpenChange,
  onSave,
  onDelete,
  questionData,
  isEditing,
}: QuestionSheetProps) {
  const [formData, setFormData] = useState<{
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  }>({
    id: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (questionData && open) {
      // Convert from options array to individual fields
      setFormData({
        id: questionData.id,
        question: questionData.question,
        optionA: questionData.options[0] || "",
        optionB: questionData.options[1] || "",
        optionC: questionData.options[2] || "",
        optionD: questionData.options[3] || "",
      });
      setError("");
    } else if (!questionData && open) {
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
      });
      setError("");
    }
  }, [questionData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // Validate question has text
    if (!formData.question.trim()) {
      setError("Question text is required");
      return;
    }

    // Validate at least 2 options
    const options = [formData.optionA, formData.optionB, formData.optionC, formData.optionD].filter(
      (option) => option.trim() !== "",
    );

    if (options.length < 2) {
      setError("At least 2 options are required");
      return;
    }

    // Convert to expected format with options array
    const questionData: QuestionData = {
      id: formData.id,
      question: formData.question,
      options: options,
    };

    onSave(questionData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit question" : "Add a question"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Edit your question and answer options"
              : "Add a new question with multiple choice answers"}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <p className="text-xs text-gray-500 italic mb-3">
            Please provide a question and at least two answer options for your survey participants.
          </p>

          <div className="space-y-2">
            <label htmlFor="question" className="block font-medium">
              Question <span className="text-red-500">*</span>
            </label>
            <Input
              id="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Enter your question"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="optionA" className="block font-medium">
              Option A <span className="text-red-500">*</span>
            </label>
            <Input
              id="optionA"
              value={formData.optionA}
              onChange={handleInputChange}
              placeholder="Enter answer option A"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="optionB" className="block font-medium">
              Option B <span className="text-red-500">*</span>
            </label>
            <Input
              id="optionB"
              value={formData.optionB}
              onChange={handleInputChange}
              placeholder="Enter answer option B"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="optionC" className="block font-medium">
              Option C
            </label>
            <Input
              id="optionC"
              value={formData.optionC}
              onChange={handleInputChange}
              placeholder="Enter answer option C"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="optionD" className="block font-medium">
              Option D
            </label>
            <Input
              id="optionD"
              value={formData.optionD}
              onChange={handleInputChange}
              placeholder="Enter answer option D"
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={() => {
                // Call handleSave and close the sheet only if there's no error
                handleSave();
                if (!error) {
                  onOpenChange(false);
                }
              }}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </Button>

            {isEditing && (
              <Button
                onClick={() => {
                  onDelete();
                  onOpenChange(false);
                }}
                variant="destructive"
                className="flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
