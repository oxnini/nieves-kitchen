export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FlavorProfile {
  sweet: number;
  salty: number;
  sour: number;
  bitter: number;
  umami: number;
  spicy: number;
}

export interface Recipe {
  id: string;
  name: string;
  country: string;
  region: CulinaryRegion;
  coordinates: { lat: number; lng: number };
  category: "main" | "dessert" | "drink" | "side";
  tags: string[];
  isFusion: boolean;
  inspiredBy?: string[]; // other countries/cuisines for fusion dishes
  quote: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  flavorProfile: FlavorProfile;
}

export type CulinaryRegion =
  | "Western Europe"
  | "Eastern Europe"
  | "East Asia"
  | "Southeast Asia"
  | "South Asia"
  | "Japan & Korea"
  | "Middle East"
  | "North Africa"
  | "Sub-Saharan Africa"
  | "Caribbean & Americas";

export type MealFilter = "all" | "main" | "dessert" | "drink" | "side";

export interface Filters {
  mealType: MealFilter;
  minProtein: number;
  maxCalories: number;
  maxTime: number | null; // null = any
  regions: CulinaryRegion[];
  tags: string[];
}

export type Page = "home" | "recipes" | "favorites" | "about";
