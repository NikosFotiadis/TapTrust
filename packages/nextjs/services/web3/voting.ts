import { encodeFunctionData } from "viem";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export const getVotingUoCallData = (attestationId: string, pollId: string, option: number) => {
  return encodeFunctionData({
    abi: deployedContracts[baseGoerli.id as 84531]?.Voting.abi,
    functionName: "vote",
    args: [attestationId, pollId, BigInt(option)],
  });
};
