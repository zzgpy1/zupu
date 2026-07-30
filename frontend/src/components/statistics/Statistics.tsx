import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';

interface StatisticsProps {
  data: any;
}

export default function Statistics({ data }: StatisticsProps) {
  const { total, male, female, alive, deceased, generationDistribution } = data;

  const genderData = [
    { name: '男性', value: male },
    { name: '女性', value: female },
  ];
  const statusData = [
    { name: '在世', value: alive },
    { name: '已故', value: deceased },
  ];
  const genData = Object.entries(generationDistribution || {}).map(([gen, count]) => ({
    generation: `第${gen}代`,
    count,
  }));

  const COLORS = ['#3b82f6', '#ec4899', '#22c55e', '#eab308'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="性别分布">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="生存状态">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="世代分布（柱状图）" className="md:col-span-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="generation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
