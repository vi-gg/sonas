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

// Create more diverse mock personas
const createMorePersonas = () => {
  // Create more personas with diverse backgrounds
  const additionalPersonas = [
    {
      name: "Sophia Rodriguez",
      gender: "Female",
      age: 28,
      country: "United States",
      income: "100k-200k",
      industry: "Marketing",
      question1: "Monthly",
      question2: "Tablet",
    },
    {
      name: "David Kim",
      gender: "Male",
      age: 41,
      country: "United States",
      income: "200k+",
      industry: "Technology",
      question1: "Weekly",
      question2: "Laptop",
    },
    {
      name: "Emma Wilson",
      gender: "Female",
      age: 34,
      country: "United States",
      income: "100k-200k",
      industry: "Education",
      question1: "Rarely",
      question2: "Mobile Phone",
    },
    {
      name: "Jamal Washington",
      gender: "Male",
      age: 45,
      country: "United States",
      income: "150k-200k",
      industry: "Healthcare",
      question1: "Monthly",
      question2: "Laptop",
    },
    {
      name: "Olivia Chen",
      gender: "Female",
      age: 31,
      country: "United States",
      income: "200k+",
      industry: "Finance",
      question1: "Weekly",
      question2: "Mobile Phone",
    },
  ];

  // Create responses similar to mockPersonaResponses but with our new personas
  const additionalResponses = [];

  for (const persona of additionalPersonas) {
    // Question 1 response
    additionalResponses.push({
      answer: persona.question1,
      persona: `Persona: ${persona.name}`,
      question: "How often do you shop online?",
      persona_backstory: `You are person with name : ${persona.name}, country : ${persona.country}, gender : ${persona.gender}, age : ${persona.age}, household_income : ${persona.income}, employment_status : Employed, industry : ${persona.industry}`,
    });

    // Question 2 response
    additionalResponses.push({
      answer: persona.question2,
      persona: `Persona: ${persona.name}`,
      question: "What device do you primarily use for online shopping?",
      persona_backstory: `You are person with name : ${persona.name}, country : ${persona.country}, gender : ${persona.gender}, age : ${persona.age}, household_income : ${persona.income}, employment_status : Employed, industry : ${persona.industry}`,
    });
  }

  return [...mockPersonaResponses, ...additionalResponses];
};

// Add this mock data to the simulations for testing
export const addMockResultsToSimulations = (simulations: any[]) => {
  const enhancedMockData = createMorePersonas();

  return simulations.map((simulation) => ({
    ...simulation,
    results: enhancedMockData,
    status: "completed",
  }));
};
