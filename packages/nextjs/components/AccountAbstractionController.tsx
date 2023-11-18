import React from "react";
import AccountAbstractionAttestations from "./AccountAbstractionAttestations";
import { useMutation } from "wagmi";
import { getSmartAccount } from "~~/services/web3/accountAbstraction";

interface ScanComponentProps {
  aaAddress: string;
  eoaAddress: string;
}

const AccountAbstractionController: React.FC<ScanComponentProps> = props => {
  const { aaAddress } = props;

  const { status, mutate, data } = useMutation({
    mutationFn: async () => {
      const smartAccount = await getSmartAccount(aaAddress);

      return smartAccount.signMessage("Hello world");
    },
    onSuccess: async data => {
      alert(`Signed message: ${data}`);
    },
  });

  return (
    <div className="overflow-scroll">
      <h1 className="text-2xl font-bold">Account Abstraction Controller</h1>
      <p>AA Address: {aaAddress}</p>

      <h2 className="text-xl font-semibold">Attestations</h2>
      <AccountAbstractionAttestations aaAddress={aaAddress} />

      <h2 className="text-xl font-semibold">Sign message</h2>
      {
        {
          idle: (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => mutate()}
            >
              Sign message
            </button>
          ),
          loading: "Signing...",
          error: "Error",
          success: <div className="overflow-scroll max-w-full text-black w-fit">{JSON.stringify(data, null, 2)}</div>,
        }[status]
      }
    </div>
  );
};

export default AccountAbstractionController;
