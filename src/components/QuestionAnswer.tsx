"use client";
import { getGroqCompletion } from "@/ai/groq";
import { useState } from "react";

interface QuestionAnswerProps {
  onCorrectAnswer: () => void; // Add a callback function for correct answers
}

export default function QuestionAnswer({ onCorrectAnswer }: QuestionAnswerProps) {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const createQuestion = async () => {
    // Generate a theme related to the treasure hunt or environment
    const theme = await getGroqCompletion("Generate a theme related to a treasure hunt", 100, "");

    // Generate a riddle question based on the theme
    const generatedQuestion = await getGroqCompletion(
      `The theme is ${theme}. Generate a riddle question related to a treasure hunt.`,
      100,
      ""
    );

    setQuestion(generatedQuestion);
  };

  const submitAnswer = async () => {
    const answerCorrect = await getGroqCompletion(
      `The question was ${question}. The player's answer is ${answer}. Is the answer correct?`,
      100,
      ""
    );

    setResponse(answerCorrect);

    // If the answer is correct, call the callback function
    if (answerCorrect.includes("correct")) {
      onCorrectAnswer();
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <button onClick={createQuestion}>Create Question</button>
      <p>{question}</p>
      <input onChange={(e) => setAnswer(e.target.value)}></input>
      <button onClick={submitAnswer}>Submit Answer</button>
      <p>{response}</p>
    </div>
  );
}