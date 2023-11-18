import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useContractRead } from "wagmi";
import { baseGoerli } from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { sendUserOperation, waitForUserOperationTransaction } from "~~/services/web3/accountAbstraction";
import { AttestationData, getAttestationsForAddress } from "~~/services/web3/attestationService";
import { getVotingUoCallData } from "~~/services/web3/voting";

const Vote = () => {
  const params = useParams();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [attestation, setAttestation] = useState<AttestationData>();

  const { data } = useContractRead({
    address: deployedContracts[baseGoerli.id]?.Voting.address,
    abi: deployedContracts[baseGoerli.id]?.Voting.abi,
    functionName: "getPoll",
    args: [params?.pollId as string],
  });

  const handleVote = async () => {
    if (attestation?.id) {
      const uoCallData = getVotingUoCallData(attestation.id, params.pollId as string, Number(selectedOption));

      const uo = await sendUserOperation({
        signerAddress: params.userAddress as string,
        to: deployedContracts[baseGoerli.id].Voting.address,
        data: uoCallData,
        value: BigInt(0),
      });

      const txHash = await waitForUserOperationTransaction(params.userAddress as string, uo.hash);

      alert(txHash);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const getAttestations = async () => {
    const attestations = await getAttestationsForAddress("0x9513f3ECBbE3A53aa05101dDd125C5ccCa52974C");

    setAttestation(attestations.find((att: { eventId: string | string[] }) => att.eventId == params?.eventId));
  };

  useEffect(() => {
    if (params?.eventId) {
      getAttestations();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.eventId]);

  const renderOptions = () => {
    return data?.options.map((option, i) => (
      <div key={i} className="flex items-center mb-4">
        <input type="radio" id={option.name} name="vote" value={i} className="mr-2" />
        <label>{option.name}</label>
      </div>
    ));
  };

  return data ? (
    <div className="text-black max-w-md mx-auto mt-8 bg-white rounded-lg overflow-hidden shadow-md">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{data?.title}</div>
        <div onChange={handleChange}>{renderOptions()}</div>
        <button
          disabled={!selectedOption}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleVote}
        >
          Submit Vote
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="border-t-8 border-blue-500 rounded-full animate-spin h-20 w-20"></div>
    </div>
  );
};

export default Vote;
