import { cn } from "@/lib/clsx";

export default function Button({
   label,
   isPrimary,
   ...props
}: {
   label: string;
   isPrimary?: boolean;
   type?: "submit" | "reset" | "button";
} & React.HTMLProps<HTMLButtonElement>) {
   return (
      <button
         {...props}
         className={cn(
            props.className,
            "px-6 py-3 text-sm font-medium cursor-pointer",
            !isPrimary ? "bg-white text-red-400" : "text-white bg-red-400"
         )}
      >
         {label}
      </button>
   );
}
