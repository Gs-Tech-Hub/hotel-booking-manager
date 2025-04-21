'use client'
import {
  CallIcon,
  EmailIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useAuth } from '@/components/Auth/context/auth-context';


export function PersonalInfoForm() {
  const { user } = useAuth(); // Destructure user and loading from context

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="fullName"
            label="Full Name"
            placeholder="Name"
            defaultValue={user?.name}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="+234 3343 7865"
            defaultValue={"+234 3343 7865"}
            icon={<CallIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label="Email Address"
          placeholder="Email"
          defaultValue={user?.email}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="username"
          label="Username"
          placeholder="username"
          defaultValue={user?.role}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        <div className="flex justify-end gap-3">
          {/* <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
          >
            Cancel
          </button> */}

          {/* <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
          >
            Save
          </button> */}
        </div>
      </form>
    </ShowcaseSection>
  );
}
