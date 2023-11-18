//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { IEAS, AttestationRequest, AttestationRequestData, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

contract Voting {
	error InvalidEAS();

	struct PollOption {
		string name;
		uint256 votes;
	}

	struct Poll {
		string title;
		PollOption[] options;
		uint256 endTs;
		bytes32 attestationSchemaId;
		uint256 eventId;
		address attester;
	}

	mapping(bytes32 => Poll) polls;
	IEAS private immutable _eas;
	bytes32 private immutable _votedAttestationSchemaId;
	mapping(bytes32 => mapping(address => bool)) hasVoted;

	event CreatePoll(
		address indexed creator,
		bytes32 id
	);

	/// @param eas The address of the global EAS contract.
	constructor(IEAS eas, bytes32 votedAttestationSchemaId) {
		if (address(eas) == address(0)) {
			revert InvalidEAS();
		}

		_eas = eas;
		_votedAttestationSchemaId = votedAttestationSchemaId;
	}

	function createPollId(address creator) view internal returns(bytes32) {
		return keccak256(abi.encodePacked(creator, block.number));
	}

	function createPoll(bytes32 attestationSchema, address attester, uint256 eventId, string calldata title, string[] memory options, uint256 endTs) public {
		bytes32 pollId = createPollId(msg.sender);
		Poll storage poll = polls[pollId];
		PollOption[] storage pollOptions = poll.options;

		for(uint8 i; i<options.length; i++) {
			pollOptions.push(PollOption(options[i], 0));
		}

		poll.title = title;
		poll.endTs = endTs;
		poll.attestationSchemaId = attestationSchema;
		poll.attester = attester;
		poll.eventId = eventId;

		emit CreatePoll(msg.sender, pollId);
	}

	function getPoll(bytes32 pollId) view public returns(Poll memory) {
		Poll memory poll = polls[pollId];
	
		return poll;
	}

	function isValidVoter(bytes32 attestationId, bytes32 pollId) view internal returns(bool) {
		bool isValid = _eas.isAttestationValid(attestationId);
		require(isValid, 'Attestation is not valid');
		Attestation memory attestation = _eas.getAttestation(attestationId);
		(uint256 eventId, string memory _name, string memory _role) = abi.decode(attestation.data, (uint256, string, string));
		require(attestation.schema == polls[pollId].attestationSchemaId, 'Wrong schema');
		require(attestation.attester == polls[pollId].attester, 'Wrong attester');
		require(eventId == polls[pollId].eventId, 'Wrong event');

		return true;
	}

	function attestVote(address recipient, bytes32 pollId) internal returns (bytes32) {
		return
			_eas.attest(
			AttestationRequest({
					schema: _votedAttestationSchemaId,
					data: AttestationRequestData({
						recipient: recipient,
						expirationTime: NO_EXPIRATION_TIME, // No expiration time
						revocable: false,
						refUID: EMPTY_UID, // No references UI
						data: abi.encode(pollId),
						value: 0 // No value/ETH
					})
			})
		);
	}

	function vote(bytes32 attestationId, bytes32 pollId, uint256 option) public {
		require(hasVoted[pollId][msg.sender] == false, 'Already voted');
		require(polls[pollId].endTs > block.timestamp, 'Vote has ended');

		require(isValidVoter(attestationId, pollId), 'Invalid account');

		polls[pollId].options[option].votes += 1;
		hasVoted[pollId][msg.sender] = true;
		attestVote(msg.sender, pollId);
	}

	function getWinner(bytes32 pollId) view public returns(string memory, uint256) {
		Poll memory _poll = polls[pollId];
		require(block.timestamp > _poll.endTs);
		uint256 winner;

		//Todo handle equality
		for(uint8 i; i < _poll.options.length; i++) {
			if(_poll.options[i].votes > _poll.options[winner].votes) {
				winner = i;
			}
		}

		return (_poll.options[winner].name, _poll.options[winner].votes);
	}
}
