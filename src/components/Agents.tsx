import { getGroqCompletion, getGroqCompletionParallel } from "@/ai/groq";
import { useState } from "react";

//function that runs multiple agents in parallel that compete over given resources
export default function Agents({
  initResources,
  initAgents,
  maxTokens,
  handleResponse,
}: {
  initResources: any;
  initAgents: string[];
  maxTokens: number;
  handleResponse: (resources: any, agents: string[]) => void;
}) {
  const [resources, setResources] = useState<any>(initResources);
  const [generating, setGenerating] = useState<boolean>(false);
  const [agents, setAgents] = useState<string[]>(initAgents);

  const runAgents = async () => {
    setGenerating(true);

    const newAgents = await getGroqCompletionParallel(
      //run all agents in parallel
      agents, //convert each agent to a string
      maxTokens,
      agents.map(
        (a) =>
          `You simulate autonomous agent behaviour. The goal and other properties of the agent will be provided by the user. Assign a new task to the agent to help them achieve their goal. Update the JSON object for the agent. Only return the JSON object with no other text or explanation.`
      )
    );

    //update the resources based on the new agents
    const newResources = await getGroqCompletion(
      `World State: ${JSON.stringify(resources)}. Agents: ${newAgents.join(
        ","
      )}`,
      512,
      "You are provided with a world state and an array of agents performing tasks to make changes to this world state. Update the world state JSON object to reflect the activities of the agents. Only return the JSON object with no other text or explanation.",
      true
    );

    //Then try to work out
    const newResourceJSON = JSON.parse(newResources);
    setResources(newResourceJSON);
    setAgents(newAgents);
    handleResponse(newResourceJSON, newAgents);
    setGenerating(false);
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className="p-2 bg-white rounded-lg my-4"
        onClick={() => runAgents()}
      >
        {generating ? "Generating..." : "Run Agents"}
      </button>
      <div className="flex justify-between w-full flex-wrap">
        {agents.map((a, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg bg-white p-2 hover:shadow m-2"
          >
            <span>{generating ? "Generating..." : a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
