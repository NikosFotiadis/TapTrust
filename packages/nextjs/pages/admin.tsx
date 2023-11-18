import { useState } from "react";
import React from "react";
import type { NextPage } from "next";
import { useMutation } from "wagmi";
import { z } from "zod";
import { MetaHeader } from "~~/components/MetaHeader";
import { createAttestation } from "~~/services/web3/attestationService";
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
  const [loading, setLoading] = useState(false);

  const { mutate, status } = useMutation({
    mutationFn: registerAddresses,
  });

  const handleChangeEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    createAttestation(eventName);
    setLoading(false);
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">TapTrust</span>
          </h1>
          <p className="text-center text-lg">To get started, upload a list of HaLo addresses</p>
          <FileReadComponent
            transformFunction={schema => Object.values(schema).map(entry => entry.address)}
            addresses={eoaAddresses}
            onAddressesChange={setEoaAddresses}
          />

          {eoaAddresses.length > 0 && (
            <div className="flex flex-col items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  // console.log("eoaAddresses", eoaAddresses);
                  mutate(eoaAddresses);
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
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Create a new event</span>
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
    </>
  );
};

export default AdminPage;
