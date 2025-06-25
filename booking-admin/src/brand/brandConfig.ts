// Centralized brand configuration
export interface BrandConfig {
  id: number;
  name: string;
  logo: {
    light: string;
    dark: string;
  };
  address: string;
  phone: string;
  email: string;
  website: string;
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}

export const brandConfig: BrandConfig = {
  id: 1,
  name: "OZONE Management Suite",
  logo: {
    light: "/images/fmmm1-logo.svg", // adjust path as needed
    dark: "/images/fmmm1-dark.svg", // adjust path as needed
  },
  address: "123 Main Street, City, Country", // update as needed
  phone: "+1234567890",
  email: "info@ozone-ms.com",
  website: "https://f-mmm1-hotel.netlify.app",
  socials: {
    facebook: "https://facebook.com/fmmm1hotel",
    instagram: "https://instagram.com/fmmm1hotel",
  },
};
