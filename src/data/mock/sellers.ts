import { Seller } from "@/lib/types";

export const sellers: Seller[] = [
  {
    id: "seller-1",
    name: "Al Noor Luxury Plates",
    avatar: "AN",
    type: "Dealer",
    verified: true,
    totalSales: 312,
    responseTime: "within 8 minutes",
    location: "Dubai",
  },
  {
    id: "seller-2",
    name: "Capital Elite Numbers",
    avatar: "CE",
    type: "Broker",
    verified: true,
    totalSales: 188,
    responseTime: "within 15 minutes",
    location: "Abu Dhabi",
  },
  {
    id: "seller-3",
    name: "Private Collector",
    avatar: "PC",
    type: "Private Owner",
    verified: false,
    totalSales: 21,
    responseTime: "within 1 hour",
    location: "Sharjah",
  },
];
