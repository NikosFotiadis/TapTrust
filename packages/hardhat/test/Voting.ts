import { expect } from "chai";
import { ethers } from "hardhat";
import { Voting } from "../typechain-types";

describe("Voting", function () {
  // We define a fixture to reuse the same setup in every test.

  let votingContract: Voting;
  const EAS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; //Sepolia
  const AttestationSchema = "0x95e10aa7a515d68dafbfd739b4c9ed7afb40e1fbe8f7a1468501de02fc334c28";
  const Issuer = "0xD5c08CfBe6C6663e0A3203DA8d5CFECbF10116dB";
  const VotedAttestationSchemaId = "0x2b834eed7346ffb38f2ab730d952e63ae64bd91343fdd0457fee1b8d70e357c4";

  before(async () => {
    const VotingFactory = await ethers.getContractFactory("Voting");
    votingContract = (await VotingFactory.deploy(EAS, VotedAttestationSchemaId)) as Voting;
    await votingContract.deployed();
  });

  describe("Deployment", function () {
    it("Should create poll", async function () {
      const [owner] = await ethers.getSigners();
      const endTs = Math.round(Date.now() / 1000) + 100000;
      const tx = await votingContract.createPoll(AttestationSchema, Issuer, "Winners", ["John", "Alice", "Bob"], endTs);

      const receipt = await tx.wait();

      const createPollEvent = receipt.events?.find(({ event }) => event === "CreatePoll");
      const args = createPollEvent?.args;

      expect(args?.creator).to.equal(owner.address);

      const createdPoll = await votingContract.getPoll(args?.id);

      expect(createdPoll.title).to.equal("Winners");
      expect(createdPoll.endTs).to.equal(endTs);

      expect(createdPoll.options[0].name).to.equal("John");
      expect(createdPoll.options[0].votes).to.equal(0);
      expect(createdPoll.options[1].name).to.equal("Alice");
      expect(createdPoll.options[1].votes).to.equal(0);
      expect(createdPoll.options[2].name).to.equal("Bob");
      expect(createdPoll.options[2].votes).to.equal(0);
    });

    it("Should emit event on createPoll", async function () {
      const endTs = Math.round(Date.now() / 1000) + 100000;
      await expect(
        votingContract.createPoll(AttestationSchema, Issuer, "Winners", ["John", "Alice", "Bob"], endTs),
      ).to.emit(votingContract, "CreatePoll");
    });

    it("Should vote", async function () {
      const endTs = Math.round(Date.now() / 1000) + 100000;
      const tx = await votingContract.createPoll(AttestationSchema, Issuer, "Winners", ["John", "Alice", "Bob"], endTs);
      const receipt = await tx.wait();
      const createPollEvent = receipt.events?.find(({ event }) => event === "CreatePoll");
      const args = createPollEvent?.args;

      //Vote for alice
      await votingContract.vote("0x7af16fe4d96545d75f204728d33e0d02cdd65f0282417e786fa3a46a5a13bb3b", args?.id, 1);

      const createdPoll = await votingContract.getPoll(args?.id);
      expect(createdPoll.options[1].votes).to.equal(1);
    });

    it("Should not vote", async function () {
      const endTs = Math.round(Date.now() / 1000) - 1000;
      expect(
        votingContract.createPoll(AttestationSchema, Issuer, "Winners", ["John", "Alice", "Bob"], endTs),
      ).to.be.revertedWith("Vote has ended");
    });
  });
});
