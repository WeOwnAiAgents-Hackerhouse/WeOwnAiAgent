'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'AgentKit', value: 35 },
  { name: 'Eliza', value: 25 },
  { name: 'GoatNetwork', value: 20 },
  { name: 'Claude', value: 15 },
  { name: 'Other', value: 5 },
];

const chartConfig = {
  AgentKit: {
    label: "AgentKit",
    color: "hsl(var(--chart-1))",
  },
  Eliza: {
    label: "Eliza",
    color: "hsl(var(--chart-2))",
  },
  GoatNetwork: {
    label: "GoatNetwork",
    color: "hsl(var(--chart-3))",
  },
  Claude: {
    label: "Claude",
    color: "hsl(var(--chart-4))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export function AgentUsageChart() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Agent Usage Distribution</h3>
      <ChartContainer config={chartConfig} className="aspect-square min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="70%"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
} 