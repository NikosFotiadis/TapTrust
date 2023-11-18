import React, { useEffect, useState } from "react";
import { readEvents } from "../services/web3/polls";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

function calculateTimeLeft(timestamp) {
  const now = new Date().getTime(); // Current timestamp in milliseconds
  const difference = timestamp - now; // Difference between timestamps in milliseconds

  if (difference <= 0) {
    return "Time has already passed";
  }

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
  const [polls, setPolls] = useState([]);

  const getEvents = async () => {
    const events = await readEvents(deployedContracts[baseGoerli.id].Voting.address);

    setPolls(events.map(({ args }) => args));
  };

  useEffect(() => {
    getEvents();
  }, []);

  const renderPolls = poll => {
    const { days, hours, minutes } = calculateTimeLeft(poll.endTs * 1000);

    return (
      <div className="p-4 max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <h2 className="text-gray-700 font-bold text-xl mb-2">{poll.title || "Name"}</h2>
        <h3 className="text-gray-700 text-base">Poll ends in {`${days} days ${hours} hours ${minutes} minutes`}</h3>
        <h3>{poll.pollId}</h3>
      </div>
    );
  };

  return <div className="flex p-4">{polls.map(renderPolls)}</div>;
};

export default Polls;
