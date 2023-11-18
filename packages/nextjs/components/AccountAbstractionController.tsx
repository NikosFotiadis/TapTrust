import React from "react";
import AccountAbstractionAttestations from "./AccountAbstractionAttestations";
import { encodeFunctionData } from "viem";
import { useMutation } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { sendUserOperation, waitForUserOperationTransaction } from "~~/services/web3/accountAbstraction";

interface ScanComponentProps {
  aaAddress: string;
  eoaAddress: string;
}

const AccountAbstractionController: React.FC<ScanComponentProps> = props => {
  const { aaAddress, eoaAddress } = props;

  const { status, mutate, data, error } = useMutation({
    mutationFn: async () => {
      const schema = "uint256 eventId, uint8 voteIndex, uint256 timestamp, uint256 nonce, address signer";
      const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
      const revocable = true;

      const uoCallData = encodeFunctionData({
        abi: externalContracts[1].SchemaRegistry.abi,
        functionName: "register",
        args: [schema, resolverAddress, revocable],
      });

      const uo = await sendUserOperation({
        signerAddress: props.eoaAddress,
        to: externalContracts[1].SchemaRegistry.address,
        data: uoCallData,
        value: BigInt(0),
      });

      const txHash = await waitForUserOperationTransaction(eoaAddress, uo.hash);

      alert(txHash);

      return { uo, txHash };
    },
  });

  return (
    <div className="overflow-scroll">
      <h1 className="text-2xl font-bold">Account Abstraction Controller</h1>
      <p>AA Address: {aaAddress}</p>

      <h2 className="text-xl font-semibold">Attestations</h2>
      <AccountAbstractionAttestations aaAddress={aaAddress} />

      <h2 className="text-xl font-semibold">Sign message</h2>

      <div className="max-w-[250px]">
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
            error: `Error ${error}`,
            success: (
              <div className="overflow-scroll max-w-250px text-black w-fit">
                {JSON.stringify(data?.txHash, null, 2)}
              </div>
            ),
          }[status]
        }
      </div>
    </div>
  );
};

export default AccountAbstractionController;
