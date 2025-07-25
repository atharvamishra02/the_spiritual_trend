import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3200 },
  { name: 'Mar', sales: 4700 },
  { name: 'Apr', sales: 5400 },
];

const ChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-yellow-300 mt-4">
      <h3 className="text-lg font-semibold text-yellow-700 mb-4">Monthly Sales</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={sampleData}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#F59E0B" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
