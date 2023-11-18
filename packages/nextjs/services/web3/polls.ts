import { getProvider } from "./ethersSigner";
import { Contract } from "ethers";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export const readEvents = async (contractAddress: string) => {
  const provider = await getProvider();

  const abi = deployedContracts[baseGoerli.id as 84531].Voting.abi;
  const fromBlock = 0;
  const VotingContract = new Contract(contractAddress, abi, provider);

  return await VotingContract.queryFilter("CreatePoll", fromBlock);
};
