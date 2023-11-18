import React from "react";
import AccountAbstractionController from "./AccountAbstractionController";
import AccountAbstractionDeployer from "./AccountAbstractionDeployer";
import { useQuery } from "wagmi";
import { isAccountDeployed } from "~~/services/web3/accountAbstraction";

interface ScanComponentProps {
  eoaAddress: string;
}

const AccountAbstractionChecker: React.FC<ScanComponentProps> = props => {
  const { eoaAddress } = props;

  const { status, data, refetch } = useQuery(["isAccountDeployed", eoaAddress], {
    queryFn: () => isAccountDeployed(eoaAddress),
  });

  return (
    <div>
      {
        {
          idle: "Checking AA",
          loading: "Checking AA...",
          error: "Error",
          success: data ? (
            <AccountAbstractionController aaAddress={data} />
          ) : (
            <AccountAbstractionDeployer eoaAddress={eoaAddress} onSuccess={refetch} />
          ),
        }[status]
      }
    </div>
  );
};

export default AccountAbstractionChecker;
