// Gym membership and attendance/check-in dashboard table data (mock)
export async function getGymMembers() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    {
      id: 1,
      full_name: "John Doe",
      email: "john.doe@example.com",
      phone: "+2348012345678",
      registration_date: "2024-12-01",
      start_date: "2024-12-01",
      end_date: "2025-12-01",
      membership_plan: "Gold",
      attendance: [
        { date: "2025-05-28", time: "08:15" },
        { date: "2025-05-29", time: "09:00" },
        { date: "2025-05-30", time: "07:45" },
      ],
    },
    {
      id: 2,
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+2348098765432",
      registration_date: "2025-01-15",
      start_date: "2025-01-15",
      end_date: "2026-01-15",
      membership_plan: "Silver",
      attendance: [
        { date: "2025-05-29", time: "10:30" },
        { date: "2025-05-30", time: "11:00" },
      ],
    },
    {
      id: 3,
      full_name: "Samuel Okoro",
      email: "samuel.okoro@example.com",
      phone: "+2348034567890",
      registration_date: "2025-03-10",
      start_date: "2025-03-10",
      end_date: "2026-03-10",
      membership_plan: "Bronze",
      attendance: [
        { date: "2025-05-30", time: "08:00" },
      ],
    },
  ];
}
