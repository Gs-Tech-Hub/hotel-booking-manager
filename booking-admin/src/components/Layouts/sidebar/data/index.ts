import * as Icons from "../icons";
import { NavSection } from "../../../../types/sidebar-types"; // adjust path


export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        roles: ["admin", "receptionist", "manager"],
        items: [],
      },
      {
        title: "Booking",
        icon: Icons.BookingsIcon,
        url: "/bookings",
        roles: [ "admin", "bar", "receptionist", "manager"],
        items: [],
      },
      {
        title: "Human Resources",
        icon: Icons.HomeIcon,
        roles: ["admin", "receptionist", "manager", "bar"],
        items: [
          {
            title: "Employee",
            url: "/employee",
            roles: ["admin", "bar", "receptionist", "manager"],
          },
          {
            title: "Roles",
            url: "/roles",
            roles: ["super-admin"],
          },
          {
            title: "Job Applications",
            url: "employee/job-applications",
            roles: ["admin"],
          },
        ],
      },
      {
        title: "Account",
        icon: Icons.AccountingIcon,
        roles: ["admin", "receptionist", "manager"],
        items: [
          {
            title: "Account Summary",
            url: "/account-summary",
            roles: ["admin", "receptionist", "manager"],
          },
          {
            title: "Order List",
            url: "/account-summary/order-items",
            roles: ["super-admin"],
          },
        ],
      },
      {
        title: "Sports & Fitness",
        icon: Icons.FitnessIcon,
        roles: [ "canadaworld-admin", "admin", "receptionist", "manager"],
        items: [
          {
            title: "addNewSport",
            url: "/sports-and-fitness/add-new",
            roles: ["canadaworld-admin", "admin"],
          },
          {
            title: "Gym Fitness",
            url: "/sports-and-fitness/fitness",
            roles: [ "canadaworld-admin", "admin", "manager"],
          },
           {
            title: "Sports & Club",
            url: "/sports-and-fitness/sports",
            roles: [ "canadaworld-admin", "admin", "manager"],
          },
        ],
      },
      {
        title: "Inventory",
        icon: Icons.InventoryIcon,
        roles: ["admin", "manager"],
        items: [
          {
            title: "Inventory",
            url: "/inventory-drinks",
            roles: ["admin", "manager"],
          },
        ],
      },

      {
        title: "Hotel Services",
        icon: Icons.HotelServicesIcon,
        roles: ["admin", "receptionist", "manager", "kitchen", "bar", ],
        items: [
          { 
           title: "Restaurant",
           url: "/restaurant", 
           roles: ["admin", "bar", "kitchen"]
           },

          { 
            title: "Bar", 
            url: "/bar",
            roles: ["admin", "bar", "kitchen"]
           },

          { title: "Games",
             url: "/games", 
             roles: ["admin", "bar"] 
          },
          { 
            title: "Services", 
            url: "/hotel-services", 
            roles: ["admin", "bar"] 
          },
        ],
      },
      { 
        title: "POS Terminal", 
        icon: Icons.POSTerminalIcon,
        items: [],
        url: "/sales-terminal", 
        roles: ["admin", "bar", "kitchen", "games", "receptionist", "manager"] 
      },
      {
        title: "Rooms",
        icon: Icons.RoomsIcon,
        url: "/rooms",
        roles: ["super-admin" ],
        items: [],
      },
      {
        title: "Events",
        icon: Icons.EventIcon,
        url: "/events-booking",
        roles: ["super-admin"],
        items: [],
      },
    ],
  },
];
