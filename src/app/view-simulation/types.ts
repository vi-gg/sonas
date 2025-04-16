import { User } from "@supabase/supabase-js";

export interface Simulation {
  id: string;
  simulation_name: string;
  response_count: number;
  created_at: string;
  updated_at: string;
  demographics: {
    countries: string[];
    genders: string[];
    ageRanges: string[];
    householdIncomes: string[];
  };
  psychographics?: {
    personality?: string[];
    attitudes?: string[];
    opinions?: string[];
    socialClass?: string[];
    lifestyle?: string[];
    interests?: string[];
  };
  questions: Array<{
    question: string;
    options: string[];
  }>;
  formatted_data: any;
  results?: any[];
  status?: string;
}

export interface PersonaResponse {
  answer: string;
  persona: string;
  question: string;
  persona_backstory: string;
}

export interface AggregatedResponse {
  question: string;
  options: {
    [option: string]: {
      count: number;
      percentage: number;
    };
  };
  totalResponses: number;
}

export interface ViewSimulationClientProps {
  user: User;
}

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "responses-desc"
  | "responses-asc";

export interface PersonaDetails {
  name: string;
  demographics: {
    country: string;
    gender: string;
    age: number | null;
    income: string;
    industry: string;
  };
  psychographics: {
    personality: string[];
    attitudes: string[];
    opinions: string[];
    socialClass: string[];
    lifestyle: string[];
    interests: string[];
  };
  backstory: string;
  responses: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ChatWithPersonaProps {
  persona: PersonaDetails;
  onClose: () => void;
}
