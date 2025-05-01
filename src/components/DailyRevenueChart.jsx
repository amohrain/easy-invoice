import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCompanyStore } from "../store/useCompany";

const DailyRevenueChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { company } = useCompanyStore();
  const currency = company.currency || "";

  useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/invoice/daily-revenue?month=${month}&year=${year}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily revenue data");
        }

        const data = await response.json();
        setDailyData(data.data);
      } catch (error) {
        console.error("Error fetching daily revenue:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyRevenue();
  }, []);

  // Format numbers as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 shadow rounded">
          <p className="font-semibold">
            {new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">
          Daily Revenue -{" "}
          {new Date(year, month - 1).toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </h2>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-base-300"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).getDate()}
                  className="text-xs text-base-content/70"
                />
                <YAxis
                  tickFormatter={(value) => `${currency}${value}`}
                  className="text-xs text-base-content/70"
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--p))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--p))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--p))"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, fill: "hsl(var(--p))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRevenueChart;
