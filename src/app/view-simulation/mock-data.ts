// Mock data for testing simulation results display

export const mockPersonaResponses = [
  {
    answer: "Weekly",
    persona: "Persona: Alex Johnson",
    question: "How often do you shop online?",
    persona_backstory:
      "You are person with name : Alex Johnson, country : United States, gender : Male, age : 35, household_income : 200k+, employment_status : Employed, industry : Technology",
  },
  {
    answer: "Weekly",
    persona: "Persona: Maria Gomez",
    question: "How often do you shop online?",
    persona_backstory:
      "You are person with name : Maria Gomez, country : United States, gender : Female, age : 42, household_income : 150k - 200k, employment_status : Employed, industry : Healthcare",
  },
  {
    answer: "Monthly",
    persona: "Persona: Jordan Lee",
    question: "How often do you shop online?",
    persona_backstory:
      "You are person with name : Jordan Lee, country : United States, gender : Non-binary, age : 29, household_income : 200k+, employment_status : Employed, industry : Finance",
  },
  {
    answer: "Weekly",
    persona: "Persona: Taylor Smith",
    question: "How often do you shop online?",
    persona_backstory:
      "You are person with name : Taylor Smith, country : United States, gender : Female, age : 50, household_income : 150k - 200k, employment_status : Employed, industry : Education",
  },
  {
    answer: "Rarely",
    persona: "Persona: Chris Brown",
    question: "How often do you shop online?",
    persona_backstory:
      "You are person with name : Chris Brown, country : United States, gender : Male, age : 46, household_income : 200k+, employment_status : Employed, industry : Retail",
  },
  {
    answer: "Laptop",
    persona: "Persona: Alex Johnson",
    question: "What device do you primarily use for online shopping?",
    persona_backstory:
      "You are person with name : Alex Johnson, country : United States, gender : Male, age : 35, household_income : 200k+, employment_status : Employed, industry : Technology",
  },
  {
    answer: "Mobile Phone",
    persona: "Persona: Maria Gomez",
    question: "What device do you primarily use for online shopping?",
    persona_backstory:
      "You are person with name : Maria Gomez, country : United States, gender : Female, age : 42, household_income : 150k - 200k, employment_status : Employed, industry : Healthcare",
  },
  {
    answer: "Tablet",
    persona: "Persona: Jordan Lee",
    question: "What device do you primarily use for online shopping?",
    persona_backstory:
      "You are person with name : Jordan Lee, country : United States, gender : Non-binary, age : 29, household_income : 200k+, employment_status : Employed, industry : Finance",
  },
  {
    answer: "Mobile Phone",
    persona: "Persona: Taylor Smith",
    question: "What device do you primarily use for online shopping?",
    persona_backstory:
      "You are person with name : Taylor Smith, country : United States, gender : Female, age : 50, household_income : 150k - 200k, employment_status : Employed, industry : Education",
  },
  {
    answer: "Mobile Phone",
    persona: "Persona: Chris Brown",
    question: "What device do you primarily use for online shopping?",
    persona_backstory:
      "You are person with name : Chris Brown, country : United States, gender : Male, age : 46, household_income : 200k+, employment_status : Employed, industry : Retail",
  },
];

// Add this mock data to the simulations for testing
export const addMockResultsToSimulations = (simulations: any[]) => {
  return simulations.map((simulation) => ({
    ...simulation,
    results: mockPersonaResponses,
    status: "completed",
  }));
};
