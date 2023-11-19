import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "wagmi";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import banner from "~~/public/banner.png";
import { getAttestationsForAddress } from "~~/services/web3/attestationService";
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
  const [event, setEvent] = useState({});
  const params = useParams();
  const searchParams = useSearchParams();
  const aaAddress = searchParams.get("aaAddress");

  const { data = [] } = useQuery(["attestations"], {
    queryFn: () => getAttestationsForAddress(aaAddress as string),
  });

  useEffect(() => {
    if (data.length && params?.eventId) {
      const attestation = data.find(att => String(att.eventId) === String(params.eventId));

      setEvent(attestation);
    }
  }, [data, params?.eventId]);

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
      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h2 className="text-gray-700 font-bold text-xl mb-2">{poll.title}</h2>
          <p>Total Votes: {poll.options.reduce((sum: number, curr: any) => (sum += Number(curr.votes)), 0)}</p>
          <h3 className="text-gray-700 text-base">Poll ends in {`${days} days ${hours} hours ${minutes} minutes`}</h3>
          <Link
            className="btn bg-blue-500 text-white w-full"
            href={`/user/${params.userAddress}/event/${params.eventId}/polls/${poll.id}/vote`}
          >
            Vote
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative w-full h-64 overflow-hidden">
        <img src={banner.src} alt="Your Image" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 w-full h-full clip-broken"></div>
      </div>

      <div className="flex justify-center p-4 -mt-20">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md z-10">
          <h2 className="text-2xl font-bold mb-4">Welcome to {event?.eventName}</h2>
          <p>Here you can see all the pools and express your opinion anonymously</p>
        </div>
      </div>

      <div className="flex justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Polls</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{polls.map(renderPolls)}</div>
    </div>
  );
};

export default Polls;
