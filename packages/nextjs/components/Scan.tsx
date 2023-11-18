import React from "react";
// import Image from "next/image";
import { useMutation } from "wagmi";
import nfcImage from "~~/public/nfc.svg";
import { readHaloAddress } from "~~/services/web3/halo";

interface ScanComponentProps {
  onScanResult: (result: string) => void;
}

const Scan: React.FC<ScanComponentProps> = props => {
  const { onScanResult } = props;

  const { mutate } = useMutation({
    mutationFn: readHaloAddress,
    onSuccess: async data => {
      onScanResult(data);
    },
  });
  return (
    <div className="container border border-gray-500 p-4 flex items-center justify-center flex-col rounded-lg">
    <img src={nfcImage.src} />

    <button onClick={() => mutate()} className="btn w-full btn-primary">
      Scan
    </button>
    </div>
  );
};

export default Scan;
