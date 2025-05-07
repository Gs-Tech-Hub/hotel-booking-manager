import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { strapiService } from "@/utils/dataEndPoint";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/Auth/context/auth-context";
import { processOrder } from "@/utils/processOrders/finalizeOrder";
import { paymentMethods } from "@/app/stores/useOrderStore";

export interface GameItem {
  count: number;
  amount_paid: number;
  amount_owed: number;
  game_status: string;
}

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    count: number;
    amount_paid: number;
    amount_owed: number;
    game_status: string;
  }) => void;
  defaultData?: {
    id: number
    documentId: string;
    playerName: string;
    count: number;
    amountPaid: number;
    amountOwed: number;
    gameStatus: string;
  };
}

export function AddGameModal({
  isOpen,
  onClose,
  onSubmit,
  defaultData,
}: AddGameModalProps) {
  const [playerName, setPlayerName] = useState<string>("");
  const [count, setCount] = useState<number>(1);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [amountOwed, setAmountOwed] = useState<number>(500);
  const [gameStatus, setGameStatus] = useState<string>("ongoing");
  const [lockedStatus, setLockedStatus] = useState<string>("");
  const [defaultCount, setDefaultCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const { user } = useAuth();
  const userRole = user?.role || "";

  const isLocked = lockedStatus === "completed" || lockedStatus === "cancelled";

  useEffect(() => {
    if (defaultData) {
      setPlayerName(defaultData.playerName);
      setCount(defaultData.count);
      setDefaultCount(defaultData.count);
      setAmountPaid(defaultData.amountPaid);
      setAmountOwed(defaultData.amountOwed);
      setGameStatus(defaultData.gameStatus);
      setLockedStatus(defaultData.gameStatus);
    }
  }, [defaultData]);

  useEffect(() => {
    setAmountOwed(count * 500);
  }, [count]);

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      toast.warning("Player name is required");
      return;
    }

    if (gameStatus === "cancelled" && userRole !== "admin") {
      toast.warn("Only a manager can cancel an ongoing game.");
      return;
    }

    if (isLocked) {
      toast.info("Cannot update a completed or cancelled game.");
      return;
    }

    if (gameStatus === "completed" && !selectedPaymentMethod) {
      toast.error("Please select a payment method before completing.");
      return;
    }

    const payload = {
      count,
      amount_paid: amountPaid,
      amount_owed: amountOwed,
      game_status: gameStatus,
    };

    try {
      setIsLoading(true);


      if (gameStatus === "completed") {
        const paymentMethodObj = paymentMethods.find(
          (method) => method.type === selectedPaymentMethod
        );

        if (!paymentMethodObj) {
          toast.error("Invalid payment method selected.");
          return;
        }


        // Process the order
        const response = await processOrder({
          order: {
            id: (defaultData?.id ?? 0).toString(),
            totalAmount: 500 * count,
            waiterId: user?.id || "",
            ...payload,
            items: [
              {
                id: defaultData?.id ?? 0,
                documentId: defaultData?.documentId ?? "",
                name: "Game Session - " + playerName,
                price: 500 * count,
                quantity: count,
                department: "Games",
                count: count,
                amount_paid: amountPaid,
                amount_owed: amountOwed,
                game_status: gameStatus,
              },
            ],
            status: payload.game_status === "completed" ? "completed" : "active",
          },
          waiterId: user?.id || "",
          customerId: null,
          paymentMethod: paymentMethodObj,
        });

        if (!response.success) {
          toast.error("Updating user games failed");
          return;
        }
      }

      if (defaultData?.documentId) {
        await strapiService.updateGame(defaultData.documentId, payload);
      }

      toast.success("Game updated successfully!");
      setLockedStatus(gameStatus);
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to save game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "cancelled") {
      if (userRole !== "admin") {
        toast.warn("Only a manager can cancel an ongoing game.");
        return;
      }
      setAmountPaid(0);
      setAmountOwed(0);
      setCount(0);
      setSelectedPaymentMethod("");
    } else if (newStatus === "completed") {
      setAmountPaid(amountOwed);
      setAmountOwed(0);
    } else if (newStatus === "ongoing") {
      setAmountPaid(0);
      setAmountOwed(count * 500);
      setSelectedPaymentMethod("");
    }
    setGameStatus(newStatus);
  };

  const content = (
    <fieldset disabled={isLoading || isLocked} className="space-y-4">
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
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(defaultCount, c - 1))}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            -
          </button>
          <span>{count}</span>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            +
          </button>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Game Status
        </label>
        <select
          value={gameStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {gameStatus === "completed" && (
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.type} value={method.type}>
                {method.type}
              </option>
            ))}
          </select>
        </div>
      )}
    </fieldset>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
        disabled={isLoading}
      >
        Cancel
      </button>
      <Button
        label={isLoading ? "Saving..." : "Submit"}
        className={cn(
          "bg-primary text-white transition",
          (isLoading || isLocked) && "opacity-50 pointer-events-none cursor-not-allowed"
        )}
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


