import React from "react";
import { PieChart, Pie, Cell, Label, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function DashboardDonut({ categories = {} }) {
    
  const chartData = React.useMemo(() => {
    return Object.entries(categories ?? {}).map(([category, count], index) => ({
      name: category,
      value: count,
      fill: COLORS[index % COLORS.length],
    }));
  }, [categories]);
  
  const totalCount = React.useMemo(() => {
    return Object.values(categories ?? {}).reduce((total, num) => total + num, 0);
  }, [categories]);
  
  const data = Object.entries(categories || {}).map(([name, count]) => ({
    name,
    value: Number(count),
  }));
  

  if (!data.length) {
    return <div className="text-center text-sm text-gray-400">No data available</div>;
  }
  
  return (
    <Card className="flex flex-col">
      
      <CardContent className="flex-1 pb-0">
        {/* Se pasa un objeto config válido a ChartContainer para Shadcn UI */}
        <ChartContainer config={{ styles: {} }} className="mx-auto aspect-square max-h-[250px]">
        <PieChart width={200} height={200}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={80}
        fill="#82ca9d"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
