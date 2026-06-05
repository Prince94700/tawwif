/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  Check, 
  Trash2,
  ListFilter,
  Eye,
  Loader2
} from "lucide-react";
import { MealLog, UserPreferences, WaterLog } from "../types";

interface JournalTabProps {
  onLogMeal: (meal: Omit<MealLog, "id" | "timestamp">) => void;
  meals: MealLog[];
  waterLogs: WaterLog[];
  preferences: UserPreferences;
  onSetActiveTab: (tab: string) => void;
}

// Preset assets with beautiful high resolution health meals matching the mock screenshots
const PRESET_FOODS = [
  {
    name: "Green Power Bowl",
    mealType: "Breakfast" as const,
    calories: 385,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDElNp0z0Sn9nY2cHGQXopFtK-AQFqIl5USl57ttHP-YLP_4TWN_AfvYIytJNOLr2EvYv2PFOq-C1pH9yBqDBsk5DdAmO-_3ZLPCdr4hk2fnib25uZVbfhNUoJSjx9pMFqGwHJAXcOU_i11rfWfwmJwcJ02J3xjCzbCxftFtc4i8DHzb54wjSlNKs-YV528KXDX7dQN8mRLcrTJahbxQNLGLWJJiZ1lYBDvcIiBx3tkF22wO_Mo2nGolvhiR7845I9acudUptfXFKs"
  },
  {
    name: "Atlantic Salmon",
    mealType: "Dinner" as const,
    calories: 520,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASKYzyPSDB_X5wfpD1PgaJBaWWtvFNkgxWCNhhMDI14GOh4XqXoWjyQq5RVAxZy_65iG2oQHhmbQM06B97U-lcUaqTNcJhnjc6EBCcCj8A_Hv-k_64PV9lv1OjA5nRVE9E3zO7_pF3QEaBNj387RbhM5xeE4ysCtfvMoCZ2HNHb7m-kEmrqqep8e_BdLELFYlTIDpMymqFL27CCNnAfOctLfCVZ7gfe8FhlOK2ETZ1uHBPjGXT3Demxt30nBjvGgnPWp85VKueKHw"
  },
  {
    name: "Berry Crunch",
    mealType: "Snack" as const,
    calories: 210,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLCGhPQfHz5OVSyIABWNwW_VIjMbQ5TwFsC8oPcgRcRf7L7U3-fV1rJHHPap8qIxmi9HHys4R_ep5qGh_is6mdg88OUX5_ojkflVi6ZkJXGvurrkiGgfLl5c2hnaMIFUqX2i7Q1xrTnCG0zJ3fu-Ic-DCfGaKsqV6tR-lOsDrAxg4YdnhhopW6TSmR-effU55CEAJDd4a2X53l050LkSJNX-7PlcxmAiZBeK0WbpmkIANhDW572yhBnQaznZ7ibvL0xua9qSG_Ktw"
  },
  {
    name: "Avocado Toast & Eggs",
    mealType: "Breakfast" as const,
    calories: 420,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfxdzXXDSeAX2sF3mIvoWo7CHIWjTRfnuaLOyXrudngVceo3YQu0PSBJhln1JSpjZCvOwVEaH63bjPOlRjXOYMOhHZjTQUgHuSJ2t7VY2yC1PJZbDKTIx1jWKSGXQ3gxGdQfpX3GdK54la-H0RfEkBGvj2oImvbUB_hvu5S9LyI6lJbi732p5vcTrBo4EbRAkYd_APzMyh9hINwi60p0cpKvru1Kay4XpfMDtnqdWOUoHO2-ZaPCeqb42-fIvWHTEHwu524sXTCL0"
  }
];

export default function JournalTab({
  onLogMeal,
  meals,
  waterLogs,
  preferences,
  onSetActiveTab,
}: JournalTabProps) {
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_FOODS[0] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    score: string;
    scoreText: string;
    percentage: number;
    notice?: string;
  } | null>(null);

  const [activeTabSub, setActiveTabSub] = useState<"Scan" | "AllLogs">("Scan");

  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageMime, setCustomImageMime] = useState<string>("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Totals
  const totalCaloriesToday = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalWaterMl = waterLogs.reduce((sum, w) => sum + w.amount, 0);
  const totalWaterGlasses = Math.min(8, Math.round(totalWaterMl / 250)); // average glass size is 250ml

  // Trigger base64 scanning engine via full-stack /api/scan-food endpoint
  const handleScanFood = async (presetItem?: typeof PRESET_FOODS[0], isCustomUpload = false) => {
    setLoading(true);
    setScanResult(null);

    // If presetItem is provided, use its name and details
    const labelToScan = presetItem ? presetItem.name : "Healthy Dinner";
    const bodyPayload: any = {
      presetName: labelToScan
    };

    if (isCustomUpload && customImage) {
      bodyPayload.base64Image = customImage;
      bodyPayload.mimeType = customImageMime;
    }

    try {
      const response = await fetch("/api/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      const res = await response.json();
      if (res.success) {
        setScanResult(res.data);
      } else {
        alert("Scan timed out or is unconfigured. Showing healthy estimation fallback.");
      }
    } catch (err) {
      console.error("Scanning error", err);
      // Hard fallback in case fetch is server-side issues
      setScanResult({
        name: labelToScan,
        calories: presetItem ? presetItem.calories : 410,
        protein: 16,
        carbs: 38,
        fats: 20,
        score: "A-",
        scoreText: "WELL BALANCED",
        percentage: 86,
        notice: "Auto estimatated offline"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
        // Clear any prior set selected preset
        setSelectedPreset(null);
        // Prompt scan instantly
        setTimeout(() => {
          setLoading(true);
          const bodyPayload = {
            base64Image: reader.result as string,
            mimeType: file.type
          };
          fetch("/api/scan-food", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyPayload)
          })
            .then(res => res.json())
            .then(res => {
              if (res.success) {
                setScanResult(res.data);
              }
            })
            .catch(() => {
              setScanResult({
                name: "Scanned Meal Snapshot",
                calories: 450,
                protein: 22,
                carbs: 45,
                fats: 18,
                score: "B+",
                scoreText: "SATISFACTORY DENSITIES",
                percentage: 78
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setSelectedPreset(null);
    setCustomImage(null);
    setScanResult(null);
  };

  const handleConfirmAddLog = () => {
    if (!scanResult) return;

    // Determine target picture
    let selectedImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
    if (selectedPreset) {
      selectedImg = selectedPreset.imageUrl;
    } else if (customImage) {
      selectedImg = customImage;
    } else {
      // Pick random food depending on result values
      const matchingPreset = PRESET_FOODS.find(p => p.name.toLowerCase() === scanResult.name.toLowerCase());
      if (matchingPreset) selectedImg = matchingPreset.imageUrl;
    }

    onLogMeal({
      name: scanResult.name,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fats: scanResult.fats,
      score: scanResult.score,
      scoreText: scanResult.scoreText,
      percentage: scanResult.percentage,
      mealType: selectedPreset ? selectedPreset.mealType : "Breakfast",
      imageUrl: selectedImg
    });

    // Reset UI
    clearSelection();
    alert(`Successfully logged "${scanResult.name}"!`);
    onSetActiveTab("Daily");
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pt-2 pb-10">
      {/* Tab Selectors inside journal page */}
      <div className="flex border-b border-brand-surface-high text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTabSub("Scan")}
          className={`flex-1 py-2 border-b-2 text-center transition-all ${
            activeTabSub === "Scan"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-brand-outline hover:text-brand-on-surface"
          }`}
        >
          AI LENS CAMERA
        </button>
        <button
          onClick={() => setActiveTabSub("AllLogs")}
          className={`flex-1 py-2 border-b-2 text-center transition-all ${
            activeTabSub === "AllLogs"
              ? "border-brand-primary text-brand-primary font-bold"
              : "border-transparent text-brand-outline hover:text-brand-on-surface"
          }`}
        >
          RECENT LOGS ({meals.length})
        </button>
      </div>

      {activeTabSub === "Scan" ? (
        <>
          {/* LENS SHUTTER CENTERPIECE */}
          <section className="flex flex-col items-center justify-center py-6">
            <div className="relative group">
              {/* Outer Bezel (Material, Beveled feel) */}
              <div className="w-56 h-56 rounded-full bg-stone-900/60 p-4 flex items-center justify-center shadow-2xl border border-white/10">
                {/* Simulated Metal Inner Ring */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-stone-800 via-stone-700 to-stone-500 p-[3px] shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                  {/* Camera Shutter Lens Button */}
                  <button
                    onClick={() => {
                      if (selectedPreset) {
                        handleScanFood(selectedPreset);
                      } else {
                        // Scan default healthy avocado toast or first food
                        handleScanFood(PRESET_FOODS[3]);
                      }
                    }}
                    disabled={loading}
                    className="w-full h-full rounded-full bg-black hover:bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden transition-all active:scale-[0.95] duration-150 disabled:opacity-85 pointer-events-auto"
                  >
                    {/* Glass glare effect */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {/* Custom Image background preview inside camera if scanned */}
                    {(selectedPreset || customImage) && (
                      <img 
                        src={customImage || selectedPreset?.imageUrl} 
                        alt="Scanned item preview" 
                        className="absolute inset-0 w-full h-full object-cover opacity-35" 
                      />
                    )}

                    {/* Lens Technical labels */}
                    <div className="absolute top-4 w-full text-center pointer-events-none">
                      <span className="font-mono text-[8px] text-white/40 tracking-[0.25em]">
                        AI OPTICS 35MM
                      </span>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      {loading ? (
                        <Loader2 className="w-10 h-10 text-brand-secondary animate-spin mb-1" />
                      ) : (
                        <Camera className="w-11 h-11 text-white mb-0.5 animate-pulse" />
                      )}
                      <span className="font-mono text-white text-[10px] tracking-widest font-bold">
                        {loading ? "SCANNING..." : "SCAN FOOD"}
                      </span>
                    </div>

                    {/* LED Shutter Ticking Light */}
                    <div className="absolute bottom-4 w-full flex justify-center pointer-events-none">
                      <div className={`w-2.5 h-2.5 rounded-full ${loading ? "bg-brand-primary animate-ping" : "bg-brand-error animate-pulse"} shadow-[0_0_8px_rgba(239,68,68,0.8)]`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-5 font-mono text-xs font-bold text-stone-400 text-center uppercase tracking-wider max-w-[220px]">
              {selectedPreset || customImage ? `Selected: ${selectedPreset?.name || "Custom Upload"}` : "TAP LENS TO IDENTIFY MEAL NUTRITION"}
            </p>

            {/* Hidden custom input */}
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleCustomFileChange}
              className="hidden" 
            />

            {/* Mini clear choice button */}
            {(selectedPreset || customImage || scanResult) && (
              <button 
                onClick={clearSelection}
                className="mt-3.5 text-[11px] font-mono text-stone-400 bg-stone-900 border border-white/5 px-3 py-1 rounded-md hover:text-red-400 flex items-center gap-1 active:scale-95 transition-transform"
              >
                Clear / Recamera ✕
              </button>
            )}
          </section>

          {/* AI ESTIMATOR RECEIPT AREA */}
          {loading && (
            <div className="py-8 text-center animate-pulse">
              <Sparkles className="w-8 h-8 text-brand-primary mx-auto animate-spin mb-2" />
              <p className="font-mono text-xs text-stone-400 tracking-wider">
                DECRYPTING OPTIC LENS PIXELS...
              </p>
            </div>
          )}

          {scanResult && !loading && (
            <section className="mb-4 transform scale-95 relative animate-bounce-in z-20">
              <div className="receipt-edge bg-stone-900 border border-white/10 p-6 shadow-2xl text-white max-w-sm mx-auto rounded-sm transform rotate-[-0.5deg]">
                
                {/* Torn headers */}
                <div className="flex justify-between items-start mb-4 border-b border-dashed border-white/20 pb-4">
                  <div>
                    <h2 className="font-mono text-stone-300 font-bold text-xs uppercase tracking-wider">
                      ESTIMATION RESULTS
                    </h2>
                    <p className="font-mono text-stone-400 text-[10px]">
                      #829-AI-{scanResult.name ? scanResult.name.substring(0,3).toUpperCase() : "FOOD"}-OPTIC
                    </p>
                  </div>
                  <div className="text-right font-mono text-stone-400 text-[9px] leading-tight-none">
                    <p>{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                    <p>{new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>

                {/* Macro summary */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between font-mono text-sm border-b border-white/10 pb-1.5">
                    <span className="font-bold text-white">{scanResult.name}</span>
                    <span className="font-headline font-bold text-brand-primary">{scanResult.calories} KCAL</span>
                  </div>

                  <div className="space-y-1.5 pl-2.5 border-l-2 border-brand-primary">
                    <div className="flex justify-between text-[11px] font-mono text-stone-300">
                      <span>PROTEIN</span>
                      <span className="font-bold text-white">{scanResult.protein}g</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-300">
                      <span>CARBS</span>
                      <span className="font-bold text-white">{scanResult.carbs}g</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-300">
                      <span>FATS</span>
                      <span className="font-bold text-white">{scanResult.fats}g</span>
                    </div>
                  </div>
                </div>

                {/* Nutrition Grade Score badge */}
                <div className="bg-stone-950 p-3 rounded-lg recessed-panel mb-4 shadow-inner border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                      HEALTH OPTICAL SCORE
                    </span>
                    <span className="font-mono text-[10px] font-bold text-brand-primary">
                      {scanResult.score} ({scanResult.scoreText})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${scanResult.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Actions and disclaimer */}
                {scanResult.notice && (
                  <p className="font-mono text-[9px] text-[#ca8a04] italic text-center mb-3">
                    {scanResult.notice}
                  </p>
                )}

                <button
                  onClick={handleConfirmAddLog}
                  className="w-full bg-brand-primary text-black py-3 font-mono font-bold text-xs rounded-xl shadow-lg active:-translate-y-px active:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  CONFIRM & LOG MEAL
                </button>
              </div>
            </section>
          )}

          {/* Preset healthy food picker block */}
          {!scanResult && !loading && (
            <section className="bg-stone-950 border border-white/5 p-4 rounded-2xl">
              <h4 className="font-mono text-[10px] font-bold tracking-wider text-stone-400 uppercase mb-2">
                Sample Healthy Preset Items to Scan
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_FOODS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedPreset(item);
                      handleScanFood(item);
                    }}
                    className={`p-2 rounded-xl text-left flex items-center gap-2 bg-stone-900 hover:bg-stone-850 border tracking-tight transition-all active:scale-95 ${
                      selectedPreset?.name === item.name ? "border-brand-primary bg-[#ca8a04]/10" : "border-white/5"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-[#0e0d0c] border border-white/5">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-headline text-[11px] font-extrabold text-white block leading-tight">
                        {item.name}
                      </span>
                      <span className="font-mono text-[8px] text-stone-400 block">
                        EST. {item.calories} cal
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Advanced Custom Camera snap button action */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex gap-2.5">
                <button
                  onClick={handleCustomUploadClick}
                  className="flex-1 py-2 bg-stone-900 hover:bg-stone-850 border border-white/10 rounded-xl font-mono text-[11px] font-bold text-brand-primary flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Food Photo
                </button>
              </div>
            </section>
          )}

          {/* Polaroid Snap gallery of preset items for look-like aesthetic */}
          <section className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-headline text-base font-bold text-brand-primary">
                Demo Nutrition Logs
              </h3>
              <span className="font-mono text-[10px] text-stone-400">GALERIE DE PHOTO</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
              {PRESET_FOODS.map((food, idx) => (
                <div
                  key={idx}
                  className={`flex-none w-48 snap-start transform transition-transform duration-300 hover:rotate-0 hover:scale-105 cursor-pointer ${
                    idx % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                  onClick={() => {
                    setSelectedPreset(food);
                    handleScanFood(food);
                  }}
                >
                  <div className="bg-stone-905 text-white p-3 shadow-2xl rounded-xs border border-white/10 skew-polaroid fine-grain">
                    <div className="aspect-square bg-stone-950 overflow-hidden mb-2.5 shadow-inner rounded-xs border border-white/5">
                      <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-mono text-stone-400 text-[9px] uppercase tracking-wider mb-0.5">
                        {food.mealType} • 08:30 AM
                      </p>
                      <h4 className="font-headline text-xs font-bold text-brand-primary leading-tight truncate">
                        {food.name}
                      </h4>
                      <p className="font-mono text-[8px] text-stone-400 italic mt-1 pb-0.5">
                        EST. {food.calories} Calories
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* TAB: PREVIOUS LOGS GALLERY LIST */
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-brand-primary">
              Completed Log History
            </h3>
            <span className="font-mono text-[11px] text-brand-outline">TOTAL MEALS: {meals.length}</span>
          </div>

          {meals.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-brand-surface-high text-center">
              <FileText className="w-8 h-8 text-brand-outline/30 mx-auto mb-2" />
              <p className="text-brand-outline text-xs tracking-tight">No historic logs recorded.</p>
              <button
                onClick={() => setActiveTabSub("Scan")}
                className="mt-3 text-xs font-mono bg-brand-primary text-white px-3 py-1 rounded"
              >
                Scan with Lens Camera
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {meals.map((log) => (
                <div key={log.id} className="bg-white rounded-xl overflow-hidden border border-brand-surface-high shadow-sm p-3 flex flex-col justify-between">
                  <div className="aspect-video w-full rounded-lg bg-brand-surface-low overflow-hidden relative mb-2">
                    <img src={log.imageUrl} alt={log.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1 right-1 font-mono text-[8.5px] font-extrabold bg-[#ffe6cc] text-[#714a1c] px-1.5 py-0.5 rounded-md uppercase">
                      {log.score}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-mono text-[8.5px] text-brand-outline block uppercase tracking-wider">{log.mealType}</span>
                    <h4 className="font-headline text-xs font-bold text-brand-on-surface truncate leading-tight mt-0.5">{log.name}</h4>
                    <p className="font-mono text-[9px] text-brand-primary font-bold mt-1">{log.calories} kcal</p>
                  </div>
                  <div className="text-[9.5px] space-y-0.5 border-t border-brand-surface-low pt-1.5 font-mono text-brand-outline">
                    <div className="flex justify-between">
                      <span>Pro:</span>
                      <span className="text-brand-on-surface font-bold">{log.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carb:</span>
                      <span className="text-brand-on-surface font-bold">{log.carbs}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Bento Style Macro Summary Cards */}
      <section className="pt-2">
        <div className="grid grid-cols-2 gap-4">
          {/* Target Reached Bento Box */}
          <div className="bg-[#fcfdec]/60 p-5 rounded-2xl shadow-[0_8px_16px_rgba(42,44,38,0.03)] border border-white">
            <span className="font-mono text-[9px] font-bold text-brand-outline uppercase tracking-wider">
              Target Reached
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-sans text-2xl font-bold text-brand-primary">
                {totalCaloriesToday}
              </span>
              <span className="font-mono text-[9px] text-brand-outline tracking-tight">
                / {preferences.calorieGoal} kcal
              </span>
            </div>
            {/* Progress bar recessed */}
            <div className="mt-3.5 h-2 bg-[#dfdcd5] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-brand-primary transition-all duration-700 ease-out" 
                style={{ width: `${Math.min(100, (totalCaloriesToday / preferences.calorieGoal) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Water Glasses Bento Box */}
          <div className="bg-[#f1f6fa]/60 p-5 rounded-2xl shadow-[0_8px_16px_rgba(42,44,38,0.03)] border border-white">
            <span className="font-mono text-[9px] font-bold text-brand-outline uppercase tracking-wider block">
              Water Glasses
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-sans text-2xl font-bold text-brand-secondary">
                {totalWaterGlasses}
              </span>
              <span className="font-mono text-[9px] text-brand-outline tracking-tight">
                / 8 glasses
              </span>
            </div>
            {/* Row of visual water pills representing glasses */}
            <div className="mt-4 flex gap-1 justify-between">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-full h-1 rounded-full transition-colors ${
                    idx < totalWaterGlasses ? "bg-[#3c627d]" : "bg-brand-surface-highest"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
