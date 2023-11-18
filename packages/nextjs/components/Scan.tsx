import React from "react";
import { useMutation } from "wagmi";
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
    <button onClick={() => mutate()} className="btn">
      Scan
    </button>
  );
};

export default Scan;
