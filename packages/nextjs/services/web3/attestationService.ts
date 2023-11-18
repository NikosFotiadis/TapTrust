import { getSigner } from "./ethersSigner";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
// const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
// const resolverAddress = "0x0000000000000000000000000000000000000000"; // Sepolia 0.26

const createAttendeeSchemaData = ({ eventId, eventName }: { eventId: string; eventName: string }): any => {
  const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
  return schemaEncoder.encodeData([
    { name: "eventId", value: eventId, type: "uint256" },
    { name: "name1", value: eventName, type: "string" },
  ]);
};

const attestationTypes = {
  organizer: {},
  attendee: {
    schema: "uint256 eventId, string name1",
    schemaUID: "0x1822e2a3710a4d41f221a1aecd14fb9cbea5d3341b3373d4e3682e3860741197",
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
  // TODO: @NikosFotiadis to add implementation
  console.log(`Creating attestation for addresses ${addresses} with attestation ${attestation}`);

  await _createMultiAttestation(addresses, attestation, { eventId: "1", eventName: "ev1" });
  return;
};
