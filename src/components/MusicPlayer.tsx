import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaForward } from "react-icons/fa";

const musicUrls = [
  "/audio/CanopyWhispers.mp3",
  "/audio/CoralSerenity.mp3",
  "/audio/RainforestRhapsody.mp3",
];

interface MusicPlayerProps {
  autoPlay?: boolean;
  loop?: boolean;
}

export default function MusicPlayer({ autoPlay = false, loop = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoPlay) {
      audioRef.current?.play();
    }
  }, [autoPlay]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicUrls.length);
    setIsPlaying(false);  // Stop the current track
    setTimeout(() => setIsPlaying(true), 0);  // Play the next track
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded shadow-lg flex items-center">
      <audio
        ref={audioRef}
        src={musicUrls[currentTrackIndex]}
        loop={loop}
      />
      <button onClick={handlePlayPause} className="mr-4">
        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
      <button onClick={handleNextTrack}>
        <FaForward size={24} />
      </button>
    </div>
  );
}
