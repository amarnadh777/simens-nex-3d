import { PanelCard } from "../PanelCard";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const performanceData = [
  { time: '01', val1: 4000 },
  { time: '04', val1: 3000 },
  { time: '08', val1: 2000 },
  { time: '12', val1: 2780 },
  { time: '16', val1: 1890 },
];

export default function BuildingDashboard() {
  return (
    <>
      <PanelCard className="p-6">
        <h3 className="text-xs uppercase text-slate-400">Building Load</h3>
        <p className="text-3xl font-bold text-white mt-2">32 kW</p>
      </PanelCard>

      <PanelCard className="p-6 mt-6">
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
                <Area dataKey="val1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </PanelCard>
    </>
  );
}
