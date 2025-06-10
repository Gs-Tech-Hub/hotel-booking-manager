"use client";
import { useState } from "react";
import { brandConfig as initialConfig, BrandConfig } from "@/brand/brandConfig";

export default function CompanySettingsPage() {
  const [form, setForm] = useState<BrandConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("logo.")) {
      setForm((prev) => ({
        ...prev,
        logo: { ...prev.logo, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("socials.")) {
      setForm((prev) => ({
        ...prev,
        socials: { ...prev.socials, [name.split(".")[1]]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Replace with API call to persist changes
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Company Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Organisation Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Logo (Light)</label>
            <input name="logo.light" value={form.logo.light} onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Logo (Dark)</label>
            <input name="logo.dark" value={form.logo.dark} onChange={handleChange} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="block font-medium">Website</label>
          <input name="website" value={form.website} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Socials</label>
          <div className="flex gap-2">
            <input name="socials.facebook" placeholder="Facebook" value={form.socials.facebook || ""} onChange={handleChange} className="input input-bordered w-full" />
            <input name="socials.twitter" placeholder="Twitter" value={form.socials.twitter || ""} onChange={handleChange} className="input input-bordered w-full" />
            <input name="socials.instagram" placeholder="Instagram" value={form.socials.instagram || ""} onChange={handleChange} className="input input-bordered w-full" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        {success && <div className="text-green-600">Settings updated!</div>}
      </form>
    </div>
  );
}
