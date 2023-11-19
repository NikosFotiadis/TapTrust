import { useCallback, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useMutation } from "wagmi";
import { z } from "zod";
import { Header } from "~~/components/Header";
import { MetaHeader } from "~~/components/MetaHeader";
import {
  AttestationData,
  createAttestation,
  getOrganizerAttestationsForAddress,
  watchOrganizerEventsForAddress,
} from "~~/services/web3/attestationService";
import { registerAddresses } from "~~/services/web3/registerAddresses";

const publicKeySchema = z.object({
  primaryPublicKeyRaw: z.string(),
  primaryPublicKeyHash: z.string(),
  secondaryPublicKeyHash: z.string().nullable(),
  tertiaryPublicKeyHash: z.string().nullable(),
  address: z.string(),
  edition_number: z.number(),
});

const jsonSchema = z.record(publicKeySchema);

// You can use jsonSchema to parse and validate your JSON data.

interface FileReadComponentProps {
  transformFunction: (data: z.infer<typeof jsonSchema>) => string[];
  addresses: string[];
  onAddressesChange: (addresses: string[]) => void;
}

const FileReadComponent: React.FC<FileReadComponentProps> = props => {
  const { transformFunction, addresses, onAddressesChange } = props;

  const handleFileRead = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target?.result;
        try {
          const json = JSON.parse(text as string);
          const transformedData = transformFunction(json);
          onAddressesChange(transformedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileRead} accept="application/JSON" />
      <ul className="rounded-xl ring-1 p-4 my-4">
        {addresses.map((item, index) => (
          <li key={index}>
            <code>{item}</code>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AdminPage: NextPage = () => {
  const [eoaAddresses, setEoaAddresses] = useState<string[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [newAttestationEventName, setNewAttestationEventName] = useState<string>("");
  const [newAttestationEventId, setNewAttestationEventId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState<AttestationData[]>([]);

  const account = useAccount();

  const { mutate, status } = useMutation({
    mutationFn: registerAddresses,
  });

  const handleChangeEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value);
  };

  const handleChangeNewAttestationEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAttestationEventName(event.target.value);
  };

  const handleChangeNewAttestationEventId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAttestationEventId(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    createAttestation(eventName);
    setLoading(false);
  };

  const onNewEvent = (newEvent: AttestationData) => {
    setOrganizerEvents(currEvents => {
      return [newEvent, ...currEvents];
    });
  };

  const updateOrganizerEvents = useCallback(async (userAddress: string) => {
    setLoadingEvents(true);
    const events = await getOrganizerAttestationsForAddress(userAddress);

    if (events.length === 0) {
      setLoadingEvents(false);

      return;
    }

    setOrganizerEvents(events);
    watchOrganizerEventsForAddress(userAddress, onNewEvent);
  }, []);

  useEffect(() => {
    if (account.address) {
      updateOrganizerEvents(account.address);
    }
  }, [account.address, updateOrganizerEvents]);

  useEffect(() => {
    if (organizerEvents.length) {
      setLoadingEvents(false);
    }
  }, [organizerEvents]);

  return (
    <>
      <Header />
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex mb-24">
          <div className="flex-6">
            <h1 className="text-center mb-8">
              <span className="block text-4xl font-bold">Add user attestations for event</span>
            </h1>
            <p className="text-center text-lg">To get started, upload a list of HaLo addresses</p>
            <FileReadComponent
              transformFunction={schema => Object.values(schema).map(entry => entry.address)}
              addresses={eoaAddresses}
              onAddressesChange={setEoaAddresses}
            />

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Event Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={handleChangeNewAttestationEventName}
                value={newAttestationEventName}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Event ID</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={handleChangeNewAttestationEventId}
                value={newAttestationEventId}
              />
            </div>

            {eoaAddresses.length > 0 && (
              <div className="flex flex-col items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    // console.log("eoaAddresses", eoaAddresses);
                    mutate({ eoaAddresses, newAttestationEventName, newAttestationEventId });
                  }}
                >
                  {
                    {
                      idle: "Register Halo Addresses",
                      loading: "Registering...",
                      error: "Error",
                      success: "Success",
                    }[status]
                  }
                </button>
              </div>
            )}
          </div>
          <div className="flex-6 pl-32">
            <h1 className="text-center mb-8">
              <span className="block text-4xl font-bold mb-8">Create a new event</span>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={eventName}
                onChange={handleChangeEventName}
              />
              <div className="w-full flex mt-4 mb-4">
                <button className="btn w-full max-w-xs bg-blue-400" onClick={handleSubmit}>
                  {loading ? "Loading..." : "Create Event"}
                </button>
              </div>
            </h1>
          </div>
        </div>
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl w-4/5"
        >
          {loadingEvents ? (
            <div className="flex items-center justify-center pt-20 pb-20">
              <div className="border-t-8 border-blue-500 rounded-full animate-spin h-20 w-20"></div>
            </div>
          ) : (
            organizerEvents.map(attestation => (
              <li
                key={attestation.id}
                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
              >
                <div className="flex min-w-0 gap-x-4 gap-y-4">
                  <div className="min-w-8 flex-auto">
                    <p className="text-xs font-medium leading-6 text-gray-600">Event Name</p>
                    <p className="text-xl font-semibold leading-6 text-gray-900">
                      <Link href={`/admin/events/${attestation.eventId}/polls/create`}>{attestation.eventName}</Link>
                    </p>

                    <p className="text-xs font-medium leading-6 text-gray-600">Event Role</p>
                    <p className="text-xl font-semibold leading-6 text-gray-900">{attestation.role}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default AdminPage;
