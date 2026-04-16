import { Clock, Flame, Dumbbell, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isFavorited?: boolean;
}

export default function RecipeCard({ recipe, onClick, isFavorited = false }: RecipeCardProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(62, 39, 35, 0.12)" }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md text-left w-full group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {recipe.isFusion && (
          <span className="absolute top-3 left-3 bg-turmeric text-brown-dark text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            FUSION
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-brown-dark text-xs font-medium px-2.5 py-1 rounded-full shadow">
          {recipe.country}
        </span>
        {isFavorited && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full shadow">
            <Heart size={14} className="text-terracotta fill-terracotta" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-brown-dark mb-2 leading-tight">
          {recipe.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-parchment-dark text-brown-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-brown-medium">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.prepTime + recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={14} />
            {recipe.nutrition.protein}g protein
          </span>
          <span className="flex items-center gap-1">
            <Flame size={14} />
            {recipe.nutrition.calories} cal
          </span>
        </div>
      </div>
    </motion.button>
  );
}
