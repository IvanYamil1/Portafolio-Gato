"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "@/contexts/GalleryContext";

export function UI() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedPainting, setSelectedPainting } = useGallery();

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPainting) {
        setSelectedPainting(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPainting, setSelectedPainting]);

  return (
    <>
      {/* Pantalla de carga */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[1000]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-3 border-[#262626] border-t-[#d4af37] rounded-full mb-4"
              style={{ borderWidth: "3px" }}
            />
            <p className="text-[#a3a3a3] text-sm">Cargando galería...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pantalla de introducción */}
      <AnimatePresence>
        {!isLoading && showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#0a0a0a]/90 flex items-center justify-center z-[100] backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8 max-w-md text-center"
            >
              <h1 className="text-3xl font-bold text-[#d4af37] mb-4 font-serif">
                Bienvenido a mi Galería
              </h1>
              <p className="text-[#a3a3a3] mb-6 leading-relaxed">
                Explora el pasillo y descubre más sobre mí en cada cuadro.
                Controla al gato para moverte por la galería.
              </p>
              <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
                <p className="text-sm text-[#fafafa] mb-2">Controles:</p>
                <div className="flex justify-center gap-4 text-[#a3a3a3] text-sm">
                  <span>W/↑ Adelante</span>
                  <span>S/↓ Atrás</span>
                </div>
                <div className="flex justify-center gap-4 text-[#a3a3a3] text-sm mt-1">
                  <span>A/← Girar izq.</span>
                  <span>D/→ Girar der.</span>
                </div>
                <div className="flex justify-center text-[#a3a3a3] text-sm mt-1">
                  <span>Shift para correr</span>
                </div>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="bg-[#d4af37] text-[#0a0a0a] px-8 py-3 rounded-full font-medium hover:bg-[#c4a030] transition-colors"
              >
                Comenzar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles hint */}
      {!isLoading && !showIntro && !selectedPainting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/80 border border-[#262626] rounded-lg px-6 py-3 backdrop-blur-sm z-50"
        >
          <p className="text-[#a3a3a3] text-sm">
            <span className="text-[#fafafa]">WASD</span> para mover •{" "}
            <span className="text-[#fafafa]">Shift</span> para correr •{" "}
            <span className="text-[#fafafa]">Click</span> en cuadros
          </p>
        </motion.div>
      )}

      {/* Panel de información del cuadro seleccionado */}
      <AnimatePresence mode="wait">
        {selectedPainting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-end z-50 pointer-events-none"
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                exit: { duration: 0.3, ease: "easeInOut" }
              }}
              className="bg-[#0a0a0a]/95 border-l border-[#262626] h-full w-96 p-8 flex flex-col justify-center backdrop-blur-md pointer-events-auto"
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-3xl font-bold text-[#d4af37] mb-6 font-serif"
              >
                {selectedPainting.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="text-[#a3a3a3] leading-relaxed text-lg mb-8"
              >
                {selectedPainting.description}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onClick={() => setSelectedPainting(null)}
                className="bg-transparent border border-[#444] text-[#888] px-6 py-3 rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-colors self-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cerrar (ESC)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Créditos del modelo */}
      <div className="fixed bottom-6 right-6 text-[10px] text-[#444] z-50">
        Cat model by Evil_Katz (CC BY)
      </div>
    </>
  );
}
