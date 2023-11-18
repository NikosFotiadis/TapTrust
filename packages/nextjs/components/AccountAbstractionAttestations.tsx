import React from "react";
import { useQuery } from "wagmi";
import { getAttestationsForAddress } from "~~/services/web3/attestationService";

interface ScanComponentProps {
  aaAddress: string;
}

const AccountAbstractionAttestations: React.FC<ScanComponentProps> = props => {
  const { aaAddress } = props;

  const { data } = useQuery(["attestations"], {
    queryFn: () => getAttestationsForAddress(aaAddress),
  });

  if(!data) {
    return <div>...loading attestations</div>;
  }

  return (
    <div>
      {data.map(attestation => (
        <div key={attestation}>{attestation}</div>
      ))}
    </div>
  );
};

export default AccountAbstractionAttestations;
