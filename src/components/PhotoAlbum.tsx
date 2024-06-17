import { useEffect, useState } from "react";
import { getScores } from "@/supabase/supabase";
import Image from "next/image";

interface PhotoAlbumProps {
  playerName: string;
  onClose: () => void;
}

export default function PhotoAlbum({ playerName, onClose }: PhotoAlbumProps) {
  const [photos, setPhotos] = useState<{ imageUrl: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const scores = await getScores();
        const playerPhotos = scores
          .filter((score) => score.name === playerName)
          .map((score) => ({ imageUrl: score.image_url }));
        setPhotos(playerPhotos);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, [playerName]);

  return (
    <div className="relative bg-amber-100 p-6 rounded shadow-lg">
      <button
        className="absolute top-0 right-0 m-2 text-xl font-bold text-amber-800 hover:text-amber-900"
        onClick={onClose}
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4 text-amber-800 font-serif">
        {playerName}
      </h2>
      {isLoading ? (
        <p className="text-amber-800">Loading photos...</p>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="bg-white p-2 rounded shadow-md">
              <Image
                src={photo.imageUrl}
                alt={`${playerName}'s photo`}
                className="w-full h-auto object-cover rounded"
                width={200}
                height={200}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-amber-800">No photos found.</p>
      )}
    </div>
  );
}