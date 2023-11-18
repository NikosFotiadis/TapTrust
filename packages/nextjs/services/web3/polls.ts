import { getProvider } from "./ethersSigner";
import { Contract } from "ethers";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export const readPollsForEvent = async (contractAddress: string, eventId: string) => {
  const provider = await getProvider();

  const abi = deployedContracts[baseGoerli.id as 84531].Voting.abi;
  const fromBlock = 0;
  const VotingContract = new Contract(contractAddress, abi, provider);

  const allPools = await VotingContract.queryFilter("CreatePoll", fromBlock);

  const withDetails = await Promise.all(
    allPools.map(async event => {
      const details = await VotingContract.getPoll(event.args!.id);

      return {
        attestationSchemaId: details.attestationSchemaId,
        attester: details.attester,
        endTs: details.endTs,
        eventId: details.eventId,
        options: details.options,
        title: details.title,
        id: event.args!.id,
      };
    }),
  );

  const filtered = withDetails.filter(item => item.eventId.toString() === eventId);

  return filtered;
};
