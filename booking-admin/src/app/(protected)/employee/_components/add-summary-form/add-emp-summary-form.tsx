/* eslint-disable */
import { strapiService } from '@/utils/dataEndPoint';
import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddEmployeeSummaryFormProps {
  id?: number;
  documentId: string;
  order_discount_total?: number;
  debt_shortage?: number;
  fines_debits?: number;
  salary_advanced?: number;
  salary_advanced_status?: 'pending' | 'approved' | 'rejected';
  users_permissions_user?: {
    documentId: string;
  };
}

const AddEmployeeSummaryForm = ({ initialData = {} as AddEmployeeSummaryFormProps, onSubmit }: { initialData?: AddEmployeeSummaryFormProps, onSubmit: (data: AddEmployeeSummaryFormProps) => void }) => {
  const [form, setForm] = useState({
    id: initialData.id,
    order_discount_total: initialData.order_discount_total || 0,
    debt_shortage: initialData.debt_shortage || 0,
    fines_debits: initialData.fines_debits || 0,
    salary_advanced: initialData.salary_advanced || 0,
    salary_advanced_status: initialData.salary_advanced_status || 'pending',
    user_documentId: initialData.users_permissions_user?.documentId || '',
  });
  console.log('initialData:', initialData);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Create a payload object excluding non-form fields
      const payload = {
        users_permissions_user: form.id,
        order_discount_total: form.order_discount_total,
        debt_shortage: form.debt_shortage,
        fines_debits: form.fines_debits,
        salary_advanced: form.salary_advanced,
        salary_advanced_status: form.salary_advanced_status,
      };

      if (!form.id) {
        throw new Error("Employee ID is required for updating");
      }

      const res = await strapiService.createEmployeeSummary(payload);
      toast.success("Employee summary updated successfully!");
      onSubmit(res);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating the employee summary.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Employee Management Form</h2>
      <div>
        <label className="block mb-1 font-medium">Order Discount Total</label>
        <input
          type="number"
          name="order_discount_total"
          value={form.order_discount_total}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Debt Shortage</label>
        <input
          type="number"
          name="debt_shortage"
          value={form.debt_shortage}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Fines Debits</label>
        <input
          type="number"
          name="fines_debits"
          value={form.fines_debits}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Salary Advanced</label>
        <input
          type="number"
          name="salary_advanced"
          value={form.salary_advanced}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Salary Advanced Status</label>
        <select
          name="salary_advanced_status"
          value={form.salary_advanced_status}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {initialData.id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default AddEmployeeSummaryForm;
