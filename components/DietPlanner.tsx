
import React, { useState } from 'react';
import type { UserData, DietPlan } from '../types';
import { generateDietPlan } from '../services/geminiService';
import Loader from './Loader';

const DietPlanner: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    height: '175',
    weight: '70',
    age: '30',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      const plan = await generateDietPlan(userData);
      setDietPlan(plan);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const MacroCard: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className={`flex-1 p-4 rounded-lg text-center ${color}`}>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-2xl font-bold text-white">{value}{unit}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Personal Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input type="number" name="height" id="height" value={userData.height} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={userData.weight} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" name="age" id="age" value={userData.age} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" id="gender" value={userData.gender} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select name="activityLevel" id="activityLevel" value={userData.activityLevel} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Your Goal</label>
            <select name="goal" id="goal" value={userData.goal} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition duration-300 disabled:bg-primary-300 flex items-center justify-center">
            {isLoading ? <Loader /> : 'Generate My Diet Plan'}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your AI-Generated Plan</h2>
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader />
                <p className="mt-4 text-gray-600">Generating your personalized plan... <br/>This might take a moment.</p>
            </div>
        )}
        {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
        {dietPlan && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-primary-500 rounded-lg text-center text-white">
              <p className="font-medium">Daily Calorie Goal</p>
              <p className="text-4xl font-bold">{dietPlan.dailyCalories} kcal</p>
            </div>
             <div className="flex gap-2">
                <MacroCard label="Protein" value={dietPlan.macros.protein} unit="g" color="bg-sky-500"/>
                <MacroCard label="Carbs" value={dietPlan.macros.carbs} unit="g" color="bg-amber-500"/>
                <MacroCard label="Fats" value={dietPlan.macros.fats} unit="g" color="bg-rose-500"/>
            </div>
            <div className="space-y-4">
              {dietPlan.mealPlan.map(meal => (
                <div key={meal.mealType} className="border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-bold text-primary text-lg">{meal.mealType}</h3>
                  <p className="text-gray-600 mt-1">{meal.description}</p>
                   <div className="text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1 text-gray-500">
                        <span><strong>Cals:</strong> {meal.calories}</span>
                        <span><strong>P:</strong> {meal.protein}g</span>
                        <span><strong>C:</strong> {meal.carbs}g</span>
                        <span><strong>F:</strong> {meal.fats}g</span>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoading && !dietPlan && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="mt-4 text-gray-600">Your personalized diet plan will appear here once you fill out your details.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanner;
