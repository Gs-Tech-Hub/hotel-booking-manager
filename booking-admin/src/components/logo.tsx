import { useOrganisationInfo } from "@/hooks/useOrganisationInfo";
import Image from "next/image";

export function Logo() {
  const { organisation } = useOrganisationInfo();
  return (
    <div className="relative h-24 w-full max-w-[10.847rem]">
      <Image
        src={organisation.logo?.light || "/images/fmmm1-light.svg"}
        fill={true}
        className="dark:hidden"
        alt={`${organisation.name} logo`}
        role="presentation"
        quality={100}
      />

      <Image
        src={organisation.logo?.dark || "/images/fmmm1-dark.svg"}
        fill
        className="hidden dark:block"
        alt={`${organisation.name} logo`}
        role="presentation"
        quality={100}
      />
    </div>
  );
}
