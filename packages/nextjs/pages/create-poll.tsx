import React, { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Voting_abi from "~~/services/web3/abis/Voting_abi.json";

const nowInSeconds = () => Math.round(Date.now() / 1000);

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([""]);
  const [duration, setDuration] = useState(0);
  const { address } = useAccount();
  const { isLoading, write } = useContractWrite({
    address: process.env.VOTING_ADDRESS,
    abi: Voting_abi,
    functionName: "createPoll",
  });

  const endTs = nowInSeconds() + duration * 60;

  const handleSubmit = () => {
    write({
      args: [
        // attestationSchema,
        address, //attester
        // eventId,
        title,
        options,
        endTs,
      ],
    });
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      setDuration(Number(event.target.value));
    }
  };

  const handleChangeOptions = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const addOptionInput = () => {
    setOptions([...options, ""]);
  };

  const removeOptionInput = (i: number) => () => {
    if (options.length <= 1) {
      setOptions([""]);
    } else {
      const newOptions = [...options];
      newOptions.splice(i, 1);
      setOptions(newOptions);
    }
  };

  const renderOptionsForm = () => {
    return (
      <div>
        {options.map((option, i) => (
          <div key={i} className="flex">
            <input
              type="text"
              className="input input-bordered w-full max-w-xs mt-4"
              value={options[i]}
              onChange={handleChangeOptions(i)}
            />
            <button className="btn mt-4 bg-red-500" onClick={removeOptionInput(i)}>
              remove
            </button>
          </div>
        ))}
        <div className="w-full flex mt-4 mb-4">
          <button className="btn max-w-xs bg-blue-400" onClick={addOptionInput}>
            Add Option
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={title}
          onChange={handleChangeTitle}
        />
        <label className="label">
          <span className="label-text">Options</span>
        </label>
        {renderOptionsForm()}
        <label className="label">
          <span className="label-text">Duration (minutes)</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={duration}
          onChange={handleChangeDuration}
        />
        <div className="w-full flex mt-4 mb-4">
          <button className="btn w-full max-w-xs bg-blue-400" onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Create Poll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
