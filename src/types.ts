/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  score: string;      // e.g. "A-"
  scoreText: string;  // e.g. "EXCELLENT"
  percentage: number; // health score bar width e.g. 88
  timestamp: string;  // e.g. "08:30 AM" or "12:45 PM"
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  imageUrl: string;   // Image URL or Base64 string
}

export interface WaterLog {
  id: string;
  amount: number; // in ml
  timestamp: string;
}

export interface UserPreferences {
  calorieGoal: number; // e.g. 2450
  waterGoal: number;   // in Liters e.g. 2.8
  pushNotifications: boolean;
  journalReminders: boolean;
  nightMode: boolean;
  name: string;
  tier: string;
  avatarUrl: string;
}

export interface WeeklyData {
  day: string; // "MON", "TUE", etc.
  calories: number; // active day calorie consumption
  water: number;    // active day water consumption in Liters
}
