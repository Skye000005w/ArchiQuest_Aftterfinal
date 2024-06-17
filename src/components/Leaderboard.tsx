import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

interface LeaderboardEntry {
  id: number;
  created_at: string;
  name: string;
  score: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("id, created_at, name, score")
        .order("score", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching leaderboard data:", error);
      } else {
        setLeaderboardData(data as LeaderboardEntry[]);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="bg-white rounded shadow-lg p-4 font-serif text-green-800">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

      <div className="flex font-bold mb-2">
        <div className="w-1/12 text-center">Rank</div>
        <div className="w-8/12 text-left">Name</div>
        <div className="w-3/12 text-left">Score</div>
      </div>
      {leaderboardData.map((entry, index) => (
        <div key={entry.id} className="flex border-t py-2">
          <div className="w-1/12 text-center">{index + 1}</div>
          <div className="w-8/12">{entry.name}</div>
          <div className="w-3/12">{entry.score}</div>
        </div>
      ))}
    </div>
  );
}