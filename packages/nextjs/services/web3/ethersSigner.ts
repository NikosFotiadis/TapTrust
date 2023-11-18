import { type PublicClient, type WalletClient, getPublicClient, getWalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { type HttpTransport } from "viem";
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

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export const getSigner = async () => {
  const walletClient = await getWalletClient();

  // @ts-ignore
  const signer = walletClientToSigner(walletClient);

  return signer;
};

export const getProvider = async () => {
  const publicClient = await getPublicClient();
  const provider = publicClientToProvider(publicClient);

  return provider;
};
