import { brandConfig } from "@/brand/brandConfig";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-24 w-full max-w-[10.847rem]">
      <Image
        src={brandConfig.logo.light}
        fill={true}
        className="dark:hidden"
        alt={`${brandConfig.name} logo`}
        role="presentation"
        quality={100}
      />

      <Image
        src={brandConfig.logo.dark}
        fill
        className="hidden dark:block"
        alt={`${brandConfig.name} logo`}
        role="presentation"
        quality={100}
      />
    </div>
  );
}
