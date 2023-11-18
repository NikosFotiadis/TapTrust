import { getProvider, getSigner } from "./ethersSigner";
import { Contract } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { baseGoerli } from "wagmi/chains";

export const readEvents = async (contractAddress: string) => {
  const provider = await getProvider();

  const abi = deployedContracts[baseGoerli.id].Voting.abi
  const fromBlock = deployedContracts[baseGoerli.id].Voting.deployedAt
  const VotingContract = new Contract(contractAddress, abi, provider);

  return await VotingContract.queryFilter("CreatePoll", fromBlock);
};
