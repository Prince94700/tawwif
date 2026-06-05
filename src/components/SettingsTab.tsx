/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, 
  Bell, 
  User, 
  Volume2, 
  ShieldAlert, 
  ChevronRight, 
  LogOut,
  Moon,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { UserPreferences } from "../types";

interface SettingsTabProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export default function SettingsTab({
  preferences,
  onUpdatePreferences,
}: SettingsTabProps) {
  const [showSubscription, setShowSubscription] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  const handleCalorieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePreferences({ calorieGoal: parseInt(e.target.value) });
  };

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePreferences({ waterGoal: parseFloat(e.target.value) });
  };

  const handleTogglePush = () => {
    onUpdatePreferences({ pushNotifications: !preferences.pushNotifications });
  };

  const handleToggleReminder = () => {
    onUpdatePreferences({ journalReminders: !preferences.journalReminders });
  };

  const handleToggleNight = () => {
    onUpdatePreferences({ nightMode: !preferences.nightMode });
  };

  const handleLogOut = () => {
    const confirmLog = window.confirm("Are you sure you want to log out Julian? This will clear temporary health offsets.");
    if (confirmLog) {
      onUpdatePreferences({
        calorieGoal: 2450,
        waterGoal: 2.8,
        pushNotifications: true,
        journalReminders: true,
        nightMode: false
      });
      alert("Julian logged out. Default presets reinitialized.");
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pt-2 pb-10 relative">
      {/* Profile Header Block */}
      <section className="flex flex-col items-center mb-6 text-center">
        {/* Metal Bezel framing round avatar */}
        <div className="p-1 rounded-full bg-gradient-to-tr from-stone-900 via-stone-500 to-yellow-600/40 shadow-md mb-2.5">
          <div className="w-28 h-28 rounded-full overflow-hidden border-[4px] border-stone-900 shadow-inner bg-brand-surface-container">
            <img 
              alt="Julian Thorne profile photo" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATC2l9bHzCaOAAbXS8cxyde-PKhJgtcySR_18MDMs1zYPSPi1FC0Nhjfr4s3SR4twWcf21yzGHQUeLJQcVSymub6qFujpD96LG8hbRagtfXthrIJIPLT4Jvwk4WVfHWlPgZlpKdE1S95dxboguYcjKepxPr8NNRgbB5xQDqTYxLr8mUjFZH3IhuKJ9-9PLelU5E6Ria12OMlg2HO4NOpeD56nJfw4aNfp4KgJwkK4QyTqtGDt4uKcGGw1EjDEx3gtmn0M2StVXxA8" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // High-fidelity fallback illustration if Unsplash profile breaks
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
              }}
            />
          </div>
        </div>

        <h2 className="font-headline text-2xl font-bold text-white">
          {preferences.name}
        </h2>
        <p className="font-mono text-[10px] font-extrabold text-brand-primary uppercase tracking-[0.15em] mt-0.5">
          {preferences.tier}
        </p>
      </section>

      {/* 1. Daily Targets Card */}
      <div className="tactile-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-2">
          <Heart className="w-5 h-5 text-brand-primary fill-brand-primary/10" />
          <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wide">
            Daily Targets
          </h3>
        </div>

        {/* Calorie Goal Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <label className="font-mono text-[10px] font-bold text-stone-300 uppercase tracking-wider">
              CALORIE TARGET GOAL
            </label>
            <span className="font-headline text-md font-bold text-brand-primary">
              {preferences.calorieGoal.toLocaleString()}{" "}
              <span className="text-[10px] font-mono font-medium text-stone-400 lowercase">
                kcal
              </span>
            </span>
          </div>
          <div className="px-1.5 py-1">
            <input
              type="range"
              min="1500"
              max="4000"
              step="50"
              value={preferences.calorieGoal}
              onChange={handleCalorieChange}
              className="w-full h-2 bg-stone-900 border border-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
            />
            <div className="flex justify-between text-[8.5px] font-mono text-stone-400 mt-1.5">
              <span>1,500 kcal</span>
              <span>4,000 kcal</span>
            </div>
          </div>
        </div>

        {/* Water Goal Slider */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="font-mono text-[10px] font-bold text-stone-300 uppercase tracking-wider">
              WATER TARGET GOAL
            </label>
            <span className="font-headline text-md font-bold text-brand-primary">
              {preferences.waterGoal.toFixed(1)}{" "}
              <span className="text-[10px] font-mono font-medium text-stone-400 lowercase">
                liters
              </span>
            </span>
          </div>
          <div className="px-1.5 py-1">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={preferences.waterGoal}
              onChange={handleWaterChange}
              className="w-full h-2 bg-stone-900 border border-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
            />
            <div className="flex justify-between text-[8.5px] font-mono text-stone-400 mt-1.5">
              <span>1.0 Liter</span>
              <span>5.0 Liters</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Preferences checklist switches */}
      <div className="tactile-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <Bell className="w-5 h-5 text-brand-primary fill-brand-primary/10" />
          <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wide">
            Preferences & Alerts
          </h3>
        </div>

        <div className="space-y-3">
          {/* Push alert item */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-white/5 recessed-panel">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <span className="font-sans text-xs font-semibold text-white">
                Push Notifications
              </span>
            </div>
            
            <button 
              onClick={handleTogglePush}
              className="text-brand-primary hover:scale-105 active:scale-95 transition-transform"
            >
              {preferences.pushNotifications ? (
                <ToggleRight className="w-10 h-10 text-brand-primary stroke-[2.2]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-stone-500 stroke-[1.8]" />
              )}
            </button>
          </div>

          {/* Journal alarm item */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-white/5 recessed-panel">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-stone-400" />
              <span className="font-sans text-xs font-semibold text-white">
                Journal Reminders
              </span>
            </div>

            <button 
              onClick={handleToggleReminder}
              className="text-brand-primary hover:scale-105 active:scale-95 transition-transform"
            >
              {preferences.journalReminders ? (
                <ToggleRight className="w-10 h-10 text-brand-primary stroke-[2.2]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-stone-500 stroke-[1.8]" />
              )}
            </button>
          </div>

          {/* Night Mode shift toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-white/5 recessed-panel">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-stone-400" />
              <span className="font-sans text-xs font-semibold text-white">
                Night Mode (Dim Filter)
              </span>
            </div>

            <button 
              onClick={handleToggleNight}
              className="text-brand-primary hover:scale-105 active:scale-95 transition-transform"
            >
              {preferences.nightMode ? (
                <ToggleRight className="w-10 h-10 text-brand-primary stroke-[2.2]" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-stone-500 stroke-[1.8]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Support & Actions Card */}
      <div className="tactile-card rounded-2xl p-5">
        <h3 className="font-mono text-[9px] font-bold text-stone-450 tracking-wider uppercase mb-3">
          Member Accounts Status
        </h3>

        <div className="space-y-1">
          <button 
            onClick={() => setShowSubscription(!showSubscription)}
            className="w-full text-left p-3 flex items-center justify-between hover:bg-stone-900 transition-colors rounded-xl font-sans text-xs font-medium text-white group"
          >
            <span>Subscription & Billing Details</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {showSubscription && (
            <div className="p-3 bg-stone-950 rounded-xl text-[11px] font-mono text-brand-primary border border-white/5 animate-fade-in mb-2 leading-relaxed">
              Plan: ALL-ACCESS OPTICS ANNUAL PASS<br />
              Renewal: Oct 21, 2026<br />
              Payment: Visa ending in •••• 4820
            </div>
          )}

          <button 
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="w-full text-left p-3 flex items-center justify-between hover:bg-stone-900 transition-colors rounded-xl font-sans text-xs font-medium text-white group"
          >
            <span>Health Data Security Policy</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {showPrivacy && (
            <div className="p-3 bg-stone-950 rounded-xl text-[11px] font-body text-stone-400 border border-white/5 animate-fade-in mb-2 leading-relaxed">
              Your calorie scans and raw camera images are processed server-side using end-to-end encrypted tunnels. Zero raw photos are stored on permanent tracking servers.
            </div>
          )}

          <button
            onClick={handleLogOut}
            className="mt-4 w-full py-3.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 font-headline text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl border border-red-900/10 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Log Out Thorne
          </button>
        </div>
      </div>
    </div>
  );
}
