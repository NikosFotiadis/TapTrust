/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getProvider, getSigner } from "./ethersSigner";
import { Attestation, EAS, SchemaEncoder, SchemaRecord, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { Contract } from "ethers";
import externalContracts from "~~/contracts/externalContracts";

const EASContractAddress = "0x4200000000000000000000000000000000000021";
const schemaRegistryContractAddress = "0x4200000000000000000000000000000000000020";
const resolverAddress = "0x0000000000000000000000000000000000000000";
export const schemaUID = "0x95e10aa7a515d68dafbfd739b4c9ed7afb40e1fbe8f7a1468501de02fc334c28";

const createAttendeeSchemaData = ({ eventId, eventName }: { eventId: string; eventName: string }): any => {
  const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
  return schemaEncoder.encodeData([
    { name: "eventId", value: eventId, type: "uint256" },
    { name: "name1", value: eventName, type: "string" },
    { name: "role1", value: "roleAt", type: "string" },
  ]);
};

const createOrganizerSchemaData = ({ eventId, eventName }: { eventId: string; eventName: string }): any => {
  const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
  return schemaEncoder.encodeData([
    { name: "eventId", value: eventId, type: "uint256" },
    { name: "name1", value: eventName, type: "string" },
    { name: "role1", value: "roleOr", type: "string" },
  ]);
};

const attestationTypes = {
  organizer: {
    schema: "uint256 eventId1, string name1, string role1",
    schemaFactory: createOrganizerSchemaData,
  },
  attendee: {
    schema: "uint256 eventId, string name1, string role1",
    schemaFactory: createAttendeeSchemaData,
  },
};

const _createMultiAttestation = async (addresses: string[], attestationType: string, schemaData: any) => {
  const signer = await getSigner();
  const eas = new EAS(EASContractAddress);
  // @ts-ignore
  eas.connect(signer);

  // @ts-ignore
  const attData = attestationTypes[attestationType].schemaFactory(schemaData);
  const data = addresses.map(address => {
    return {
      recipient: address,
      revocable: true,
      data: attData,
    };
  });

  const tx = await eas.multiAttest([
    {
      schema: schemaUID,
      data: data,
    },
  ]);

  await tx.wait();
};

export const fetchAttestation = async (attestationId: string): Promise<Attestation> => {
  const signer = await getSigner();
  const eas = new EAS(EASContractAddress);
  // @ts-ignore
  eas.connect(signer);

  return eas.getAttestation(attestationId);
};

export const fetchAttestationSchema = async (schemaId: string): Promise<SchemaRecord> => {
  const signer = await getSigner();
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  // @ts-ignore
  schemaRegistry.connect(signer);

  return await schemaRegistry.getSchema({ uid: schemaId });
};

export const createMultiAttestation = async (addresses: string[], attestation: string): Promise<void> => {
  console.log(`Creating attestation for addresses ${addresses} with attestation ${attestation}`);

  await _createMultiAttestation(addresses, attestation, { eventId: "2", eventName: "ev2" });
  // await createAttestationSchema();
  return;
};

export const getAttestationsForAddress = async (userAddress: string) => {
  const provider = await getProvider();

  const address = externalContracts[1].EAS.address;
  const abi = externalContracts[1].EAS.abi;
  const fromBlock = externalContracts[1].EAS.deployedAt;
  const EASInstance = new Contract(address, abi, provider);

  const attested = await EASInstance.queryFilter("Attested", fromBlock);

  return attested.filter(event => {
    return event.args!.recipient === userAddress && event.args!.schema === schemaUID;
  });
};

// Return all the attestations where you are the organizer
export const getOrganizerAttestationsForAddress = async (userAddress: string) => {
  const provider = await getProvider();

  const address = externalContracts[1].EAS.address;
  const abi = externalContracts[1].EAS.abi;
  const fromBlock = externalContracts[1].EAS.deployedAt;
  const EASInstance = new Contract(address, abi, provider);

  const attested = await EASInstance.queryFilter("Attested", fromBlock);

  // Events for which you self attested are the ones where you are the organizer
  const res = attested.filter(event => {
    return (
      event.args!.recipient === userAddress && event.args!.schema === schemaUID && event.args!.attester === userAddress
    );
  });

  return res;
};

const createAttestationSchema = async () => {
  const signer = await getSigner();
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  // @ts-ignore
  schemaRegistry.connect(signer);

  const revocable = false;

  const transaction = await schemaRegistry.register({
    schema: "bytes32 pollId",
    resolverAddress,
    revocable,
  });

  // Optional: Wait for transaction to be validated
  await transaction.wait();
};

export const createAttestation = async (eventName: string) => {
  const signer = await getSigner();
  const eas = new EAS(EASContractAddress);
  // @ts-ignore
  eas.connect(signer);

  const schemaData = createOrganizerSchemaData({ eventId: Math.floor(Math.random() * 10000).toString(), eventName });

  await eas.attest({
    schema: schemaUID,
    data: {
      recipient: await signer.getAddress(),
      revocable: false,
      data: schemaData,
    },
  });
};
