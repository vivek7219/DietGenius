
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import type { FoodAnalysis, AnalysisHistoryItem } from '../types';
import Loader from './Loader';
import UploadIcon from './icons/UploadIcon';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';

const FoodAnalyzer: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const newId = Date.now().toString();
    const imagePreview = URL.createObjectURL(file);

    const userEntry: AnalysisHistoryItem = { id: newId, imagePreview, analysis: null };
    setHistory(prev => [userEntry, ...prev]);

    try {
      const base64Image = await fileToBase64(file);
      const analysisResult = await analyzeFoodImage(base64Image, file.type);
      setHistory(prev => prev.map(item => item.id === newId ? { ...item, analysis: analysisResult } : item));
    } catch (err: any) {
      setHistory(prev => prev.map(item => item.id === newId ? { ...item, error: err.message || 'Analysis failed.' } : item));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const AnalysisCard: React.FC<{ analysis: FoodAnalysis }> = ({ analysis }) => {
    const healthColor = analysis.healthScore > 7 ? 'text-green-500' : analysis.healthScore > 4 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="bg-white rounded-lg p-4 w-full">
            <h3 className="font-bold text-lg text-primary">{analysis.foodName}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">{analysis.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="font-semibold">Calories: <span className="font-normal">{analysis.calories} kcal</span></div>
                <div className="font-semibold">Protein: <span className="font-normal">{analysis.protein}g</span></div>
                <div className="font-semibold">Carbs: <span className="font-normal">{analysis.carbs}g</span></div>
                <div className="font-semibold">Fats: <span className="font-normal">{analysis.fats}g</span></div>
            </div>
            <div className={`mt-3 font-bold text-base ${healthColor}`}>
                Health Score: {analysis.healthScore} / 10
            </div>
        </div>
    );
  };
  
  const HistoryItem: React.FC<{ item: AnalysisHistoryItem }> = ({ item }) => (
    <>
      {/* User's turn */}
      <div className="flex justify-end items-start gap-3">
        <div className="bg-primary text-white p-3 rounded-l-xl rounded-br-xl max-w-xs md:max-w-md">
            <img src={item.imagePreview} alt="Uploaded food" className="rounded-lg max-h-60" />
        </div>
         <UserIcon />
      </div>

      {/* Bot's turn */}
      <div className="flex items-start gap-3">
        <BotIcon />
        <div className="bg-gray-200 p-3 rounded-r-xl rounded-bl-xl max-w-xs md:max-w-md">
            {item.analysis && <AnalysisCard analysis={item.analysis} />}
            {item.error && <p className="text-red-600">{item.error}</p>}
            {!item.analysis && !item.error && <Loader />}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <UploadIcon className="w-16 h-16 text-gray-300" />
              <p className="mt-4">Upload a photo of your meal to begin.</p>
              <p className="text-sm">The AI will analyze it for you!</p>
            </div>
          ) : (
             <div className="flex flex-col-reverse gap-6">
                {history.map(item => <HistoryItem key={item.id} item={item} />)}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition duration-300 disabled:bg-primary-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader /> <span>Analyzing...</span>
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5" />
                <span>Upload Food Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;
