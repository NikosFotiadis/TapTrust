import { getSigner } from "./ethersSigner";
import { EAS, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const resolverAddress = "0x0000000000000000000000000000000000000000"; // Sepolia 0.26

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
    schemaUID: "0x95e10aa7a515d68dafbfd739b4c9ed7afb40e1fbe8f7a1468501de02fc334c28",
    schemaFactory: createOrganizerSchemaData,
  },
  attendee: {
    schema: "uint256 eventId, string name1, string role1",
    schemaUID: "0x95e10aa7a515d68dafbfd739b4c9ed7afb40e1fbe8f7a1468501de02fc334c28",
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
      // @ts-ignore
      schema: attestationTypes[attestationType].schemaUID,
      data: data,
    },
  ]);

  await tx.wait();
};

export const createMultiAttestation = async (addresses: string[], attestation: string): Promise<void> => {
  console.log(`Creating attestation for addresses ${addresses} with attestation ${attestation}`);

  await _createMultiAttestation(addresses, attestation, { eventId: "1", eventName: "ev1" });
  return;
};

const createAttestationSchema = async () => {
  const signer = await getSigner();
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  // @ts-ignore
  schemaRegistry.connect(signer);

  const revocable = true;

  const transaction = await schemaRegistry.register({
    schema: "uint256 eventId, string name1, string role1",
    resolverAddress,
    revocable,
  });

  // Optional: Wait for transaction to be validated
  await transaction.wait();
};
