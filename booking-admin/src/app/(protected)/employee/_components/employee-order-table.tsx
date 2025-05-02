'use client'
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Select } from "@/components/FormElements/select";
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
    ...new Map(data.map((d) => [d.users_permissions_user.id, d.users_permissions_user])).values(),
  ];
  const months = [...new Set(data.map((d) => dayjs(d.createdAt).format("YYYY-MM")))];

  useEffect(() => {
    let result = data;

    if (selectedUser) {
      result = result.filter((d) => d.users_permissions_user.id === parseInt(selectedUser));
    }

    if (selectedMonth) {
      result = result.filter((d) => dayjs(d.createdAt).format("YYYY-MM") === selectedMonth);
    }

    setFilteredData(result);
  }, [selectedUser, selectedMonth, data]);

  return (
    <>
      <div className="flex gap-4 mb-3">
        <div className="w-1/3">
          <Select
            label="Select User"
            items={uniqueUsers.map((user) => ({
              label: user.username,
              value: user.id.toString(),
            }))}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="Select User"
          />
        </div>
        <div className="w-1/3">
          <Select
            label="Select Month"
            items={months.map((month) => ({
              label: month,
              value: month,
            }))}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            placeholder="Select Month"
          />
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
              <TableRow key={`${entry.id}-${service.id}`}>
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