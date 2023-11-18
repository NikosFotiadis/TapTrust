import { useState } from "react";
import React from "react";
import type { NextPage } from "next";
import AccountAbstractionChecker from "~~/components/AccountAbstractionChecker";
import { MetaHeader } from "~~/components/MetaHeader";
import Scan from "~~/components/Scan";

// in this page we allow a participant to login with his Halo.
// If the AA has not been created, the user will be prompetd to create one.
// If the AA has been created, the user will be redirected to the logged-in participant page.

const ParticipantPage: NextPage = () => {
  const [haloAddress, setHaloAddress] = useState<string>();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">TapTrust</span>
          </h1>
          <p className="text-center text-lg">Use your HaLo key to find your event tickets</p>

          {haloAddress ? (
            <AccountAbstractionChecker eoaAddress={haloAddress} />
          ) : (
            <Scan
              onScanResult={address => {
                setHaloAddress(address);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

// in this page we allow a participant to login with his Halo.
// If the AA has not been created, the user will logged-in be prompetd

export default ParticipantPage;
