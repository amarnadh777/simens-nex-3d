import { PanelCard } from "../PanelCard";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const barData = [
  { name: 'M', val: 40 },
  { name: 'T', val: 70 },
  { name: 'W', val: 50 },
  { name: 'T', val: 90 },
  { name: 'F', val: 60 },
];

export default function ThermalDashboard() {
  return (
    <>
      <PanelCard className="p-6">
        <h3 className="text-xs uppercase text-red-400">Thermal Status</h3>
        <p className="text-2xl font-bold text-white mt-2">78°C</p>
      </PanelCard>

      <PanelCard className="p-6 mt-6">
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
                <Bar dataKey="val" fill="#ef4444" />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </PanelCard>
    </>
  );
}
