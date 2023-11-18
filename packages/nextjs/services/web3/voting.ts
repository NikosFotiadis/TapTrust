import { encodeFunctionData } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

export const getVotingUoCallData = (attestationId: string, pollId: string, option: number) => {
  return encodeFunctionData({
    abi: deployedContracts[31337].Voting.abi,
    functionName: "vote",
    args: [attestationId, pollId, BigInt(option)],
  });
};
