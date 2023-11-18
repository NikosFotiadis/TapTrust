import { type WalletClient, getWalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { sepolia } from "wagmi/chains";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain = sepolia, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
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
