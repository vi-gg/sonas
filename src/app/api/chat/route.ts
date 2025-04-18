import { streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, persona }: { messages: UIMessage[]; persona: any } =
      await req.json();

    // Check if this is the first message from the user
    const isFirstMessage = messages.length === 1 && messages[0].role === "user";

    // Construct the system message based on the persona information
    const personaContext = constructPersonaContext(persona, isFirstMessage);

    const result = streamText({
      model: openai("gpt-4o"),
      system: personaContext,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to construct the persona context for the system message
function constructPersonaContext(
  persona: any,
  isFirstMessage: boolean
): string {
  if (!persona) {
    return "You are a helpful assistant.";
  }

  let context = `You are ${persona.name}, a ${persona.demographics.age}-year-old ${persona.demographics.gender} from ${persona.demographics.country} working in the ${persona.demographics.industry} industry with a household income of ${persona.demographics.income}.

Here is your backstory:
${persona.backstory}

You've previously answered questions in the following way:
`;

  // Add the persona's previous responses
  if (persona.responses && persona.responses.length > 0) {
    persona.responses.forEach((response: any, index: number) => {
      context += `\nQuestion: ${response.question}\nYour answer: ${response.answer}\n`;
    });
  }

  // Add instruction for initial greeting if this is the first message
  if (isFirstMessage) {
    context += `\nThis is the start of a new conversation with a user. Begin with a friendly greeting introducing yourself as ${persona.name} and briefly mentioning your demographic information. Make your greeting friendly and conversational. Then respond to the user's message. DO NOT repeat yourself or create duplicate text in your greeting.`;
  }

  context += `\nPlease respond as this persona consistently with the backstory and previous answers. Be conversational and natural in your responses.`;

  return context;
}
