import { generateCounterfactualAddresses } from "./accountAbstraction";
import { createMultiAttestation } from "./attestationService";

export const registerAddresses = async (eoaAddresses: string[]): Promise<void> => {
  // first step, we calculate all the counterfactual addresses
  const counterfactualAddresses = await generateCounterfactualAddresses(eoaAddresses);

  // second step, we register all the counterfactual addresses
  await createMultiAttestation(counterfactualAddresses, "attendee");
};
