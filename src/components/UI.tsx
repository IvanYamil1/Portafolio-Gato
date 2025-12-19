"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "@/contexts/GalleryContext";

export function UI() {
  const { selectedPainting, setSelectedPainting, isLoading, setIsLoading, showIntro, setShowIntro } = useGallery();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // Iniciar música cuando se presiona "Entrar"
  const startMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/Musica-fondo.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    audioRef.current.play().catch(() => {
      // El navegador puede bloquear el autoplay
    });
    setMusicStarted(true);
  };

  // Alternar mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
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
      {/* Splash Screen cinematográfico */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 flex flex-col items-center justify-center z-[1000]"
          >
            {/* Fondo con gradiente burgundy elegante */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={{
                background: "radial-gradient(ellipse at center, #4a1525 0%, #1a0a10 40%, #0a0a0a 70%)"
              }}
            />

            {/* Viñeta */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)"
              }}
            />

            {/* Líneas decorativas animadas que cruzan la pantalla */}
            <motion.div
              className="absolute top-[30%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
            />
            <motion.div
              className="absolute bottom-[30%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            />

            {/* Marco de esquinas decorativo */}
            <div className="absolute inset-8 md:inset-16 pointer-events-none">
              {/* Esquina superior izquierda */}
              <motion.div
                className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#d4af37]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              />
              {/* Esquina superior derecha */}
              <motion.div
                className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-[#d4af37]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
              />
              {/* Esquina inferior izquierda */}
              <motion.div
                className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-[#d4af37]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
              />
              {/* Esquina inferior derecha */}
              <motion.div
                className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#d4af37]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Nombre con reveal cinematográfico */}
              <div className="overflow-hidden">
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl text-white font-extralight tracking-[0.2em] leading-none"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    textShadow: "0 0 60px rgba(212, 175, 55, 0.3)"
                  }}
                  initial={{ y: "120%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  IVAN
                </motion.h1>
              </div>

              {/* Línea dorada separadora */}
              <motion.div
                className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-4"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
              />

              <div className="overflow-hidden">
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl text-white font-extralight tracking-[0.2em] leading-none"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    textShadow: "0 0 60px rgba(212, 175, 55, 0.3)"
                  }}
                  initial={{ y: "120%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.2, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  YAMIL
                </motion.h1>
              </div>

              {/* Subtítulo */}
              <motion.p
                className="text-[#d4af37]/80 text-sm md:text-base tracking-[0.5em] uppercase mt-8"
                style={{ fontFamily: "Georgia, serif" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
              >
                Web Designer & Developer
              </motion.p>
            </div>

            {/* Indicador de carga con barra dorada */}
            <motion.div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 1 }}
            >
              <span className="text-[#888] text-xs tracking-[0.3em] uppercase">Cargando experiencia</span>
              <div className="w-48 h-[2px] bg-[#333] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 3.4, duration: 1, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Textos laterales decorativos */}
            <motion.div
              className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.3, x: 0 }}
              transition={{ delay: 2, duration: 1.5 }}
            >
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase transform -rotate-90 origin-center whitespace-nowrap">
                Portfolio 2024
              </p>
            </motion.div>
            <motion.div
              className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.3, x: 0 }}
              transition={{ delay: 2.2, duration: 1.5 }}
            >
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase transform rotate-90 origin-center whitespace-nowrap">
                Creative Works
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pantalla de introducción */}
      <AnimatePresence mode="wait">
        {!isLoading && showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
          >
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Partículas flotantes decorativas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#d4af37]/20"
                  style={{
                    width: `${4 + i * 2}px`,
                    height: `${4 + i * 2}px`,
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Líneas decorativas animadas */}
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"
              style={{ top: "25%" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"
              style={{ bottom: "25%" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
            />

            {/* Esquinas decorativas */}
            <motion.div
              className="absolute border-l border-t border-[#d4af37]/30"
              style={{ top: "10%", left: "10%", width: "40px", height: "40px" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
            <motion.div
              className="absolute border-r border-t border-[#d4af37]/30"
              style={{ top: "10%", right: "10%", width: "40px", height: "40px" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            />
            <motion.div
              className="absolute border-l border-b border-[#d4af37]/30"
              style={{ bottom: "10%", left: "10%", width: "40px", height: "40px" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            />
            <motion.div
              className="absolute border-r border-b border-[#d4af37]/30"
              style={{ bottom: "10%", right: "10%", width: "40px", height: "40px" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            />

            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center px-8 text-center w-full">
              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-white text-3xl md:text-4xl mb-6 font-light tracking-wide"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Bienvenido a mi Galería
              </motion.h2>

              {/* Línea decorativa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-6"
              />

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl"
              >
                Explora mi portafolio de forma interactiva. Camina por la galería y descubre mis proyectos, habilidades y experiencia en cada cuadro.
              </motion.p>

              {/* Controles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center text-sm tracking-wide"
                style={{ gap: "1rem" }}
              >
                <div
                  className="flex items-center rounded border border-white/10 bg-white/5"
                  style={{ gap: "0.5rem", padding: "0.5rem 1rem" }}
                >
                  <kbd className="text-white/80 font-medium">WASD</kbd>
                  <span className="text-white/40 text-xs">mover</span>
                </div>
                <div
                  className="flex items-center rounded border border-white/10 bg-white/5"
                  style={{ gap: "0.5rem", padding: "0.5rem 1rem" }}
                >
                  <kbd className="text-white/80 font-medium">SHIFT</kbd>
                  <span className="text-white/40 text-xs">correr</span>
                </div>
                <div
                  className="flex items-center rounded border border-white/10 bg-white/5"
                  style={{ gap: "0.5rem", padding: "0.5rem 1rem" }}
                >
                  <kbd className="text-white/80 font-medium">CLICK</kbd>
                  <span className="text-white/40 text-xs">ver cuadros</span>
                </div>
              </motion.div>

              {/* Botón */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onClick={() => {
                  startMusic();
                  setShowIntro(false);
                }}
                className="border border-white/20 text-white/90 uppercase tracking-[0.25em] text-base transition-all duration-300 hover:bg-white/5 hover:border-white/40 hover:tracking-[0.3em]"
                style={{ fontFamily: "Georgia, serif", marginTop: "3rem", padding: "1.25rem 4rem" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Entrar
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles hint */}
      {!isLoading && !showIntro && !selectedPainting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/80 border border-[#262626] rounded-full px-6 py-3 backdrop-blur-sm z-50"
        >
          <p className="text-[#a3a3a3] text-sm">
            <span className="text-[#fafafa]">WASD</span> para mover •{" "}
            <span className="text-[#fafafa]">Shift</span> para correr •{" "}
            <span className="text-[#fafafa]">Click</span> en cuadros
          </p>
        </motion.div>
      )}

      {/* Indicador para cerrar cuando hay cuadro seleccionado */}
      <AnimatePresence>
        {selectedPainting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/80 border border-[#262626] rounded-full px-6 py-3 backdrop-blur-sm z-50"
          >
            <p className="text-[#a3a3a3] text-sm">
              Presiona <span className="text-[#d4af37]">ESC</span> o <span className="text-[#d4af37]">Click</span> para cerrar
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de música */}
      {musicStarted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={toggleMute}
          className="fixed top-6 right-6 w-12 h-12 rounded-full bg-[#0a0a0a]/80 border border-[#262626] backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#0a0a0a]"
          title={isMuted ? "Activar música" : "Silenciar música"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </motion.button>
      )}

      {/* Créditos del modelo */}
      <div className="fixed bottom-6 right-6 text-[10px] text-[#444] z-50">
        Cat model by Evil_Katz (CC BY)
      </div>
    </>
  );
}
