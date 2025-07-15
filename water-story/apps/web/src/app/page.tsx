'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component only on client
const LakeMap = dynamic(() => import("@/components/LakeMap"), {
  ssr: false,
});

const locations = {
  erie: {
    center: [41.7, -82.6] as [number, number], // Lake Erie center
    blooms: [
      { lat: 41.7, lng: -83.3, intensity: 'high' as const },
      { lat: 41.9, lng: -82.0, intensity: 'moderate' as const },
    ],
  },
  huron: {
    center: [44.8, -82.4] as [number, number], // Lake Huron center
    blooms: [
      { lat: 45.0, lng: -82.5, intensity: 'moderate' as const },
      { lat: 44.6, lng: -82.3, intensity: 'low' as const },
    ],
  },
  michigan: {
    center: [44.0, -87.0] as [number, number], // Lake Michigan center
    blooms: [
      { lat: 43.8, lng: -87.1, intensity: 'high' as const },
      { lat: 44.2, lng: -86.9, intensity: 'moderate' as const },
    ],
  },
  superior: {
    center: [47.7, -87.5] as [number, number], // Lake Superior center
    blooms: [
      { lat: 47.5, lng: -87.4, intensity: 'moderate' as const },
      { lat: 47.9, lng: -87.6, intensity: 'low' as const },
    ],
  },
  ontario: {
    center: [43.7, -77.9] as [number, number], // Lake Ontario center
    blooms: [
      { lat: 43.6, lng: -78.0, intensity: 'high' as const },
      { lat: 43.8, lng: -77.8, intensity: 'moderate' as const },
    ],
  },
};

type Region = keyof typeof locations;
type Layer = 'habs' | 'buoys';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('erie');
  const [activeLayer, setActiveLayer] = useState<Layer>('habs');
  const [buoys, setBuoys] = useState<any[]>([]);

  const current = locations[selectedRegion];

  // 🚀 Fetch buoy list (placeholder — can later be real API or different per region)
  useEffect(() => {
    // For demo, just static buoy for now
    setBuoys([
      {
        lat: 41.8,
        lng: -82.9,
        id: "45011",
        waterTemp: 18.3,
        windSpeed: 4.2,
        waveHeight: 0.9,
      },
    ]);
  }, [selectedRegion]);

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">🌊 WaterStory Dashboard</h1>

      {/* 🌐 Region toggle */}
      <div className="mb-4 space-x-2">
        {Object.entries(locations).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelectedRegion(key as Region)}
            className={`px-4 py-2 rounded ${selectedRegion === key ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* 🗂 Layer toggle */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setActiveLayer('habs')}
          className={`px-4 py-2 rounded ${activeLayer === 'habs' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Show HABs
        </button>
        <button
          onClick={() => setActiveLayer('buoys')}
          className={`px-4 py-2 rounded ${activeLayer === 'buoys' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
        >
          Show Buoys
        </button>
      </div>

      {/* 🗺️ Map Display */}
      <LakeMap
        center={current.center}
        habs={current.blooms}
        buoys={buoys}
        activeLayer={activeLayer}
      />
    </main>
  );
}