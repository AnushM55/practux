'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

type Contests = {
  id: string,
  startTime: Date,
  contestName: string
}


export default function ContestMenus() {
  const supabase = createClient();
  const [contests, setContests] = useState<Contests[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data, error } = await supabase.from('Contest').select('*');
        if (error) throw error;
        console.log(data)
        setContests(data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleAttend = (contestId: string) => {
    console.log("can attend this contest")
    redirect(`protected/contests/${contestId}`)

  };

  if (loading) return <p>Loading contests...</p>;

  if (contests.length === 0) return <p>No contests available.</p>;

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Contests</h1>
      <div className="grid gap-4">
        {contests.map((contest: Contests) => (
          <div
            key={contest.id}
            className="p-4 border rounded-lg shadow-md bg-black flex justify-between items-center"
          >
            {/* Contest Name */}
            <h2 className="text-xl font-semibold text-white">{contest.contestName}</h2>

            <div className="px-40" />
            {/* Attend Button */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => handleAttend(contest.id)}
            >
              Attend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

