import { PanelCard } from "../PanelCard";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const solarProductionData = [
  { hour: '00', output: 0 },
  { hour: '04', output: 5 },
  { hour: '08', output: 45 },
  { hour: '12', output: 92 },
  { hour: '16', output: 60 },
  { hour: '20', output: 10 },
  { hour: '24', output: 0 },
];

const MiniStat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase text-slate-500">{label}</span>
    <span className="text-xl font-bold text-white">{value}</span>
  </div>
);

export default function SolarDashboard() {
  return (
    <>
      {/* SOLAR CARDS */}
      <PanelCard className="p-6">
        <h3 className="text-xs uppercase text-slate-400">Solar Metrics</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <MiniStat label="Voltage" value="480V" />
          <MiniStat label="Current" value="12A" />
          <MiniStat label="Efficiency" value="92%" />
        </div>
      </PanelCard>

      {/* SOLAR GRAPH */}
      <PanelCard className="p-6 mt-6">
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={solarProductionData}>
                <Area dataKey="output" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.3} />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </PanelCard>
    </>
  );
}
