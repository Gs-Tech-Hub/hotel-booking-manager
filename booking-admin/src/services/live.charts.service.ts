import { strapiService } from "@/utils/dataEndpoint";
import { TimeFrame } from "@/types";

interface Payment {
  id: number;
  createdAt: string;
  totalPrice: number;
  PaymentStatus: string;
}

interface ChartPoint {
  x: string;
  y: number;
}

interface OverviewData {
  received: ChartPoint[];
  due: ChartPoint[];
}

// Get ISO Week (e.g., "Week 13, 2025")
function getISOWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `Week ${weekNo}, ${tempDate.getUTCFullYear()}`;
}

// Sort keys for chart order
function sortKeysByTime(a: string, b: string, timeFrame: TimeFrame): number {
  if (timeFrame === "yearly") return +a - +b;

  if (timeFrame === "monthly") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a) - months.indexOf(b);
  }

  if (timeFrame === "weekly") {
    const [, weekA, yearA] = a.match(/Week (\d+), (\d+)/) || [];
    const [, weekB, yearB] = b.match(/Week (\d+), (\d+)/) || [];
    return +yearA === +yearB ? +weekA - +weekB : +yearA - +yearB;
  }

  return 0;
}

// Get group key by timeframe
function getGroupKey(dateStr: string, timeFrame: TimeFrame): string {
  const date = new Date(dateStr);
  switch (timeFrame) {
    case "yearly":
      return date.getFullYear().toString();
    case "monthly":
      return date.toLocaleString("default", { month: "short" });
    case "weekly":
      return getISOWeekKey(dateStr);
    default:
      return "";
  }
}

// Main export
export async function getPaymentsOverviewData(
    timeFrame: TimeFrame): Promise<OverviewData> {

  const { data } = await strapiService.paymentEndpoints.getTransactions(
    {
    pagination: 50
    });
const payments: Payment[] = data.filter((p: Payment): boolean => p.PaymentStatus === "completed");

  const received: Record<string, number> = {};
  const due: Record<string, number> = {}; // Extend if needed

// interface GroupedPayments {
//     [key: string]: number;
// }

payments.forEach((payment: Payment): void => {
    const key: string = getGroupKey(payment.createdAt, timeFrame);
    received[key] = (received[key] || 0) + payment.totalPrice;
});

  const allKeys = Object.keys(received).sort((a, b) => sortKeysByTime(a, b, timeFrame));

  return {
    received: allKeys.map(k => ({ x: k, y: received[k] })),
    due: allKeys.map(k => ({ x: k, y: due[k] || 0 })),
  };
}
