import darkLogo from "@/assets/logos/fmmm1-dark.svg";
import logo from "@/assets/logos/fmmm1-logo.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-24 w-full max-w-[10.847rem]">
      <Image
        src={logo}
        fill={true}
        className="dark:hidden"
        alt="fmmm1 logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="fmmm1 logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
