"use client";

import dynamic from "next/dynamic";
import { UI } from "@/components/UI";
import { GalleryProvider } from "@/contexts/GalleryContext";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <GalleryProvider>
      <main className="w-screen h-screen overflow-hidden">
        <Scene />
        <UI />
      </main>
    </GalleryProvider>
  );
}
