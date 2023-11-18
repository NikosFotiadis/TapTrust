export const createAttestationForAddress = async (address: string, attestation: any): Promise<void> => {
  // TODO: @NikosFotiadis to add implementation
  console.log(`Creating attestation for address ${address} with attestation ${attestation}`);

  await new Promise(resolve => setTimeout(resolve, 1000));
  return;
};
