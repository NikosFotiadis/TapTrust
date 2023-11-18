import React, { useEffect, useState } from "react";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { readEvents } from "~~/services/web3/polls";

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

  const getEvents = async () => {
    const events = (await readEvents(deployedContracts[baseGoerli.id as 31337].Voting.address)) || [];

    setPolls(events.map(({ args }) => args));
  };

  useEffect(() => {
    getEvents();
  }, []);

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
        <h2 className="text-gray-700 font-bold text-xl mb-2">{poll.title || "Name"}</h2>
        <h3 className="text-gray-700 text-base">Poll ends in {`${days} days ${hours} hours ${minutes} minutes`}</h3>
        <h3>{poll.pollId}</h3>
      </div>
    );
  };

  return <div className="flex p-4">{polls.map(renderPolls)}</div>;
};

export default Polls;
