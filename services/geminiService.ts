
import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, DietPlan, FoodAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dietPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dailyCalories: { type: Type.NUMBER, description: "Estimated daily caloric intake goal." },
    macros: {
        type: Type.OBJECT,
        properties: {
            protein: { type: Type.NUMBER, description: "Daily protein goal in grams." },
            carbs: { type: Type.NUMBER, description: "Daily carbohydrates goal in grams." },
            fats: { type: Type.NUMBER, description: "Daily fats goal in grams." }
        },
        required: ["protein", "carbs", "fats"]
    },
    mealPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          mealType: { type: Type.STRING, description: "e.g., Breakfast, Lunch, Dinner, Snack" },
          description: { type: Type.STRING, description: "Detailed description of the meal." },
          calories: { type: Type.NUMBER, description: "Estimated calories for this meal." },
          protein: { type: Type.NUMBER, description: "Protein in grams for this meal." },
          carbs: { type: Type.NUMBER, description: "Carbohydrates in grams for this meal." },
          fats: { type: Type.NUMBER, description: "Fats in grams for this meal." }
        },
        required: ["mealType", "description", "calories", "protein", "carbs", "fats"]
      }
    }
  },
  required: ["dailyCalories", "macros", "mealPlan"]
};

const foodAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        foodName: { type: Type.STRING, description: "The name of the food identified in the image." },
        calories: { type: Type.NUMBER, description: "Estimated calories in the food." },
        protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
        carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
        fats: { type: Type.NUMBER, description: "Estimated fats in grams." },
        description: { type: Type.STRING, description: "A brief description of the food and its nutritional value." },
        healthScore: { type: Type.NUMBER, description: "A score from 1 to 10 on how healthy this food is." },
    },
    required: ["foodName", "calories", "protein", "carbs", "fats", "description", "healthScore"]
};

export const generateDietPlan = async (userData: UserData): Promise<DietPlan> => {
  const prompt = `
    Create a personalized one-day diet plan based on the following user data:
    - Height: ${userData.height} cm
    - Weight: ${userData.weight} kg
    - Age: ${userData.age} years
    - Gender: ${userData.gender}
    - Activity Level: ${userData.activityLevel}
    - Goal: ${userData.goal} weight

    Provide a balanced diet plan with a breakfast, lunch, dinner, and one snack.
    For each meal, give a detailed description and estimate the nutritional information (calories, protein, carbs, fats).
    Also, provide the total daily calorie and macro goals.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dietPlanSchema,
      },
    });

    const jsonText = response.text.trim();
    const dietPlan = JSON.parse(jsonText);
    return dietPlan as DietPlan;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw new Error("Failed to generate diet plan. The AI model might be busy. Please try again.");
  }
};


export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<FoodAnalysis> => {
    const prompt = "Analyze the food in this image. Identify what it is and provide its estimated nutritional information: calories, protein, carbs, and fats. Also provide a brief description and a health score from 1 to 10 (1 being least healthy, 10 being most healthy).";

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: foodAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const analysis = JSON.parse(jsonText);
        return analysis as FoodAnalysis;

    } catch (error) {
        console.error("Error analyzing food image:", error);
        throw new Error("Failed to analyze the food image. The AI may not have recognized the food. Please try a clearer image.");
    }
};
