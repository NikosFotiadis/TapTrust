import { type WalletClient, getWalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { baseGoerli } from "wagmi/chains";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain = baseGoerli, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  return signer;
}

export const getSigner = async () => {
  const walletClient = await getWalletClient();

  // @ts-ignore
  const signer = walletClientToSigner(walletClient);

  return signer;
};
