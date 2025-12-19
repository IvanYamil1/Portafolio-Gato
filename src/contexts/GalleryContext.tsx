"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PaintingView {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
}

interface TouchControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
}

interface GalleryContextType {
  selectedPainting: PaintingView | null;
  setSelectedPainting: (painting: PaintingView | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  isMobile: boolean;
  touchControls: TouchControls;
  setTouchControls: (controls: TouchControls) => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [selectedPainting, setSelectedPainting] = useState<PaintingView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchControls, setTouchControls] = useState<TouchControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <GalleryContext.Provider value={{
      selectedPainting,
      setSelectedPainting,
      isLoading,
      setIsLoading,
      showIntro,
      setShowIntro,
      isMobile,
      touchControls,
      setTouchControls
    }}>
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
