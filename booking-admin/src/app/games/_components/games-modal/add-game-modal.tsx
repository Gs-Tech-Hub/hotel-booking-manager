import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { strapiService } from "@/utils/dataEndPoint";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    playerName: string;
    count: number;
    amountPaid: number;
    gameStatus: string;
  }) => void;
  defaultData?: {
    documentId: string;
    playerName: string;
    count: number;
    amountPaid: number;
    gameStatus: string;
  };
}

export function AddGameModal({
  isOpen,
  onClose,
  onSubmit,
  defaultData,
}: AddGameModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [count, setCount] = useState(1);
  const [amountPaid, setAmountPaid] = useState(500);
  const [gameStatus, setGameStatus] = useState("ongoing"); // Default status

  useEffect(() => {
    if (defaultData) {
      setPlayerName(defaultData.playerName);
      setCount(defaultData.count);
      setAmountPaid(defaultData.amountPaid);
      setGameStatus(defaultData.gameStatus);
    }
  }, [defaultData]);

  const handleSubmit = async () => {
    if (!playerName.trim()) return alert("Player name is required");
  
    const gamePayload = {
      playerName,
      count,
      amountPaid,
      gameStatus,
    };
  
    try {
      if (defaultData?.documentId) {
        // Update existing game
        await strapiService.updateGame(defaultData.documentId, gamePayload);
      }
      // Reset form
      setPlayerName("");
      setCount(0);
      setAmountPaid(0);
      setGameStatus("ongoing");
  
      onSubmit(gamePayload); // refresh UI or reload game list
      onClose();  // close the modal or form
    } catch (error) {
      console.error("Failed to submit game:", error);
      alert("Failed to save game. Please try again.");
    }
  };

  // Adjust the amount based on the count and base price
  useEffect(() => {
    setAmountPaid(count * 500); // 500 is the base price per game
  }, [count]);

  const content = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Player Name
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded dark:bg-gray-800 dark:text-white text-lg font-bold"
          placeholder="Enter player name"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-lg text-gray-700 dark:text-gray-300">
          Games Played
        </label>
        <div className="flex items-center gap-2">
          <button onClick={() => setCount((c) => Math.max(1, c - 1))} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">-</button>
          <span>{count}</span>
          <button onClick={() => setCount((c) => c + 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
        </div>
      </div>

      <div className="flex font-large items-center justify-between">
        <label className="text-lg font-bold text-gray-700 dark:text-gray-300">
          Amount Paid (₦)
        </label>
        <div className="flex text-lg font-bold items-center gap-2">
          <span>₦{amountPaid}</span>
        </div>
      </div>

      {/* Game Status Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Game Status
        </label>
        <select
          value={gameStatus}
          onChange={(e) => setGameStatus(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white">
        Cancel
      </button>
      <Button
        label="Submit"
        className="bg-primary text-white"
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Game Session"
      content={content}
      footer={footer}
    />
  );
}
