import { TrendingUp, CreditCard, Calendar, Users } from "lucide-react";
import { formatCurrency } from "./formatCurrency";

export const getInvoiceStats = (invoiceData, currency = "USD") => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get last month and year, accounting for January
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const statCounters = {
    thisMonth: {
      revenue: 0,
      pending: 0,
      overdue: 0,
      clients: new Set(),
    },
    lastMonth: {
      revenue: 0,
      pending: 0,
      overdue: 0,
      clients: new Set(),
    },
  };

  invoiceData.forEach((inv) => {
    const date = new Date(inv.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const isThisMonth = year === currentYear && month === currentMonth;
    const isLastMonth = year === lastMonthYear && month === lastMonth;

    const updateStats = (bucket) => {
      if (inv) bucket.revenue += inv.totalAmount;
      if (inv.status === "Pending") bucket.pending += inv.totalAmount;
      if (inv.status === "Overdue") bucket.overdue += inv.totalAmount;
      if (inv.clientId) bucket.clients.add(inv.clientId);
    };

    if (isThisMonth) updateStats(statCounters.thisMonth);
    if (isLastMonth) updateStats(statCounters.lastMonth);
  });

  const percentChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const makeStat = (title, current, previous, icon) => {
    const change = percentChange(current, previous);
    const changeType = change >= 0 ? "positive" : "negative";
    return {
      title,
      value:
        // title === "Clients" ? `${current}` : `${currency}${current.toFixed(2)}`,
        title === "Clients"
          ? `${current}`
          : `
        ${formatCurrency(current, currency)}`,
      icon: icon,
      change: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
      changeType,
    };
  };

  return [
    makeStat(
      "Total Revenue",
      statCounters.thisMonth.revenue,
      statCounters.lastMonth.revenue,
      <TrendingUp className="w-6 h-6" />
    ),
    makeStat(
      "Pending",
      statCounters.thisMonth.pending,
      statCounters.lastMonth.pending,
      <CreditCard className="w-6 h-6" />
    ),
    makeStat(
      "Overdue",
      statCounters.thisMonth.overdue,
      statCounters.lastMonth.overdue,
      <Calendar className="w-6 h-6" />
    ),
    makeStat(
      "Clients",
      statCounters.thisMonth.clients.size,
      statCounters.lastMonth.clients.size,
      <Users className="w-6 h-6" />
    ),
  ];
};
