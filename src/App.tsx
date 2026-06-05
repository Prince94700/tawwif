/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  Camera, 
  BarChart3, 
  Settings, 
  Search, 
  Sparkles, 
  Check, 
  Flame, 
  Droplet, 
  Moon, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MealLog, WaterLog, UserPreferences } from "./types";

import DailyTab from "./components/DailyTab";
import JournalTab from "./components/JournalTab";
import ProgressTab from "./components/ProgressTab";
import SettingsTab from "./components/SettingsTab";

// Default seed data matching the screenshot graphics perfectly
const INITIAL_MEALS: MealLog[] = [
  {
    id: "meal-1",
    name: "Avocado Toast & Eggs",
    calories: 320,
    protein: 15,
    carbs: 34,
    fats: 22,
    score: "A-",
    scoreText: "WELL BALANCED",
    percentage: 88,
    timestamp: "08:30 AM",
    mealType: "Breakfast",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfxdzXXDSeAX2sF3mIvoWo7CHIWjTRfnuaLOyXrudngVceo3YQu0PSBJhln1JSpjZCvOwVEaH63bjPOlRjXOYMOhHZjTQUgHuSJ2t7VY2yC1PJZbDKTIx1jWKSGXQ3gxGdQfpX3GdK54la-H0RfEkBGvj2oImvbUB_hvu5S9LyI6lJbi732p5vcTrBo4EbRAkYd_APzMyh9hINwi60p0cpKvru1Kay4XpfMDtnqdWOUoHO2-ZaPCeqb42-fIvWHTEHwu524sXTCL0"
  },
  {
    id: "meal-2",
    name: "Quinoa Power Bowl",
    calories: 460,
    protein: 18,
    carbs: 52,
    fats: 12,
    score: "A",
    scoreText: "EXCELLENT",
    percentage: 95,
    timestamp: "12:45 PM",
    mealType: "Lunch",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZRmAvaKYtjBGmVSrqA2TpCarDq1ZFP39Bp_MVW8fQEBHd_ypzRaJ7og6tw2im3H2YpcxaWKQBBBEuuxNDNNRp1K1HbsnrFRIRA0VSlPtVga-vDpqt0IJlrgdmLfHGCUSsgjPUy3KcWPZo2q7Mlvyla1a--M2vX1zv9NOZuS1XQvPW1EV3ygXiddQlbNu3XdjqjGZvksZkzMBSt1Gz5oH0DyLLtExUAP5jn3NYTCm3UENc5373gu2oT7JecNZkxoX1CKpmXZyJmj8"
  }
];

const INITIAL_WATER: WaterLog[] = [
  { id: "w-1", amount: 500, timestamp: "09:15 AM" },
  { id: "w-2", amount: 500, timestamp: "11:30 AM" },
  { id: "w-3", amount: 200, timestamp: "02:00 PM" } // sum is 1,200ml = 1.2L exactly matching Screen 4!
];

const DEFAULT_PREFS: UserPreferences = {
  calorieGoal: 2450,
  waterGoal: 2.8,
  pushNotifications: true,
  journalReminders: true,
  nightMode: false,
  name: "Julian Thorne",
  tier: "Premium Member",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5n3zjmWnAnCQp5y13bniqdHFG_gMlvlVtNZfzC6Dy4L0-x9SjJHdi1oUCa0gsfwnCYyp_QfZuL2wdnH0cNnWWiMTdJcB6q4Jj1xjk2_2qc49cL4U3TldQknqztvihMfNFi81spBi-CeafdshKiTUgA01DzPPbk35L3d34Uh-gnVbQxvi7evM-WuEQp4poL7ru0dEE8kjJ7ZwTcjKI_NG27W-g2U60DCYtAetMeUC1bG9MQi0ypQjE9YTInfsWEVUdtXfUPdLkbqk"
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Daily");

  // State engines synced with LocalStorage for durable cloud-feel experience
  const [meals, setMeals] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem("vitaltouch_meals_today");
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem("vitaltouch_water_logs");
    return saved ? JSON.parse(saved) : INITIAL_WATER;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem("vitaltouch_preferences");
    return saved ? JSON.parse(saved) : DEFAULT_PREFS;
  });

  // Search logic states
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("Salad");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Sync back to local stage changes asynchronously
  useEffect(() => {
    localStorage.setItem("vitaltouch_meals_today", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("vitaltouch_water_logs", JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem("vitaltouch_preferences", JSON.stringify(preferences));
  }, [preferences]);

  // Core Mutation Operations
  const handleAddWater = (amount: number) => {
    const freshLog: WaterLog = {
      id: `w-${Date.now()}`,
      amount,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    };
    setWaterLogs((prev) => [...prev, freshLog]);
  };

  const handleRemoveWaterLog = (id: string) => {
    setWaterLogs((prev) => prev.filter((w) => w.id !== id));
  };

  const handleRemoveMealLog = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const handleLogMeal = (mealData: Omit<MealLog, "id" | "timestamp">) => {
    const loggedItem: MealLog = {
      ...mealData,
      id: `meal-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    };
    setMeals((prev) => [loggedItem, ...prev]);
  };

  // Search query filter action
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search existing preset index
    setLoadingSearch(true);
    setTimeout(() => {
      // Find food or return dynamic estimates
      const match = searchQuery.toLowerCase();
      const results = [
        {
          name: searchQuery,
          calories: 120 + (searchQuery.length * 28) % 450,
          protein: Math.max(4, (searchQuery.length * 3) % 25),
          carbs: Math.max(10, (searchQuery.length * 6) % 60),
          fats: Math.max(2, (searchQuery.length * 2) % 22)
        }
      ];
      setSearchResults(results);
      setLoadingSearch(false);
    }, 600);
  };
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  // Return the header image corresponding to the tab shown in the screenshot
  const getHeaderAvatar = () => {
    if (activeTab === "Settings") {
      // Julian Thorne's photo matching Screen 3 Settings exactly
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuB5n3zjmWnAnCQp5y13bniqdHFG_gMlvlVtNZfzC6Dy4L0-x9SjJHdi1oUCa0gsfwnCYyp_QfZuL2wdnH0cNnWWiMTdJcB6q4Jj1xjk2_2qc49cL4U3TldQknqztvihMfNFi81spBi-CeafdshKiTUgA01DzPPbk35L3d34Uh-gnVbQxvi7evM-WuEQp4poL7ru0dEE8kjJ7ZwTcjKI_NG27W-g2U60DCYtAetMeUC1bG9MQi0ypQjE9YTInfsWEVUdtXfUPdLkbqk";
    }
    // Serene Female health profile matching Screen 4 and Screen 1 daily targets precisely
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuC77cETuUZltaLBV3nK20EbZFTTmrWpKdHlJNqg0UBikEGLReQwx0hgdXMoS4Sizjoflfdlq7BplIziAND61jxARyYZq69zmlFvJQWHhYR7wH36HNw7HU-ty0_Ti38rW5Zn5nZvzHbFFKj85B6geS7d3ZSyIBChxKvMLW3BFcdr6K6--agPcKM352j-NYz0ORu5WslbHQdk2y-tb3gcGiCAnulZt9LvaXFTpmSLgJ1AIJMlkrnUGoaAAYx7JbpM1EI2znRpINntPdo";
  };

  return (
    <div className={`min-h-screen text-brand-on-surface font-sans selection:bg-brand-secondary-container transition-colors relative duration-300 ${preferences.nightMode ? "fine-grain brightness-[0.88] sepia-[0.10]" : "fine-grain bg-brand-surface"}`}>
      {/* Top Header App Bar */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 flex items-center justify-between px-6 h-16 bg-brand-surface border-b border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          {/* Beveled Profile Picture container */}
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-stone-800 to-yellow-600/40 shadow-sm">
            <div className="w-9 h-9 rounded-full border border-stone-900 overflow-hidden bg-brand-surface-container">
              <img 
                alt="Profile photo" 
                src={getHeaderAvatar()} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
          </div>
          <h1 className="font-headline text-[19px] font-bold text-brand-primary tracking-tight">
            Vital Touch
          </h1>
        </div>

        {/* Search optic action */}
        <button 
          onClick={() => setSearchOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-surface-high/40 transition-colors active:scale-90"
        >
          <Search className="w-5 h-5 text-brand-primary" />
        </button>
      </header>

      {/* Main Tab Screen Panel Area with Transitions */}
      <main className="pt-20 pb-28 px-6 max-w-lg mx-auto relative min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {activeTab === "Daily" && (
              <DailyTab
                meals={meals}
                waterLogs={waterLogs}
                preferences={preferences}
                onAddWater={handleAddWater}
                onRemoveWaterLog={handleRemoveWaterLog}
                onRemoveMealLog={handleRemoveMealLog}
                onSetActiveTab={setActiveTab}
              />
            )}

            {activeTab === "Journal" && (
              <JournalTab
                onLogMeal={handleLogMeal}
                meals={meals}
                waterLogs={waterLogs}
                preferences={preferences}
                onSetActiveTab={setActiveTab}
              />
            )}

            {activeTab === "Progress" && (
              <ProgressTab
                meals={meals}
                waterLogs={waterLogs}
              />
            )}

            {activeTab === "Settings" && (
              <SettingsTab
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-brand-surface border-t border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.8)] rounded-t-2xl">
        
        {/* Daily Tab */}
        <button
          onClick={() => setActiveTab("Daily")}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className={`flex flex-col items-center justify-center py-1.5 transition-all outline-none ${
            activeTab === "Daily"
              ? "text-brand-primary font-bold active:scale-90"
              : "text-brand-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <div className={`p-1.5 px-3.5 rounded-2xl transition-all ${activeTab === "Daily" ? "bg-stone-900/80 text-brand-primary shadow-inner" : ""}`}>
            <LayoutGrid className="w-5 h-5 mx-auto" />
            <span className="font-mono text-[9px] block uppercase mt-0.5 tracking-wider">
              Daily
            </span>
          </div>
        </button>

        {/* Journal Tab */}
        <button
          onClick={() => setActiveTab("Journal")}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className={`flex flex-col items-center justify-center py-1.5 transition-all outline-none ${
            activeTab === "Journal"
              ? "text-brand-primary font-bold active:scale-90"
              : "text-brand-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <div className={`p-1.5 px-3.5 rounded-2xl transition-all ${activeTab === "Journal" ? "bg-stone-900/80 text-brand-primary shadow-inner" : ""}`}>
            <Camera className="w-5 h-5 mx-auto" />
            <span className="font-mono text-[9px] block uppercase mt-0.5 tracking-wider">
              Journal
            </span>
          </div>
        </button>

        {/* Progress Tab */}
        <button
          onClick={() => setActiveTab("Progress")}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className={`flex flex-col items-center justify-center py-1.5 transition-all outline-none ${
            activeTab === "Progress"
              ? "text-brand-primary font-bold active:scale-90"
              : "text-brand-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <div className={`p-1.5 px-3.5 rounded-2xl transition-all ${activeTab === "Progress" ? "bg-stone-900/80 text-brand-primary shadow-inner" : ""}`}>
            <BarChart3 className="w-5 h-5 mx-auto" />
            <span className="font-mono text-[9px] block uppercase mt-0.5 tracking-wider">
              Progress
            </span>
          </div>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => setActiveTab("Settings")}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className={`flex flex-col items-center justify-center py-1.5 transition-all outline-none ${
            activeTab === "Settings"
              ? "text-brand-primary font-bold active:scale-90"
              : "text-brand-on-surface-variant opacity-60 hover:opacity-100"
          }`}
        >
          <div className={`p-1.5 px-3.5 rounded-2xl transition-all ${activeTab === "Settings" ? "bg-stone-900/80 text-brand-primary shadow-inner" : ""}`}>
            <Settings className="w-5 h-5 mx-auto" />
            <span className="font-mono text-[9px] block uppercase mt-0.5 tracking-wider">
              Settings
            </span>
          </div>
        </button>
      </nav>

      {/* Modern Dialog overlays for search */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-6">
          <div className="bg-[#0e0d0c] rounded-3xl p-5 border border-white/10 w-full max-w-sm shadow-2xl animate-bounce-in text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline text-lg font-bold text-brand-primary">
                Food Index Lookup
              </h3>
              <button 
                onClick={() => {
                  setSearchOpen(false);
                  setSearchResults([]);
                }}
                className="p-1 rounded-full bg-stone-900 text-stone-400 hover:text-brand-error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Insert food name, e.g. Pasta..."
                  className="w-full px-3 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-stone-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingSearch}
                className="w-full py-2 bg-gradient-to-b from-[#ca8a04] to-[#a16207] text-white font-mono text-xs font-bold rounded-xl shadow-md cursor-pointer hover:brightness-110 active:translate-y-[1px]"
              >
                {loadingSearch ? "LOOKING UP INDEX..." : "SEARCH INGREDIENTS"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2">
                <h4 className="font-mono text-[9px] tracking-wider text-stone-400 uppercase">
                  Calculated Search Estimates
                </h4>
                {searchResults.map((res, i) => (
                  <div key={i} className="p-3 bg-stone-900 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{res.name}</span>
                      <span className="font-mono text-[9.5px] text-stone-400">
                        P: {res.protein}g • C: {res.carbs}g • F: {res.fats}g
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogMeal({
                          name: res.name,
                          calories: res.calories,
                          protein: res.protein,
                          carbs: res.carbs,
                          fats: res.fats,
                          score: "B+",
                          scoreText: "SATISFACTORY",
                          percentage: 75,
                          mealType: "Lunch",
                          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"
                        });
                        setSearchOpen(false);
                        setSearchResults([]);
                        alert(`Logged searched recipe: ${res.name}`);
                      }}
                      className="px-2.5 py-1.5 bg-brand-primary text-black font-mono font-bold text-[10px] rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors"
                    >
                      + LOG {res.calories}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
