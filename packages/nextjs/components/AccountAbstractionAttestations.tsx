import React from "react";
import Link from "next/link";
import { useQuery } from "wagmi";
import { getAttestationsForAddress } from "~~/services/web3/attestationService";

interface ScanComponentProps {
  aaAddress: string;
}

const AccountAbstractionAttestations: React.FC<ScanComponentProps> = props => {
  const { aaAddress } = props;

  const {
    data = [],
    status,
    error,
  } = useQuery(["attestations"], {
    queryFn: () => getAttestationsForAddress(aaAddress),
  });

  if (status === "loading" || status === "idle") {
    return <div>...loading attestations</div>;
  }

  if (status === "error") {
    console.log(error);
    return <div>...Error!</div>;
  }

  return (
    <div>
      <ul
        role="list"
        className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {data.map(attestation => (
          <li key={attestation.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <div className="flex min-w-0 gap-x-4 gap-y-4">
              <div className="min-w-0 flex-auto">
                <p className="text-xs font-medium leading-6 text-gray-600">Event Name</p>
                <p className="text-xl font-semibold leading-6 text-gray-900">
                  <Link href={`/events/${attestation.eventId}`}>{attestation.eventName}</Link>
                </p>

                <p className="text-xs font-medium leading-6 text-gray-600">Event Role</p>
                <p className="text-xl font-semibold leading-6 text-gray-900">{attestation.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountAbstractionAttestations;
