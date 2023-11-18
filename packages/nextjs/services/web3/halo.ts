import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";

export const readHaloAddress = async () => {
  const command = {
    name: "get_pkeys",
  };

  let res;

  try {
    // --- request NFC command execution ---
    res = await execHaloCmdWeb(command);

    const address = res.etherAddresses[1];
    // the command has succeeded, display the result to the user

    if (!address) {
      throw new Error("No address found");
    }

    alert(`Address: ${address}`);
    return address;
  } catch (e) {
    // the command has failed, display error to the user
    alert("Error: " + String(e));
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sign = async (message: any) => {
  const cmd = {
    name: "sign",
    message: message,
    format: 'text',
    keyNo: 1,
  };

  try {
    // --- request NFC command execution ---
    const res = await execHaloCmdWeb(cmd);

    // alert(`Signed: ${JSON.stringify(res, null, 2)}`);
    alert(`Signed hex: ${res.signature.ether}`);
    return res.signature.ether;
  } catch (e) {
    // the command has failed, display error to the user
    alert("Error: " + String(e));
  }
};

export const signEIP712 = async (message: any) => {
  const cmd = {
    name: "sign",
    keyNo: 1,
    typedData: {
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      types: {
        Person: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "wallet",
            type: "address",
          },
        ],
        Mail: [
          {
            name: "from",
            type: "Person",
          },
          {
            name: "to",
            type: "Person",
          },
          {
            name: "contents",
            type: "string",
          },
        ],
      },
      value: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: message,
      },
    },
  };

  try {
    // --- request NFC command execution ---
    const res = await execHaloCmdWeb(cmd);

    alert(`Signed EIP 712: ${JSON.stringify(res, null, 2)}`);
    return res;
  } catch (e) {
    // the command has failed, display error to the user
    alert("Error: " + String(e));
  }
};
