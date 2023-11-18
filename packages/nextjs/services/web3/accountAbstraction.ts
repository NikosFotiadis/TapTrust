export const generateConterfactualAddress = async (eoaAddress: string): Promise<string> => {
  // TODO: @MichalisG to add implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  return eoaAddress;
};

export const generateCounterfactualAddresses = async (eoaAddresses: string[]): Promise<string[]> => {
  return Promise.all(eoaAddresses.map(generateConterfactualAddress));
};
