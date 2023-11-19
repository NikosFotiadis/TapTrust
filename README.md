# TapTrust

TapTrust redefines event experiences with NFC & Ethereum's Account Abstraction, offering a unique, etherless way to engage. Each tap with your NFC chip signs transactions & maintains privacy with a fresh, anonymous address.

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- To use the front-end an [ARX](https://arx.org/) Halo chip is required
- In order to generate the file required to multi attest users use the [bulk HaLo scanning app](https://bulk.vrfy.ch/)

## Running locally

- The app is running on Base Goerli test
- If you create your own attestations you need to change the `VALID_ATTESTER` env variable in `.env`

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/NikosFotiadis/TapTrust.git
cd TapTrust
yarn install
```

1. Start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`