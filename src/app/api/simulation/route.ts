import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get simulation data from the request
    const payload = await request.json();

    // Extract necessary information for database storage
    const simulationData = {
      user_id: user.id,
      simulation_name: payload.simulation_name || "My Simulation",
      response_count: parseInt(payload.num_responses),
      demographics: {
        countries: [
          payload.target_audience.country === "United States"
            ? "US"
            : payload.target_audience.country,
        ],
        genders:
          payload.target_audience.gender === "All"
            ? ["male", "female", "others"]
            : payload.target_audience.gender.split(", "),
        ageRanges: [
          `${payload.target_audience.age_range[0]}-${payload.target_audience.age_range[1]}`,
        ],
        householdIncomes: [
          `${payload.target_audience.household_income_range[0]}-${payload.target_audience.household_income_range[1]}`,
        ],
      },
      questions: payload.survey.map(
        (q: { question: string; choices: string[] }) => ({
          question: q.question,
          options: q.choices,
        })
      ),
      formatted_data: payload,
    };

    // Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from("simulations")
      .insert(simulationData)
      .select();

    if (dbError) {
      console.error("Error saving simulation:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Call the personas endpoint if configured
    const personasEndpoint = process.env.PERSONAS_ENDPOINT;
    if (personasEndpoint) {
      try {
        const res = await fetch(personasEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const personasData = await res.json();

        // Return both the database data and personas response
        return NextResponse.json({
          simulation: dbData[0],
          personas: personasData,
        });
      } catch (error) {
        console.error("Failed to call persona endpoint:", error);
        // Still return the simulation data even if personas call fails
        return NextResponse.json({
          simulation: dbData[0],
          personas_error: "Failed to call persona endpoint",
        });
      }
    }

    // Return just the simulation data if no personas endpoint
    return NextResponse.json({ simulation: dbData[0] });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
