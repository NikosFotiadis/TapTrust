import "abitype";
import "viem";

// this is necessary until we complete the migration to viem
declare module "abitype" {
  export interface Config {
    AddressType: string;
    Address: string;

    BytesType: {
      inputs: string;
      outputs: string;
    };

    Hash: string;
    
    Chain: string;
  }
}

declare module "viem/node_modules/abitype" {
  export interface Config {
    AddressType: string;
    Address: string;

    BytesType: {
      inputs: string;
      outputs: string;
    };

    Hash: string;
    
    Chain: string;
  }
}

declare module "viem" {
  export interface Config {
    AddressType: string;
    Address: string;

    BytesType: {
      inputs: string;
      outputs: string;
    };

    Hash: string;
    
    Chain: string;
  }
}
