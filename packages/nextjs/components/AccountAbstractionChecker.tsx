import React from "react";
import AccountAbstractionController from "./AccountAbstractionController";
import { useQuery } from "wagmi";
import { generateCounterfactualAddress } from "~~/services/web3/accountAbstraction";

interface ScanComponentProps {
  eoaAddress: string;
}

const AccountAbstractionChecker: React.FC<ScanComponentProps> = props => {
  const { eoaAddress } = props;

  const { status, data, refetch } = useQuery([eoaAddress], {
    queryFn: () => generateCounterfactualAddress(eoaAddress),
  });

  if (status === "error") {
    return (
      <div>
        Error
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (status === "loading") {
    return <div>...loading</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      <AccountAbstractionController aaAddress={data} eoaAddress={eoaAddress} />
    </div>
  );
};

export default AccountAbstractionChecker;
