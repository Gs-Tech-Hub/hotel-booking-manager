'use client'
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderData {
  id: number;
  createdAt: string;
  total: number;
  discount_amount: number;
  amount_paid: number;
  users_permissions_user: {
    id: number;
    username: string;
    email: string;
  };
  food_items: Array<{
    id: number;
    name: string;
  }>;
  drinks: Array<{
    id: number;
    name: string;
  }>;
}

const EmployeeOrdersTable = ({ data }: { data: OrderData[] }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState<OrderData[]>([]);

  const uniqueUsers = [
    ...new Map(data.map((d) => [d.users_permissions_user.username, d.users_permissions_user])).values(),
  ];
  const months = [...new Set(data.map((d) => dayjs(d.createdAt).format("YYYY-MM")))];

  useEffect(() => {
    console.log("Filtering data...");
    console.log("Selected User:", selectedUser);
    console.log("Selected Month:", selectedMonth);

    let result = data;

    if (selectedUser) {
      result = result.filter((d) => {
        const userMatch =
          d.users_permissions_user.username.trim().toLowerCase() === selectedUser.trim().toLowerCase();
        console.log(`User check: ${d.users_permissions_user.username} === ${selectedUser} => ${userMatch}`);
        return userMatch;
      });
    }

    if (selectedMonth) {
      result = result.filter((d) => {
        const createdMonth = dayjs(d.createdAt).format("YYYY-MM");
        const monthMatch = createdMonth === selectedMonth;
        console.log(`Month check: ${createdMonth} === ${selectedMonth} => ${monthMatch}`);
        return monthMatch;
      });
    }

    console.log("Filtered Results:", result);
    setFilteredData(result);
  }, [selectedUser, selectedMonth, data]);

  return (
    <>
      <div className="flex gap-4 mb-3">
        <div className="w-1/3">
          <label className="block mb-1 font-medium">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => {
              console.log("User selected:", e.target.value);
              setSelectedUser(e.target.value);
            }}
            className="w-full border rounded p-2"
          >
            <option value="">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/3">
          <label className="block mb-1 font-medium">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              console.log("Month selected:", e.target.value);
              setSelectedMonth(e.target.value);
            }}
            className="w-full border rounded p-2"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Amount Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry) => {
            const services = [
              ...entry.food_items.map((item) => ({ ...item, type: "Food" })),
              ...entry.drinks.map((item) => ({ ...item, type: "Drink" })),
            ];
            return services.map((service) => (
              <TableRow key={`${entry.id}-${service.type}-${service.id}`}>
                <TableCell>{dayjs(entry.createdAt).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{entry.total}</TableCell>
                <TableCell>{entry.discount_amount}</TableCell>
                <TableCell>{entry.amount_paid}</TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default EmployeeOrdersTable;
