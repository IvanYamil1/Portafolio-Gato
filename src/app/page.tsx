"use client";

import dynamic from "next/dynamic";
import { UI } from "@/components/UI";
import { GalleryProvider } from "@/contexts/GalleryContext";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

function MainContent() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0a0a]">
      <Scene />
      <UI />
    </main>
  );
}

export default function Home() {
  return (
    <GalleryProvider>
      <MainContent />
    </GalleryProvider>
  );
}
