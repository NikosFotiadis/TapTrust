import { encodeFunctionData } from "viem";
import Voting_abi from "~~/services/web3/abis/Voting_abi.json";

export const getVotingUoCallData = (attestationId: string, pollId: string, option: number) => {
  return encodeFunctionData({
    abi: Voting_abi,
    functionName: "vote",
    args: [attestationId, pollId, option],
  });
};
