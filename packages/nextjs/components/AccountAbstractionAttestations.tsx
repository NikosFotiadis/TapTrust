import React from "react";
import Link from "next/link";
import { useQuery } from "wagmi";
import { getAttestationsForAddress } from "~~/services/web3/attestationService";

interface ScanComponentProps {
  aaAddress: string;
  eoaAddress: string;
}

const AccountAbstractionAttestations: React.FC<ScanComponentProps> = props => {
  const { aaAddress, eoaAddress } = props;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((attestation, index) => (
          <Link key={index} href={`/user/${eoaAddress}/event/${attestation.eventId}?aaAddress=${aaAddress}`}>
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-4">
                <p className="text-xl font-semibold leading-6 text-gray-900">{attestation.eventName}</p>
                <p className="text-xs m-0 text-gray-600">Event Role</p>
                <p className="text-md m-0 font-semibold leading-6 text-gray-900">{attestation.role}</p>

                <p className="text-xs m-0 mt-4 text-gray-600">Event Creator</p>
                <p className="text-xs m-0 font-semibold leading-6 text-gray-900">{attestation.attester}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountAbstractionAttestations;
