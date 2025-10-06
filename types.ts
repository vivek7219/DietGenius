
export enum Tab {
  DIET_PLANNER = 'DIET_PLANNER',
  FOOD_ANALYZER = 'FOOD_ANALYZER',
}

export interface UserData {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface Meal {
    mealType: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface DietPlan {
    dailyCalories: number;
    macros: {
        protein: number;
        carbs: number;
        fats: number;
    };
    mealPlan: Meal[];
}


export interface FoodAnalysis {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    description: string;
    healthScore: number;
}

export interface AnalysisHistoryItem {
    id: string;
    imagePreview: string;
    analysis: FoodAnalysis | null;
    error?: string;
}
