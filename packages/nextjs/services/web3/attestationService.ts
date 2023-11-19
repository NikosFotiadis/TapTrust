/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getProvider, getSigner } from "./ethersSigner";
import { Attestation, EAS, SchemaEncoder, SchemaRecord, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { watchContractEvent } from "@wagmi/core";
import { Contract } from "ethers";
import externalContracts from "~~/contracts/externalContracts";
import ScaffoldConfig from "~~/scaffold.config";

const EASContractAddress = "0x4200000000000000000000000000000000000021";
const schemaRegistryContractAddress = "0x4200000000000000000000000000000000000020";
export const schemaUID = "0xf27cbff99bcd84cf8368fe95ab175243c00667f2c414648dda70fe6b5b8378ee";
export const validAttester = ScaffoldConfig.validAttester;

export const ROLES = {
  organizer: "Organizer",
  attendee: "Attendee",
};

export type AttestationData = {
  eventId: string;
  eventName: string;
  role: string;
  attester: string;
  recipient: string;
  id: string;
};

const createAttendeeSchemaData = ({ eventId, eventName }: { eventId: string; eventName: string }): any => {
  const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
  return schemaEncoder.encodeData([
    { name: "eventId", value: eventId, type: "uint256" },
    { name: "name", value: eventName, type: "string" },
    { name: "role", value: ROLES.attendee, type: "string" },
  ]);
};

const createOrganizerSchemaData = ({ eventId, eventName }: { eventId: string; eventName: string }): any => {
  const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
  return schemaEncoder.encodeData([
    { name: "eventId", value: eventId, type: "uint256" },
    { name: "name", value: eventName, type: "string" },
    { name: "role", value: ROLES.organizer, type: "string" },
  ]);
};

const attestationTypes = {
  organizer: {
    schema: "uint256 eventId, string name, string role",
    schemaFactory: createOrganizerSchemaData,
  },
  attendee: {
    schema: "uint256 eventId, string name, string role",
    schemaFactory: createAttendeeSchemaData,
  },
};

const _createMultiAttestation = async (addresses: string[], attestationType: string, schemaData: any) => {
  console.log("file: attestationService.ts:59 -> addresses:", addresses);
  console.log("file: attestationService.ts:59 -> attestationType:", attestationType);
  console.log("file: attestationService.ts:59 -> schemaData:", schemaData);
  const signer = await getSigner();
  const eas = new EAS(EASContractAddress);
  // @ts-ignore
  eas.connect(signer);

  // @ts-ignore
  const attData = attestationTypes[attestationType].schemaFactory(schemaData);
  const data = addresses.map(address => {
    return {
      recipient: address,
      revocable: false,
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

export const createMultiAttestation = async (
  addresses: string[],
  attestation: string,
  eventName: string,
  eventId: string,
): Promise<void> => {
  await _createMultiAttestation(addresses, attestation, { eventId, eventName });
};

export const getAttestationsForAddress = async (userAddress: string): Promise<AttestationData[]> => {
  const provider = await getProvider();

  const address = externalContracts[1].EAS.address;
  const abi = externalContracts[1].EAS.abi;
  const fromBlock = externalContracts[1].EAS.deployedAt;
  const EASInstance = new Contract(address, abi, provider);

  const attested = await EASInstance.queryFilter("Attested", fromBlock);

  const filtered = attested.filter(event => {
    return event.args!.recipient === userAddress && event.args!.schema === schemaUID;
  });

  return await Promise.all(
    filtered.map(async attestation => {
      const attestationId = attestation.args?.uid;
      const attestationDetails = await EASInstance.getAttestation(attestationId);

      const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
      const decoded = schemaEncoder.decodeData(attestationDetails.data);

      const eventId = decoded.find(({ name }) => name === "eventId")!.value.value as string;
      const eventName = decoded.find(({ name }) => name === "name")!.value.value as string;
      const role = decoded.find(({ name }) => name === "role")!.value.value as string;

      const attestationItem: AttestationData = {
        eventId,
        eventName,
        role,
        attester: attestation.args!.attester,
        recipient: attestation.args!.recipient,
        id: attestationId,
      };

      return attestationItem;
    }),
  );
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
  const filtered = attested.filter(event => {
    return (
      event.args!.recipient === userAddress && event.args!.schema === schemaUID && event.args!.attester === userAddress
    );
  });

  return await Promise.all(
    filtered.map(async attestation => {
      const attestationId = attestation.args!.uid;
      const attestationDetails = await EASInstance.getAttestation(attestationId);

      const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
      const decoded = schemaEncoder.decodeData(attestationDetails.data);

      const eventId = decoded.find(({ name }) => name === "eventId")!.value.value as string;
      const eventName = decoded.find(({ name }) => name === "name")!.value.value as string;
      const role = decoded.find(({ name }) => name === "role")!.value.value as string;

      const attestationItem: AttestationData = {
        eventId,
        eventName,
        role,
        attester: attestation.args!.attester,
        recipient: attestation.args!.recipient,
        id: attestationId,
      };

      return attestationItem;
    }),
  );
};

export const watchOrganizerEventsForAddress = async (
  userAddress: string,
  callback: (attestationItem: AttestationData) => void,
) => {
  const address = externalContracts[1].EAS.address;
  const abi = externalContracts[1].EAS.abi;

  watchContractEvent(
    {
      address,
      abi,
      eventName: "Attested",
    },
    async event => {
      if (event[0].args.attester === event[0].args.attester && event[0].args.attester === userAddress) {
        const provider = await getProvider();
        const EASInstance = new Contract(address, abi, provider);
        const attestationDetails = await EASInstance.getAttestation(event[0].args.uid);

        const schemaEncoder = new SchemaEncoder(attestationTypes.attendee.schema);
        const decoded = schemaEncoder.decodeData(attestationDetails.data);

        const eventId = decoded.find(({ name }) => name === "eventId")!.value.value as string;
        const eventName = decoded.find(({ name }) => name === "name")!.value.value as string;
        const role = decoded.find(({ name }) => name === "role")!.value.value as string;

        const attestationItem: AttestationData = {
          eventId,
          eventName,
          role,
          attester: event[0].args.attester,
          recipient: event[0].args.recipient!,
          id: event[0].args.uid!,
        };

        callback(attestationItem);
      }
    },
  );
};

// const createAttestationSchema = async () => {
//   const signer = await getSigner();
//   const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

//   // @ts-ignore
//   schemaRegistry.connect(signer);

//   const revocable = false;

//   const transaction = await schemaRegistry.register({
//     schema: "uint256 eventId, string name, string role",
//     resolverAddress: "0x0000000000000000000000000000000000000000",
//     revocable,
//   });

//   // Optional: Wait for transaction to be validated
//   await transaction.wait();
// };

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
