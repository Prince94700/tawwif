/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Flame, 
  Droplet, 
  Utensils, 
  Plus, 
  Trash2, 
  Coffee,
  Sparkles
} from "lucide-react";
import { MealLog, UserPreferences, WaterLog } from "../types";

interface DailyTabProps {
  meals: MealLog[];
  waterLogs: WaterLog[];
  preferences: UserPreferences;
  onAddWater: (amount: number) => void;
  onRemoveWaterLog: (id: string) => void;
  onRemoveMealLog: (id: string) => void;
  onSetActiveTab: (tab: string) => void;
}

export default function DailyTab({
  meals,
  waterLogs,
  preferences,
  onAddWater,
  onRemoveWaterLog,
  onRemoveMealLog,
  onSetActiveTab,
}: DailyTabProps) {
  const [exerciseBurned, setExerciseBurned] = useState<number>(245);
  const [customExerciseVal, setCustomExerciseVal] = useState<string>("");
  const [showExerciseEditor, setShowExerciseEditor] = useState<boolean>(false);

  // Totals calculations
  const totalEaten = meals.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = Math.max(0, preferences.calorieGoal - totalEaten + exerciseBurned);
  const caloriePercentage = Math.min(100, (totalEaten / preferences.calorieGoal) * 100);

  const totalWaterMl = waterLogs.reduce((sum, w) => sum + w.amount, 0);
  const totalWaterLiters = totalWaterMl / 1000;
  const waterPercentage = Math.min(100, (totalWaterLiters / preferences.waterGoal) * 100);

  // SVG parameters for circular dial
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercentage / 100) * circumference;

  const handleUpdateBurned = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customExerciseVal);
    if (!isNaN(val) && val >= 0) {
      setExerciseBurned(val);
      setCustomExerciseVal("");
      setShowExerciseEditor(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pt-2 pb-10">
      {/* 1. Large Central Dial Indicator */}
      <section className="relative py-4 flex flex-col items-center">
        <div className="relative w-72 h-72 rounded-full bg-stone-950 shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_2px_2px_4px_rgba(255,255,255,0.02)] flex items-center justify-center border border-white/10">
          {/* Circular Progress Gauge */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background Track */}
            <circle
              className="text-stone-900 opacity-80"
              cx="144"
              cy="144"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="11"
            />
            {/* Filled Gradient */}
            <circle
              className="text-brand-primary transition-all duration-700 ease-out"
              cx="144"
              cy="144"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Glass Dial */}
          <div className="w-56 h-56 rounded-full bg-stone-900/60 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center text-center p-6 relative z-10">
            <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-stone-400 uppercase">
              REMAINING
            </span>
            <span className="font-headline text-[44px] font-bold text-brand-primary leading-none my-1 tracking-tight">
              {remainingCalories.toLocaleString()}
            </span>
            <span className="font-sans text-xs font-medium text-stone-400 flex items-center gap-1">
              kcal
            </span>

            {/* Split Metrics Indicator */}
            <div className="mt-4 w-full flex items-center justify-center gap-4 text-center border-t border-white/10 pt-3">
              <div>
                <p className="font-mono text-[9px] font-bold tracking-wider text-stone-400 uppercase">
                  EATEN
                </p>
                <p className="font-headline text-base font-bold text-white">
                  {totalEaten}
                </p>
              </div>

              <div className="w-[1px] h-6 bg-white/10 self-center"></div>

              <div className="relative group">
                <p className="font-mono text-[9px] font-bold tracking-wider text-stone-400 uppercase">
                  BURNED
                </p>
                <button
                  onClick={() => setShowExerciseEditor(!showExerciseEditor)}
                  className="font-headline text-base font-bold text-white hover:text-brand-primary hover:underline flex items-center gap-0.5 justify-center"
                  title="Click to edit raw exercise burn"
                >
                  {exerciseBurned}
                  <span className="text-[10px] text-stone-400 font-normal">✎</span>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative analog needle accent centered */}
          <div 
            className="absolute w-1 h-24 bg-brand-primary/10 rounded-full origin-bottom -translate-y-12 transition-transform duration-500 pointer-events-none"
            style={{ transform: `rotate(${(caloriePercentage * 2.7) - 135}deg)` }}
          />
        </div>

        {/* Floating Active Edit form */}
        {showExerciseEditor && (
          <form 
            onSubmit={handleUpdateBurned}
            className="mt-4 bg-[#121211] p-3 rounded-xl border border-white/10 shadow-lg flex items-center gap-2 z-20 animate-fade-in"
          >
            <Flame className="w-4 h-4 text-brand-tertiary" />
            <input
              type="number"
              placeholder="Burn calories (kcal)"
              value={customExerciseVal}
              onChange={(e) => setCustomExerciseVal(e.target.value)}
              className="w-32 px-2 py-1 text-xs border border-white/10 rounded-md bg-stone-950 text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-[11px] bg-brand-primary text-black rounded-md font-mono font-bold"
            >
              SAVE
            </button>
          </form>
        )}
      </section>

      {/* 2. Water Intake Section */}
      <section className="tactile-card rounded-3xl p-5 shadow-2xl border border-white/10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-headline text-lg font-bold text-white">
              Water Intake
            </h2>
            <p className="text-stone-400 font-body text-sm font-medium mt-0.5">
              {totalWaterLiters.toFixed(1)}L of {preferences.waterGoal.toFixed(1)}L target
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center border border-white/5">
            <Droplet className="text-brand-primary w-5 h-5 fill-brand-primary/35" />
          </div>
        </div>

        <div className="flex gap-5 items-center h-44">
          {/* Vertical Cylinder Water Tank */}
          <div className="relative w-14 h-full bg-stone-950 rounded-full border border-white/10 shadow-inner overflow-hidden flex flex-col justify-end">
            <div 
              className="w-full bg-gradient-to-t from-brand-primary to-yellow-700/60 relative transition-all duration-700 ease-out"
              style={{ height: `${waterPercentage}%` }}
            >
              {/* Glass Reflection glare */}
              <div className="absolute top-0 left-0 w-full h-2.5 bg-white/20 blur-[1px]"></div>
              {/* Bubble particles */}
              <div className="absolute inset-x-0 bottom-4 flex justify-around opacity-40 animate-pulse pointer-events-none">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full delay-300"></span>
                <span className="w-1 h-1 bg-white rounded-full delay-100"></span>
              </div>
            </div>
          </div>

          {/* Hydration Add Actions */}
          <div className="flex-1 space-y-3">
            <button
              onClick={() => onAddWater(250)}
              className="w-full py-2.5 bg-stone-900 border border-white/10 hover:border-white/20 shadow-md text-white rounded-xl flex items-center justify-between px-4 cursor-pointer group transition-all"
            >
              <span className="font-mono text-xs font-bold text-white">+ 250ml</span>
              <div className="w-7 h-7 rounded-lg bg-stone-950 border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
                <Plus className="w-4 h-4 text-brand-primary" />
              </div>
            </button>

            <button
              onClick={() => onAddWater(500)}
              className="w-full py-2.5 bg-stone-900 border border-white/10 hover:border-white/20 shadow-md text-white rounded-xl flex items-center justify-between px-4 cursor-pointer group transition-all"
            >
              <span className="font-mono text-xs font-bold text-white">+ 500ml</span>
              <div className="w-7 h-7 rounded-lg bg-stone-950 border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
                <Plus className="w-4 h-4 text-brand-primary" />
              </div>
            </button>
          </div>
        </div>

        {/* Tiny logged water pills to clear if needed */}
        {waterLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="font-mono text-[9px] font-bold tracking-wider text-stone-400 uppercase block mb-2">
              Hydration logs (Click ✕ to remove)
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1 no-scrollbar">
              {waterLogs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => onRemoveWaterLog(log.id)}
                  className="px-2 py-0.5 rounded-full bg-stone-900 hover:bg-red-950 text-brand-primary hover:text-red-400 text-[10px] font-mono flex items-center gap-1 border border-white/5 transition-colors"
                >
                  <span>{log.amount}ml</span>
                  <span className="text-[9px] opacity-60">✕</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Meals Today Section */}
      <section className="tactile-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        {/* Faint watermark illustration */}
        <div className="absolute top-4 right-4 opacity-5 pointer-events-none text-stone-400">
          <Utensils className="w-10 h-10" />
        </div>

        <h2 className="font-headline text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
          Meals Today
        </h2>

        {meals.length === 0 ? (
          <div className="text-center py-6">
            <Coffee className="w-8 h-8 text-stone-500 mx-auto mb-2" />
            <p className="text-stone-400 text-sm font-body italic">
              No nutrition logged today yet.
            </p>
            <button
              onClick={() => onSetActiveTab("Journal")}
              className="mt-3.5 inline-flex items-center gap-1 text-xs font-mono font-bold bg-brand-primary text-black px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              <Sparkles className="w-3 h-3" /> Log with AI Optics Lens
            </button>
          </div>
        ) : (
          <ul className="space-y-3.5 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {meals.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-3.5 group border-b border-white/5 pb-3 last:border-b-0 last:pb-0 relative"
              >
                {/* Food Profile Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-white/10">
                  <img
                    alt={log.name}
                    src={log.imageUrl}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";
                    }}
                  />
                </div>

                {/* Name and Meta */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-sm font-semibold leading-tight text-white truncate">
                    {log.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-md bg-stone-900 border border-white/5 font-medium text-stone-300 uppercase">
                      {log.mealType}
                    </span>
                    <span className="font-mono text-[9px] text-stone-400">
                      • {log.timestamp}
                    </span>
                  </div>
                </div>

                {/* Right Calories and Trash action */}
                <div className="text-right flex items-center gap-2.5">
                  <div>
                    <span className="font-headline text-sm font-bold text-brand-primary block">
                      {log.calories}
                    </span>
                    <span className="font-mono text-[9px] text-stone-400 block">
                      kcal
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveMealLog(log.id)}
                    className="p-1.5 text-stone-400 hover:text-brand-error hover:bg-stone-900 rounded-md transition-all active:scale-90"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
