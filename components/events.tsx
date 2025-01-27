 "use client";
import { env } from "process";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Cardo } from "next/font/google";
type Contests = {
  id : string,
  startTime : Date,
  contestName : string

}


const Events = () => {
  const supabase = createClient();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data, error } = await supabase.from('Contest').select('*');
        if (error) throw error;
        setContests(data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const handleAttend = (contestId : string) => {
    router.push(`/contest/${contestId}`);
  };

  if (loading) return <p>Loading contests...</p>;

  if (contests.length === 0) return <p>No contests available.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contests</h1>
      <div className="grid gap-4">
        {contests.map((contest : Contests) => (
          <div
            key={contest.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold">{contest.contestName}</h2>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

export default Events;
