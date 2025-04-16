import { PersonaResponse, AggregatedResponse } from "./types";

// Helper function to extract and aggregate psychographics from simulation results
export const extractPsychographicsFromResults = (
  results: PersonaResponse[]
) => {
  const uniqueValues = {
    personality: new Set<string>(),
    attitudes: new Set<string>(),
    opinions: new Set<string>(),
    socialClass: new Set<string>(),
    lifestyle: new Set<string>(),
    interests: new Set<string>(),
  };

  // Process each result's backstory to extract psychographics
  results.forEach((response) => {
    const backstory = response.persona_backstory;

    // Extract psychographics using regex patterns
    const personalityMatch = backstory.match(/personality\s*:\s*([^,]+)/i);
    const attitudesMatch = backstory.match(/attitudes\s*:\s*([^,]+)/i);
    const opinionsMatch = backstory.match(/opinions\s*:\s*([^,]+)/i);
    const socialClassMatch = backstory.match(/social_class\s*:\s*([^,]+)/i);
    const lifestyleMatch = backstory.match(/lifestyle\s*:\s*([^,]+)/i);
    const interestsMatch = backstory.match(/interests\s*:\s*(\[[^\]]+\])/i);

    // Add unique values to sets
    if (personalityMatch && personalityMatch[1].trim()) {
      uniqueValues.personality.add(personalityMatch[1].trim());
    }
    if (attitudesMatch && attitudesMatch[1].trim()) {
      uniqueValues.attitudes.add(attitudesMatch[1].trim());
    }
    if (opinionsMatch && opinionsMatch[1].trim()) {
      uniqueValues.opinions.add(opinionsMatch[1].trim());
    }
    if (socialClassMatch && socialClassMatch[1].trim()) {
      uniqueValues.socialClass.add(socialClassMatch[1].trim());
    }
    if (lifestyleMatch && lifestyleMatch[1].trim()) {
      uniqueValues.lifestyle.add(lifestyleMatch[1].trim());
    }

    // Handle interests array specially
    if (interestsMatch && interestsMatch[1]) {
      try {
        // Try to parse the array notation
        const interestsStr = interestsMatch[1].replace(/'/g, '"');
        const interests = JSON.parse(interestsStr);
        if (Array.isArray(interests)) {
          interests.forEach((interest) => {
            if (interest && typeof interest === "string") {
              uniqueValues.interests.add(interest.trim());
            }
          });
        }
      } catch (e) {
        // If parsing fails, try to extract manually
        const interestsStr = interestsMatch[1];
        const interests = interestsStr
          .replace(/[\[\]']/g, "")
          .split(",")
          .map((item) => item.trim());

        interests.forEach((interest) => {
          if (interest) {
            uniqueValues.interests.add(interest);
          }
        });
      }
    }
  });

  // Convert Sets to arrays
  return {
    personality: Array.from(uniqueValues.personality),
    attitudes: Array.from(uniqueValues.attitudes),
    opinions: Array.from(uniqueValues.opinions),
    socialClass: Array.from(uniqueValues.socialClass),
    lifestyle: Array.from(uniqueValues.lifestyle),
    interests: Array.from(uniqueValues.interests),
  };
};

// Extract unique personas from simulation results
export const extractUniquePersonas = (results: PersonaResponse[]) => {
  const personaMap = new Map();

  results.forEach((response) => {
    // Remove the "Persona: " prefix if it exists
    const personaName = response.persona.replace("Persona: ", "");

    if (!personaMap.has(personaName)) {
      // Parse the backstory to extract demographic information
      const backstory = response.persona_backstory;

      // Extract demographic details using regex
      const nameMatch = backstory.match(/name\s*:\s*([^,]+)/i);
      const countryMatch = backstory.match(/country\s*:\s*([^,]+)/i);
      const genderMatch = backstory.match(/gender\s*:\s*([^,]+)/i);
      const ageMatch = backstory.match(/age\s*:\s*(\d+)/i);
      const incomeMatch = backstory.match(/household_income\s*:\s*([^,]+)/i);
      const industryMatch = backstory.match(/industry\s*:\s*([^,]+)/i);

      // Extract psychographics details using regex
      const interestsMatch = backstory.match(/interests\s*:\s*(\[[^\]]+\])/i);
      const personalityMatch = backstory.match(/personality\s*:\s*([^,]+)/i);
      const attitudesMatch = backstory.match(/attitudes\s*:\s*([^,]+)/i);
      const opinionsMatch = backstory.match(/opinions\s*:\s*([^,]+)/i);
      const socialClassMatch = backstory.match(/social_class\s*:\s*([^,]+)/i);
      const lifestyleMatch = backstory.match(/lifestyle\s*:\s*([^,]+)/i);

      // Process interests to convert from string array to actual array
      let interestsArray: string[] = [];
      if (interestsMatch && interestsMatch[1]) {
        try {
          // The regex captures like ['Gaming', 'Music']
          const interestsStr = interestsMatch[1].replace(/'/g, '"');
          interestsArray = JSON.parse(interestsStr);
        } catch (e) {
          // If parsing fails, try to extract manually
          const interestsStr = interestsMatch[1];
          interestsArray = interestsStr
            .replace(/[\[\]']/g, "")
            .split(",")
            .map((item) => item.trim());
        }
      }

      personaMap.set(personaName, {
        name: nameMatch ? nameMatch[1].trim() : personaName,
        demographics: {
          country: countryMatch ? countryMatch[1].trim() : "",
          gender: genderMatch ? genderMatch[1].trim() : "",
          age: ageMatch ? parseInt(ageMatch[1]) : null,
          income: incomeMatch ? incomeMatch[1].trim() : "",
          industry: industryMatch ? industryMatch[1].trim() : "",
        },
        psychographics: {
          personality: personalityMatch ? [personalityMatch[1].trim()] : [],
          attitudes: attitudesMatch ? [attitudesMatch[1].trim()] : [],
          opinions: opinionsMatch ? [opinionsMatch[1].trim()] : [],
          socialClass: socialClassMatch ? [socialClassMatch[1].trim()] : [],
          lifestyle: lifestyleMatch ? [lifestyleMatch[1].trim()] : [],
          interests: interestsArray,
        },
        backstory: backstory,
        responses: [],
      });
    }

    // Add this response to the persona's responses
    const persona = personaMap.get(personaName);
    persona.responses.push({
      question: response.question.replace("Answer : ", ""),
      answer: response.answer,
    });
    personaMap.set(personaName, persona);
  });

  // Convert map to array
  return Array.from(personaMap.values());
};

// Process the results to get aggregated data
export const processResults = (
  results: PersonaResponse[]
): AggregatedResponse[] => {
  // Group responses by question
  const questionMap: { [key: string]: PersonaResponse[] } = {};

  results.forEach((response) => {
    // Clean up the question string to remove "Answer : " prefix if it exists
    const cleanQuestion = response.question.replace("Answer : ", "");

    if (!questionMap[cleanQuestion]) {
      questionMap[cleanQuestion] = [];
    }
    questionMap[cleanQuestion].push(response);
  });

  // Convert the grouped data to our aggregated format
  return Object.keys(questionMap).map((questionText) => {
    const responses = questionMap[questionText];
    const totalResponses = responses.length;

    // Count occurrences of each answer
    const optionCounts: { [option: string]: number } = {};
    responses.forEach((response) => {
      if (!optionCounts[response.answer]) {
        optionCounts[response.answer] = 0;
      }
      optionCounts[response.answer]++;
    });

    // Convert counts to our final format with percentages
    const options: {
      [option: string]: { count: number; percentage: number };
    } = {};
    Object.keys(optionCounts).forEach((option) => {
      options[option] = {
        count: optionCounts[option],
        percentage: Math.round((optionCounts[option] / totalResponses) * 100),
      };
    });

    return {
      question: questionText,
      options,
      totalResponses,
    };
  });
};

// Format date to readable string
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
