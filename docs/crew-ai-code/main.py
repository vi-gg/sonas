import json
import os
import random

from flask import Flask, jsonify, request
from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from typing import Any, List, Optional, Literal
from pydantic import BaseModel, create_model

def create_choice_model(field_name, choices, model_name: str = "ChoiceModel"):
    literal_type = Literal[tuple(choices)]
    return create_model(
        model_name,
        **{field_name: (literal_type, ...)}
    )


class Persona(BaseModel):
    name: str
    country: str
    gender: str
    age: int
    household_income: str
    employment_status: str
    industry: str
    interests: list
    personality: str
    attitudes: str
    opinions: str
    social_class: str
    lifestyle: str

class PersonaList(BaseModel):
    personas: List[Persona]


# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = ""  # Replace with your actual API key

# Initialize the model
llm = ChatOpenAI(model="gpt-4o-2024-08-06")

app = Flask(__name__)

def create_persona_criteria(target_description, target_criteria):
    for category, value in target_criteria.items():
        if isinstance(value, dict):
            target_description += create_persona_criteria(target_description, value)
        elif isinstance(value, str):
            target_description += "{} : {}".format(category, value)
        elif isinstance(value, list):
            values = [str(v) for v in value]
            if category.endswith('_range'):
                target_description += "{} : {}".format(category, ' - '.join(values))
            else:
                target_description += "{} : {}".format(category, random.choice(values))
        target_description += ', '
    return target_description

def create_persona_description(num_responses, target_criteria):
    description = "Create {} distinct personas with details: {}. Return the output as a JSON-formatted list of dictionaries"
    target_description = create_persona_criteria("", target_criteria)
    description = description.format(num_responses, target_description)
    return description

def create_persona_output_format(num_responses, target_criteria):
    description = "A JSON-formatted list of {} personas, each with {}"
    target_description = create_persona_criteria("", target_criteria)
    description = description.format(num_responses, target_description)
    return description

def extract_persona_backstory(persona):
    backstory = "You are person with {}"
    target_categories = Persona.model_fields.keys()
    characteristics = ""
    for category in target_categories:
        characteristics += "{} : {}, ".format(category, persona.get(category, 'Unkown'))
    backstory = backstory.format(characteristics)
    return backstory

@app.route('/personas', methods=['POST'])
def create_personas():
    payload = request.json
    num_responses = payload.get('num_responses', 100)
    target_criteria = payload.get('target_audience', {})

    persona_description = create_persona_description(num_responses, target_criteria)
    expected_output_format = create_persona_output_format(num_responses, target_criteria)
    survey_questions = payload.get("survey", [])

    try:
        # Define persona creator agent
        persona_creator = Agent(
            role="Persona Creator",
            goal="Create multiple distinct personas with demographic details",
            backstory="You are an expert in crafting detailed user personas.",
            llm=llm,
            verbose=True
        )

        # Task to create personas dynamically
        persona_task = Task(
            description=persona_description,
            expected_output=expected_output_format,
            agent=persona_creator,
            output_json=PersonaList
        )

        # Run persona creation separately
        initial_crew = Crew(agents=[persona_creator], tasks=[persona_task], verbose=1)
        persona_result = initial_crew.kickoff()

        # Parse the result
        try:
            task_result = json.loads(persona_task.output.json)
            personas = task_result.get('personas', [])
        except Exception as e:
            print("Exception while creating persona, falling back to default personas")
            # Fallback personas if parsing fails or LLM is unavailable
            personas = [
                {"name": "Person 1", "demography": "Middle-class", "gender": "Female", "age": 28, "location": "San Francisco, CA", "occupation": "Designer", "interests": "Art, yoga"},
                {"name": "Person 2", "demography": "Upper-middle-class", "gender": "Male", "age": 42, "location": "Austin, TX", "occupation": "Engineer", "interests": "Tech, hiking"},
                {"name": "Person 3", "demography": "Working-class", "gender": "Non-binary", "age": 19, "location": "Chicago, IL", "occupation": "Barista", "interests": "Music, activism"}
            ]

        # Dynamically create agents and tasks for each persona
        agents = []
        tasks = []
        for persona in personas:
            persona_backstory = extract_persona_backstory(persona)

            # Create agent for the persona
            agent = Agent(
                role=f"Persona: {persona.get('name', 'Unknown')}",
                goal=f"Respond to questions as {persona.get('name', 'Unknown')}",
                backstory=persona_backstory,
                llm=llm,
                verbose=True
            )
            agents.append(agent)

            for survey_question in survey_questions:
                question, choices = survey_question.get("question"), survey_question.get("choices") 
                desc = "Answer : {}".format(question)
                expected_output = "A response from {} based on their persona. Select one option from: {} \
                    ".format(persona.get('name', 'Unknown'), ', '.join(choices))
                choice_model = create_choice_model("answer", choices)
                # Create task for the agent
                task = Task(
                    description=desc,
                    expected_output=expected_output,
                    agent=agent,
                    output_json=choice_model
                )
                tasks.append(task)

        # Create crew for isolated persona conversations
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=1
        )

        # Run the crew
        result = crew.kickoff()

        response = []
        for survey_task in tasks:
            response.append({
                'persona': survey_task.agent.role,
                'persona_backstory': survey_task.agent.backstory,
                'question': survey_task.description,
                'answer': json.loads(survey_task.output.json).get('answer')
            })

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
