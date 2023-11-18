import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { readPollsForEvent } from "~~/services/web3/polls";

function calculateTimeLeft(timestamp: number) {
  const now = new Date().getTime(); // Current timestamp in milliseconds
  const difference = timestamp - now; // Difference between timestamps in milliseconds

  // Convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

const Polls = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const params = useParams();

  const getEvents = async () => {
    const events =
      (await readPollsForEvent(deployedContracts[baseGoerli.id as 84531].Voting.address, params.eventId as string)) ||
      [];

    setPolls(events);
  };

  useEffect(() => {
    if (params?.eventId) {
      getEvents();
    }
  }, [params]);

  const renderPolls = (poll: any, i: number) => {
    const timestamp = Number(poll.endTs * 1000);
    const { days, hours, minutes } = calculateTimeLeft(timestamp);

    const now = new Date().getTime(); // Current timestamp in milliseconds
    const difference = timestamp - now; // Difference between timestamps in milliseconds

    if (difference <= 0) {
      return "Time has already passed";
    }

    return (
      <div key={i} className="p-4 max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <h2 className="text-gray-700 font-bold text-xl mb-2">{poll.title}</h2>
        <h3 className="text-gray-700 text-base">Poll ends in {`${days} days ${hours} hours ${minutes} minutes`}</h3>
        <Link href={`/user/${params.userAddress}/event/${params.eventId}/polls/${poll.id}/vote`}>Vote</Link>
      </div>
    );
  };

  return <div className="flex p-4">{polls.map(renderPolls)}</div>;
};

export default Polls;
