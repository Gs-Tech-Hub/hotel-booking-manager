"use client"
import React, { useState } from "react";
import { Card } from "../../../../components/ui-elements/card";

interface MembershipPlan {
  name: string;
  price: string;
  duration: string;
}

interface FitnessSession {
  title: string;
  instructor: string;
  schedule: string;
}

export default function SportAndFitnessForm() {
  const [sportName, setSportName] = useState("");
  const [description, setDescription] = useState("");
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [fitnessSessions, setFitnessSessions] = useState<FitnessSession[]>([]);
  const [creationId, setCreationId] = useState<string | null>(null);

  // Membership Plan handlers
  const addMembershipPlan = () => {
    setMembershipPlans([...membershipPlans, { name: "", price: "", duration: "" }]);
  };
  const updateMembershipPlan = (idx: number, field: keyof MembershipPlan, value: string) => {
    setMembershipPlans(plans => plans.map((plan, i) => i === idx ? { ...plan, [field]: value } : plan));
  };
  const removeMembershipPlan = (idx: number) => {
    setMembershipPlans(plans => plans.filter((_, i) => i !== idx));
  };

  // Fitness Session handlers
  const addFitnessSession = () => {
    setFitnessSessions([...fitnessSessions, { title: "", instructor: "", schedule: "" }]);
  };
  const updateFitnessSession = (idx: number, field: keyof FitnessSession, value: string) => {
    setFitnessSessions(sessions => sessions.map((session, i) => i === idx ? { ...session, [field]: value } : session));
  };
  const removeFitnessSession = (idx: number) => {
    setFitnessSessions(sessions => sessions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreationId(`sportfit-${Date.now()}`);
    // Here you could send data to backend or show a success message
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card
        title="Sport & Fitness Info"
        content={
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={sportName}
                onChange={e => setSportName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        }
      />

      <Card
        title="Membership Plans"
        content={
          <div className="space-y-4">
            {membershipPlans.map((plan, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Plan Name"
                  value={plan.name}
                  onChange={e => updateMembershipPlan(idx, "name", e.target.value)}
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-24"
                  placeholder="Price"
                  value={plan.price}
                  onChange={e => updateMembershipPlan(idx, "price", e.target.value)}
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-32"
                  placeholder="Duration (e.g. 1 month)"
                  value={plan.duration}
                  onChange={e => updateMembershipPlan(idx, "duration", e.target.value)}
                  required
                />
                <button type="button" className="text-red-500 ml-2" onClick={() => removeMembershipPlan(idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="text-primary underline" onClick={addMembershipPlan}>
              + Add Membership Plan
            </button>
          </div>
        }
      />

      <Card
        title="Fitness Sessions"
        content={
          <div className="space-y-4">
            {fitnessSessions.map((session, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Session Title"
                  value={session.title}
                  onChange={e => updateFitnessSession(idx, "title", e.target.value)}
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-32"
                  placeholder="Instructor"
                  value={session.instructor}
                  onChange={e => updateFitnessSession(idx, "instructor", e.target.value)}
                  required
                />
                <input
                  className="border rounded px-2 py-1 w-40"
                  placeholder="Schedule (e.g. Mon 6pm)"
                  value={session.schedule}
                  onChange={e => updateFitnessSession(idx, "schedule", e.target.value)}
                  required
                />
                <button type="button" className="text-red-500 ml-2" onClick={() => removeFitnessSession(idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="text-primary underline" onClick={addFitnessSession}>
              + Add Fitness Session
            </button>
          </div>
        }
      />

      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold">
          Create Sport & Fitness
        </button>
      </div>

      {creationId && (
        <div className="mt-4 text-green-600 font-bold">Created! ID: {creationId}</div>
      )}
    </form>
  );
}
