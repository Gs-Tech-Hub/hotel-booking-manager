import { JSX, SVGProps } from "react";

export type SubItem = {
    title: string;
    url: string;
    roles?: string[]; // Optional roles
  };
  
  export type NavItem = {
    title: string;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    url?: string;
    items: SubItem[];
    roles?: string[]; // Optional roles
  };
  
  export type NavSection = {
    label: string;
    items: NavItem[];
  };
  