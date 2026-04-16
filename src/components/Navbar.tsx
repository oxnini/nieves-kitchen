import { UtensilsCrossed, Map, BookOpen, Info, Heart } from "lucide-react";
import type { Page } from "../types";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  favoritesCount: number;
}

export default function Navbar({ currentPage, onNavigate, favoritesCount }: NavbarProps) {
  const links: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: "home", label: "Explore", icon: <Map size={18} /> },
    { page: "recipes", label: "All Recipes", icon: <BookOpen size={18} /> },
    { page: "favorites", label: "Favorites", icon: <Heart size={18} /> },
    { page: "about", label: "About", icon: <Info size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-brown-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <UtensilsCrossed size={28} className="text-terracotta" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-brown-dark leading-tight font-heading">
                Nieves' Kitchen
              </h1>
              <p className="text-xs text-brown-medium leading-tight tracking-wide hidden sm:block">
                Globally inspired halal recipes for the health-conscious foodie
              </p>
            </div>
          </button>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            {links.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-all
                  ${currentPage === page
                    ? "bg-terracotta text-white shadow-md"
                    : "text-brown-medium hover:bg-parchment-dark hover:text-brown-dark"
                  }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
                {page === "favorites" && favoritesCount > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    currentPage === page ? "bg-white/20 text-white" : "bg-terracotta text-white"
                  }`}>
                    {favoritesCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
