import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getAIRecommendation } from "../lib/AIModel";
import RecommendedMovies from "../components/RecommendedMovies";

const steps = [
  {
    name: "genre",
    label: "What's your favorite genre?",
    options: [
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Animation",
    ],
  },
  {
    name: "mood",
    label: "What's your current mood?",
    options: [
      "Excited",
      "Relaxed",
      "Thoughtful",
      "Scared",
      "Inspired",
      "Romantic",
    ],
  },
  {
    name: "decade",
    label: "Preferred decade?",
    options: ["2020s", "2010s", "2000s", "1990s", "Older"],
  },
  {
    name: "language",
    label: "Preferred language?",
    options: ["English", "Korean", "Spanish", "French", "Other"],
  },
  {
    name: "length",
    label: "Preferred movie length?",
    options: ["Short (<90 min)", "Standard (90-120 min)", "Long (>120 min)"],
  },
];

const initialState = steps.reduce((acc, step) => {
  acc[step.name] = "";
  return acc;
}, {});

const AIRecommendations = () => {
  const [inputs, setInputs] = useState(initialState);
  const [step, setStep] = useState(0);
  const [recommendation, setRecommendation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOption = (value) => {
    setInputs({ ...inputs, [steps[step].name]: value });
    console.log(inputs);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log(inputs);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const generateRecommendations = async () => {
    // Check for missing fields
    const missingFields = Object.entries(inputs)
      .filter(([_, v]) => !v)
      .map(([k]) => k);
    if (missingFields.length) {
      toast.error(`Please fill: ${missingFields.join(", ")}`);
      return;
    }

    setIsLoading(true);

    const userPrompt = `Given the following user inputs:

- Decade: ${inputs.decade}
- Genre: ${inputs.genre}
- Language: ${inputs.language}
- Length: ${inputs.length}
- Mood: ${inputs.mood}

Recommend 10 ${inputs.mood.toLowerCase()} ${inputs.language}-language ${inputs.genre.toLowerCase()} movies released in the ${inputs.decade} with a runtime between ${inputs.length}. Return the list as plain JSON array of movie titles only, No extra text, no explanations, no code blocks, no markdown, just the JSON array.
example:
[
  "Movie Title 1",
  "Movie Title 2",
  "Movie Title 3",
  "Movie Title 4",
  "Movie Title 5",
  "Movie Title 6",
  "Movie Title 7",
  "Movie Title 8",
  "Movie Title 9",
  "Movie Title 10"
]`;

    const result = await getAIRecommendation(userPrompt);

    setIsLoading(false);

    if (result) {
      const cleanedResult = result
        .replace(/```json\n/i, "")
        .replace(/\n```/i, "");
      try {
        const recommendationArray = JSON.parse(cleanedResult);
        setRecommendation(recommendationArray);
        console.log(recommendationArray);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      toast.error("Failed to get recommendations.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] relative overflow-hidden">
      {!(recommendation && recommendation.length > 0) && (
        <img
          src="/background_banner.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px] "
        />
      )}

      {recommendation && recommendation.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto mt-2">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            AI Recommended Movies
          </h2>
          <RecommendedMovies movieTitles={recommendation} />
        </div>
      ) : (
        <div className="relative w-full max-w-md mx-auto rounded-2xl bg-[#181818]/90 shadow-2xl border border-[#333] px-8 py-10 mt-4 flex flex-col items-center min-h-[480px]">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight drop-shadow-lg">
            AI Movie Recommendation
          </h2>

          <div className="w-full flex items-center mb-8">
            <div className="flex-1 h-2 bg-[#232323] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e50914] transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            <span className="ml-4 text-white text-sm font-semibold">
              {step + 1}/{steps.length}
            </span>
          </div>

          <div className="w-full flex flex-col flex-1">
            <div className="mb-6 flex-1">
              <h3 className=" text-lg font-semibold text-white mb-6 text-center">
                {steps[step].label}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className={`w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-2 active:scale-95 duration-150 focus:ring-[#e50914] shadow-sm ${
                      inputs[steps[step].name] == opt
                        ? "bg-[#e50914] border-[#e50914] text-white shadow-lg"
                        : "bg-[#232323] border-[#444] text-white hover:bg-[#e50914]/80 hover:border-[#e50914]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={step == 0}
                className="px-6 py-2 rounded-lg font-semibold transition border-2 border-[#444] text-white bg-[#181818] hover:bg-[#232323]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={
                  step === steps.length - 1
                    ? generateRecommendations
                    : handleNext
                }
                disabled={!inputs[steps[step].name] || isLoading}
                className="px-6 py-2 rounded-lg font-semibold transition border-2 border-[#e50914] text-white bg-[#e50914] hover:bg-[#b0060f] ml-2"
              >
                {step === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;