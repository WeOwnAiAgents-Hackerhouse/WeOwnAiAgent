'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 12000 },
  { month: 'Mar', value: 11000 },
  { month: 'Apr', value: 15000 },
  { month: 'May', value: 16500 },
  { month: 'Jun', value: 19000 },
  { month: 'Jul', value: 22000 },
  { month: 'Aug', value: 25000 },
  { month: 'Sep', value: 27000 },
  { month: 'Oct', value: 31000 },
  { month: 'Nov', value: 35000 },
  { month: 'Dec', value: 40000 },
];

const chartConfig = {
  value: {
    label: "Investment Value",
    color: "hsl(var(--chart-1))",
  }
};

export function InvestmentChart() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Increase of Investment IRA Account</h3>
      <ChartContainer config={chartConfig} className="aspect-[4/3] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" stroke="#888888" />
            <YAxis 
              stroke="#888888"
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--chart-1))" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-sm text-gray-400 mt-2 text-center">Users: 7,500+ and growing</p>
    </div>
  );
} 