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
        roles: [ "admin", "receptionist", "manager"],
        items: [],
      },
      {
        title: "Rooms",
        icon: Icons.RoomsIcon,
        url: "/rooms",
        roles: ["admin", "receptionist", "manager"],
        items: [],
      },
      {
        title: "Events Booking",
        icon: Icons.EventIcon,
        url: "/events-booking",
        roles: ["admin", "receptionist", "manager"],
        items: [],
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
           roles: ["admin", "kitchen"]
           },

          { 
            title: "Bar", 
            url: "/bar",
            roles: ["admin", "bar"]
           },

          { title: "Games",
             url: "/games", 
             roles: ["admin", "bar"] 
          },
          { 
            title: "Swimming", 
            url: "/swimming", 
            roles: ["admin", "bar"] 
          },
          { 
            title: "Sales Terminal", 
            url: "/sales-terminal", 
            roles: ["admin", "bar", "kitchen", "receptionist", "manager"] 
          },
        ],
      },
    ],
  },
];
