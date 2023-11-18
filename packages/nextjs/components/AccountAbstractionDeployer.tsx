import React from "react";
import { useMutation } from "wagmi";
import { deploySmartAccount } from "~~/services/web3/accountAbstraction";

interface ScanComponentProps {
  eoaAddress: string;
  onSuccess: () => void;
}

const AccountAbstractionDeployer: React.FC<ScanComponentProps> = props => {
  const { eoaAddress, onSuccess } = props;

  const { status, mutate } = useMutation({
    mutationFn: () => deploySmartAccount(eoaAddress),
    onSuccess: async data => {
      alert(`Registered: ${data}`);
      onSuccess();
    },
  });

  return (
    <div>
      {
        {
          idle: <button onClick={() => mutate}>Deploy AA</button>,
          loading: "Deploying...",
          error: "Error",
          success: "Registered",
        }[status]
      }
    </div>
  );
};

export default AccountAbstractionDeployer;
