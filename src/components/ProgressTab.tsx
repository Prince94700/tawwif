/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  TrendingDown, 
  Lightbulb, 
  Share2, 
  Sparkles, 
  Flame, 
  Droplet,
  Info 
} from "lucide-react";
import { MealLog, WaterLog } from "../types";

interface ProgressTabProps {
  meals: MealLog[];
  waterLogs: WaterLog[];
}

export default function ProgressTab({ meals, waterLogs }: ProgressTabProps) {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Hardcoded historical analytics representing Screen 1's mock exactly
  const weeklyCalorieData = [
    { day: "MON", value: 75, kcal: 2240, status: "ideal" },
    { day: "TUE", value: 60, kcal: 1890, status: "ideal" },
    { day: "WED", value: 85, kcal: 2420, status: "ideal" },
    { day: "THU", value: 45, kcal: 1540, status: "light" }, // Olive container
    { day: "FRI", value: 90, kcal: 2560, status: "ideal" },
    { day: "SAT", value: 95, kcal: 2980, status: "cheat" }, // Danger Red / overload
    { day: "SUN", value: 70, kcal: 2110, status: "ideal" }
  ];

  const weeklyWaterData = [
    { day: "M", value: 80, liters: "2.4L", status: "ideal" },
    { day: "T", value: 95, liters: "2.9L", status: "ideal" },
    { day: "W", value: 70, liters: "2.1L", status: "ideal" },
    { day: "T", value: 40, liters: "1.2L", status: "light" }, // Sky container
    { day: "F", value: 100, liters: "3.0L", status: "ideal" },
    { day: "S", value: 85, liters: "2.6L", status: "ideal" },
    { day: "S", value: 60, liters: "1.8L", status: "ideal" }
  ];

  const handleCreateReport = () => {
    setShowShareModal(true);
    setTimeout(() => {
      setShowShareModal(false);
      alert("Weekly Touch Report PDF compiled successfully! Saved to offline downloads.");
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pt-2 pb-10">
      {/* 1. Weekly Summary Card */}
      <section className="tactile-card rounded-2xl p-5 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl" />

        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="font-headline text-lg font-bold text-brand-primary mb-0.5">
              Weekly Summary
            </h2>
            <p className="font-mono text-stone-400 text-[11px] uppercase tracking-widest">
              Oct 21 - Oct 27
            </p>
          </div>
          
          {/* On Track Pill Badge */}
          <div className="bg-[#ca8a04]/10 text-brand-primary text-[10px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-inner border border-yellow-600/20">
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ON TRACK</span>
          </div>
        </div>

        {/* Highlights split bento panels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="recessed-panel rounded-xl p-4 text-center border border-white/5">
            <span className="font-mono text-[9px] font-bold text-stone-400 block tracking-wider mb-1 uppercase">
              WEIGHT LOST
            </span>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="font-headline text-[32px] font-bold text-brand-primary">
                2.4
              </span>
              <span className="font-headline text-sm font-semibold text-brand-primary opacity-60">
                lbs
              </span>
            </div>
          </div>

          <div className="recessed-panel rounded-xl p-4 text-center border border-white/5">
            <span className="font-mono text-[9px] font-bold text-stone-400 block tracking-wider mb-1 uppercase">
              GOAL PROGRESS
            </span>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="font-headline text-[32px] font-bold text-white">
                68
              </span>
              <span className="font-headline text-sm font-semibold text-stone-300 opacity-60">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Calorie Intake Chart */}
      <section className="tactile-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="text-brand-primary w-5 h-5 fill-brand-primary/25" />
            <h3 className="font-headline text-base font-bold text-white">
              Calorie Intake
            </h3>
          </div>
          <span className="font-mono text-[10px] font-bold text-stone-300 bg-stone-900 px-2 py-1 rounded-md">
            AVG: 2,140 kcal
          </span>
        </div>

        {/* Visual Bar Chart Recessed Box */}
        <div className="recessed-panel rounded-xl p-5 h-48 flex items-end justify-between gap-1.5 relative border border-white/5">
          
          {/* Faint Grid Lines */}
          <div className="absolute inset-x-5 inset-y-5 flex flex-col justify-between opacity-5 pointer-events-none">
            <div className="border-t border-white w-full"></div>
            <div className="border-t border-white w-full"></div>
            <div className="border-t border-white w-full"></div>
          </div>

          {/* Graphical Bars */}
          {weeklyCalorieData.map((bar, idx) => {
            // Apply different shades depending on the status of the day
            let barBg = "bg-brand-primary";
            if (bar.status === "light") barBg = "bg-yellow-600/30"; // softer gold translucent
            if (bar.status === "cheat") barBg = "bg-brand-error/60"; // reddish warning

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group relative">
                
                {/* Popover on Hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-stone-950 text-white border border-white/10 px-1.5 py-1 rounded text-[9px] font-mono z-10 shadow-md pointer-events-none uppercase">
                  {bar.kcal} kcal
                </div>

                {/* Tactical Vertical fill capsule */}
                <div className="w-full h-28 flex flex-col justify-end">
                  <div 
                    className={`w-full max-w-[20px] mx-auto rounded-t-md relative overflow-hidden transition-all duration-1000 ease-out shadow-[0_-1px_1px_rgba(255,255,255,0.05)] ${barBg}`}
                    style={{ height: `${bar.value}%` }}
                  >
                    {/* Bevel highlights highlight edge */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
                  </div>
                </div>

                <span className="font-mono text-[9px] text-stone-400 font-bold tracking-tight">
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Water Intake Weekly Chart */}
      <section className="tactile-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Droplet className="text-brand-primary w-5 h-5 fill-brand-primary/25" />
            <h3 className="font-headline text-base font-bold text-white">
              Water Intake
            </h3>
          </div>
          <span className="font-mono text-[10px] font-bold text-stone-350 bg-stone-900 border border-white/5 px-2 py-1 rounded-md">
            GOAL: 3.0L
          </span>
        </div>

        {/* Visual Bar Chart Recessed Box */}
        <div className="recessed-panel rounded-xl p-5 h-48 flex items-end justify-between gap-1.5 relative border border-white/5">
          
          {/* Graphical Bars */}
          {weeklyWaterData.map((bar, idx) => {
            let barBg = "bg-brand-primary"; 
            if (bar.status === "light") barBg = "bg-yellow-600/30"; 

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 group relative">
                
                {/* Popover tooltip */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-stone-950 text-white border border-white/10 px-1.5 py-1 rounded text-[9px] font-mono z-10 shadow-md pointer-events-none">
                  {bar.liters}
                </div>

                {/* Capsule fill */}
                <div className="w-full h-28 flex flex-col justify-end">
                  <div 
                    className={`w-full max-w-[20px] mx-auto rounded-t-md relative overflow-hidden transition-all duration-1000 ease-out shadow-[0_-1px_1px_rgba(255,255,255,0.05)] ${barBg}`}
                    style={{ height: `${bar.value}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
                  </div>
                </div>

                <span className="font-mono text-[9px] text-stone-400 font-bold tracking-tight">
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Additional Insight (Asymmetric Card in terracotta peach coloring) */}
      <section className="flex flex-col gap-4">
        <div className="tactile-card bg-stone-950/65 text-stone-300 rounded-2xl p-5 border border-yellow-600/10">
          <div className="flex items-center gap-1.5 text-brand-primary mb-2.5">
            <Lightbulb className="w-5 h-5 fill-none text-brand-primary" />
            <span className="font-mono text-[9.5px] font-extrabold tracking-widest uppercase">
              TOUCH INSIGHT
            </span>
          </div>
          <p className="font-headline text-[17px] font-bold leading-snug text-white">
            Hydration significantly improved recovery times this week.
          </p>
          <p className="font-body text-xs text-stone-400 mt-1.5 leading-relaxed font-semibold">
            By hitting 95% of your water target on Tuesdays and Fridays, muscle oxygenation rates increased by 4.2% based on calorie burn times.
          </p>
        </div>

        {/* 5. Center interactive Report Share tactile button */}
        <button
          onClick={handleCreateReport}
          disabled={showShareModal}
          className="tactile-card w-full py-5 bg-stone-900 border border-white/5 hover:bg-[#1a1a19] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98 relative overflow-hidden"
        >
          {showShareModal ? (
            <>
              <Sparkles className="w-6 h-6 text-brand-primary animate-spin" />
              <span className="font-mono text-[10px] text-stone-400 font-semibold tracking-wider">
                COMPILING DOT-MATRIX SUMMARY...
              </span>
            </>
          ) : (
            <>
              <Share2 className="w-7 h-7 text-brand-primary" />
              <span className="font-mono text-[11px] font-extrabold tracking-wider text-white">
                COMPILE TOUCH REPORT
              </span>
            </>
          )}
        </button>
      </section>
    </div>
  );
}
