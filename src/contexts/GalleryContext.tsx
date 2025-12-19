"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaintingView {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
}

interface GalleryContextType {
  selectedPainting: PaintingView | null;
  setSelectedPainting: (painting: PaintingView | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [selectedPainting, setSelectedPainting] = useState<PaintingView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <GalleryContext.Provider value={{ selectedPainting, setSelectedPainting, isLoading, setIsLoading, showIntro, setShowIntro }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery debe usarse dentro de GalleryProvider");
  }
  return context;
}
