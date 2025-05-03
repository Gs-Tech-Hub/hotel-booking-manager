"use client";

import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/ui-elements/select";
import { SelectItem } from "@/components/ui-elements/select-item";
import { GamesList, Games } from "./games-table";
import { AddGameModal } from "../games-modal/add-game-modal"; // Import your modal
import { CreateGameModal } from "../games-modal/add-new-game"




export default function GamesListPage({ games }: { games: Games[] }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<"" | "count" | "amount_paid" | "createdAt">("");
  const [selectedGame, setSelectedGame] = useState<Games | null>(null);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);


  const handleUpdate = (updated: {
    count: number;
    amount_paid: number;
    amount_owed: number;
    game_status: string;

  }) => {
    console.log("Updated:", updated);
    // Here, you can update your local state or send the updated data to an API
    setSelectedGame(null);
  };

  const filtered = games.filter((item) =>
    statusFilter ? item.game_status === statusFilter : true
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === "createdAt") {
      return new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return (bValue as number) - (aValue as number);
  });

  return (
    <div className="p-6 space-y-6">
      
       <AddGameModal
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        onSubmit={handleUpdate}
        defaultData={
          selectedGame
            ? {
                id: selectedGame.id,
                documentId: selectedGame.documentId,
                playerName: selectedGame.customer.firstName,
                count: selectedGame.count,
                amountPaid: selectedGame.amount_paid,
                amountOwed: selectedGame.amount_owed,
                gameStatus: selectedGame.game_status,
              }
            : undefined // ✅ change from `null` to `undefined`
        }
        />

      <div className="flex flex-wrap justify-between items-center gap-4">
        <Button className="bg-primary text-white hover:bg-primary/90" 
        label="+ Add New Game"
        onClick={() => setIsCreateGameModalOpen(true)} 
        />

        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onChange={(value) => setStatusFilter(String(value))}>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </Select>

          <Select value={sortKey} onChange={(value: string | number) => setSortKey(value.toString() as "" | "count" | "amount_paid" | "createdAt")}>
            <SelectItem value="">Sort by</SelectItem>
            <SelectItem value="count">Games Played</SelectItem>
            <SelectItem value="amount_paid">Amount Paid</SelectItem>
            <SelectItem value="createdAt">Date</SelectItem>
          </Select>
        </div>
      </div>

      <GamesList games={sorted} onRowClick={setSelectedGame} />

      <CreateGameModal
      isOpen={isCreateGameModalOpen}
      onClose={() => setIsCreateGameModalOpen(false)}
      onSubmit={() => {
        setIsCreateGameModalOpen(false);
        // Optional: refetch or refresh local game list if needed
      }}
    />

    </div>
  );
}
