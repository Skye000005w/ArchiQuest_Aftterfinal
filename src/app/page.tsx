'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Leaderboard from "@/components/Leaderboard";
import PhotoAlbum from "@/components/PhotoAlbum";
import { getGroqCompletion } from "@/ai/groq";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    const fetchLocationOptions = async () => {
      const prompt = "Generate a list of 5 diverse geographical regions around the world, provide only the regions name and nothing else. Each region should be a separate line.";
      const completion = await getGroqCompletion(prompt, 100);
      const options = completion.split("\n").map((option) => option.trim());
      setLocationOptions(options);
    };

    fetchLocationOptions();
  }, []);

  const handleStart = () => {
    if (selectedLocation) {
      localStorage.setItem("playerName", playerName);
      localStorage.setItem("selectedLocation", selectedLocation);
      window.location.href = "/panorama";
    }
  };

  const handlePhotoAlbumClick = () => {
    setSelectedPlayerName(playerName);
    setShowPhotoAlbum(true);
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      setShowPhotoAlbum(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-green-700 to-green-900 text-white">
      {/* Insert video and fill the entire page */}
      <video
        src="/videos/Gen-2 3853313874, biologists in a dens, skye00000_A_highly_d, M 5.mp4"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Game Name */}
      <div className="absolute top-1/4 left-0 w-full flex justify-center mt-4">
        <h1 className="text-8xl font-bold text-white font-old-english mb-8 text-shadow">
          Nature Snap
        </h1>
      </div>
    

      {/* Add player name input and location selection */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <div className="bg-green-800 bg-opacity-75 p-6 rounded-md shadow-lg w-1/3">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-lg text-white bg-green-700 rounded-md shadow font-serif"
          />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-lg text-white bg-green-700 rounded-md shadow font-serif"
          >
            <option value="">Select a location</option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Link href="/panorama">
            <button
              onClick={handleStart}
              className="w-full px-6 py-3 text-xl font-bold text-white bg-green-600 rounded-md opacity-75 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105 mb-4 font-old-english"
            >
              Begin Expedition
            </button>
          </Link>

          {/* Add gameplay instructions */}
          <div className="mb-4 font-serif">
            <h2 className="text-xl font-bold mb-2">Expedition Guide</h2>
            <ul className="list-disc pl-4 text-sm">
              <li>Enter your name and select a location to begin the expedition.</li>
              <li>Explore the wild realms by clicking and dragging.</li>
              <li>Discover rare and exotic creatures to score points.</li>
              <li>Check your backpack and discoveries.</li>
              <li>Complete the expedition before time runs out.</li>
              <li>Your score will be recorded on the leaderboard.</li>
            </ul>
          </div>

          {/* Add "Photography Collection" button */}
          <button
            className="w-full px-6 py-3 text-xl font-bold text-white bg-green-700 rounded-md opacity-75 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-105 font-old-english"
            onClick={handlePhotoAlbumClick}
          >
            Photography Collection
          </button>
        </div>
      </div>

      {/* Add score ranking list */}
      <div className="absolute bottom-0 left-0 w-full p-4 font-serif">
        <Leaderboard />
      </div>

      {/* Render PhotoAlbum conditionally */}
      {showPhotoAlbum && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-4 rounded shadow-lg">
            <PhotoAlbum playerName={selectedPlayerName} onClose={() => setShowPhotoAlbum(false)} />
          </div>
        </div>
      )}
    </main>
  );
}