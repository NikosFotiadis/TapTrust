export const generateCounterfactualAddress = async (eoaAddress: string): Promise<string> => {
  // TODO: @MichalisG to add implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  return eoaAddress;
};

export const generateCounterfactualAddresses = async (eoaAddresses: string[]): Promise<string[]> => {
  return Promise.all(eoaAddresses.map(generateCounterfactualAddress));
};

export const deploySmartAccount = async (forEoa: string) => {
  // TODO @MichalisG to add implementation

  console.log("deploySmartAccount", forEoa);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "0x1234567890123456789012345678901234567890";
};

export const isAccountDeployed = async (eoaAddress: string) => {
  // TODO @MichalisG to add implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  const aaAddress = await generateCounterfactualAddress(eoaAddress);

  return aaAddress;
};
