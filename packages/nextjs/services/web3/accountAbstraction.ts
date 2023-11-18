import { sign, signEIP712 } from "./halo";
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SignTypedDataParams } from "@alchemy/aa-core";
import type { Address } from "abitype";
import { type Hex } from "viem";
import { baseGoerli } from "viem/chains";

const chain = baseGoerli;

/**
 * A signer that can sign messages and typed data.
 *
 * @template Inner - the generic type of the inner client that the signer wraps to provide functionality such as signing, etc.
 *
 * @var signerType - the type of the signer (e.g. local, hardware, etc.)
 * @var inner - the inner client of @type {Inner}
 *
 * @method getAddress - get the address of the signer
 * @method signMessage - sign a message
 * @method signTypedData - sign typed data
 */
export interface SmartAccountSigner<Inner = any> {
  signerType: string;
  inner: Inner;

  getAddress: () => Promise<Address>;

  signMessage: (msg: Uint8Array | Hex | string) => Promise<Hex>;

  signTypedData: (params: SignTypedDataParams) => Promise<Hex>;
}

const getHaloSigner = (haloAddress: string): SmartAccountSigner => {
  return {
    signerType: "halo",
    inner: haloAddress,

    getAddress: async () => haloAddress,

    signMessage: async (msg: Uint8Array | Hex | string) => sign(msg),

    signTypedData: async (params: SignTypedDataParams) => signEIP712(params),
  };
};

export const getSmartAccount = async (owner: string) => {
  // Create a provider to send user operations from your smart account
  const provider = new AlchemyProvider({
    // get your Alchemy API key at https://dashboard.alchemy.com
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chain,
  } as any).connect(
    rpcClient =>
      new LightSmartContractAccount({
        rpcClient,
        owner: getHaloSigner(owner),
        chain,
        factoryAddress: getDefaultLightAccountFactoryAddress(chain as any),
      } as any),
  );

  return provider;
};

export const generateCounterfactualAddress = async (eoaAddress: string): Promise<string> => {
  // TODO: @MichalisG to add implementation
  const aaAddress = await getSmartAccount(eoaAddress);
  return await aaAddress.getAddress();
};

export const generateCounterfactualAddresses = async (eoaAddresses: string[]): Promise<string[]> => {
  return Promise.all(eoaAddresses.map(generateCounterfactualAddress));
};

export const isAccountDeployed = async (eoaAddress: string) => {
  // TODO @MichalisG to add implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  const aaAddress = await generateCounterfactualAddress(eoaAddress);

  return aaAddress;
};

export const sendUserOperation = async (options: { signerAddress: string; to: string; value: bigint; data: string }) => {
  const provider = await getSmartAccount(options.signerAddress);

  // Find your Gas Manager policy id at:
  //dashboard.alchemy.com/gas-manager/policy/create
  const GAS_MANAGER_POLICY_ID = "29327ccf-1135-458d-bb40-2e32fa0e4c2d";

  // Link the provider with the Gas Manager. This ensures user operations
  // sent with this provider get sponsorship from the Gas Manager.
  provider.withAlchemyGasManager({
    policyId: GAS_MANAGER_POLICY_ID,
  });

  // Here's how to send a sponsored user operation from your smart account:
  const result= await provider.sendUserOperation({
    target: options.to,
    data: options.data as `0x${string}`,
  });

  console.log(result.hash);

  return result;
};

export const waitForUserOperationTransaction = async (eoaAddress: string, uoHash: string) => {
  const smartAccount = await getSmartAccount(eoaAddress);

  const txHash = await smartAccount.waitForUserOperationTransaction(uoHash as `0x${string}`);

  return txHash;
};
