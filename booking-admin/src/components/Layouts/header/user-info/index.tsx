"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useAuth } from '@/components/Auth/context/auth-context';

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // Destructure user and loading from context

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loader component if needed
  }
  // Fallback values in case user information is not available
  const userName = user?.name ? capitalizeName(user.name) : '';
  const userEmail = user?.email;
  const userImage = user?.image; 

  const handleLogout = async () => {
    setIsOpen(false); // Close dropdown/menu
    await logout();   // Call logout from context
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
        {userImage ? (
            <Image
              src={userImage}
              className="size-12"
              alt={`Avatar of ${userName}`}
              role="presentation"
              width={200}
              height={200}
            />
          ) : (
            <UserIcon className="size-12" aria-hidden />
          )}
          
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{userName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
        {userImage ? (
            <Image
              src={userImage}
              className="size-12"
              alt={`Avatar for ${userName}`}
              role="presentation"
              width={200}
              height={200}
            />
          ) : (
            <UserIcon className="size-12" aria-hidden />
          )}
          
          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {userName}
            </div>

            <div className="leading-none text-gray-6">{userEmail}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

// Helper function to capitalize the first letter of each word in the name
const capitalizeName = (name: string) => {
  return name
    .split(" ")  // Split the name into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize the first letter of each word
    .join(" ");  // Join the words back together
};
