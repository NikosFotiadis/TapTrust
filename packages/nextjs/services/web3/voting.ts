import { encodeFunctionData } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

export const getVotingUoCallData = (attestationId: string, pollId: string, option: number) => {
  return encodeFunctionData({
    abi: deployedContracts[84531].Voting.abi,
    functionName: "vote",
    args: [attestationId, pollId, BigInt(option)],
  });
};
