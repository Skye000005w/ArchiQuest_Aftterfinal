'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EndPageProps {
  playerName: string;
  score: number;
  backpack: string[];
  onClose: () => void;
}

export default function EndPage({ playerName, score, backpack, onClose }: EndPageProps) {
  const router = useRouter();
  const [showBackpack, setShowBackpack] = useState(false);

  const handlePlayAgain = () => {
    router.push("/");
  };

  const handleBackpackClick = () => {
    setShowBackpack(!showBackpack);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-serif">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p className="mb-4">
          {playerName}, you have scored {score} points in this round of the game.
        </p>
        <div className="flex justify-between">
          <button
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
          <button
            className="ml-4 bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
            onClick={handleBackpackClick}
          >
            {showBackpack ? 'Close Photo Album' : 'View Photo Album'}
          </button>
        </div>
        {showBackpack && backpack.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Photo Album</h3>
            <div className="grid grid-cols-3 gap-4">
              {backpack.map((img, index) => (
                <div key={index} className="w-full h-40 overflow-hidden">
                  <img
                    src={img}
                    alt={`Backpack item ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}