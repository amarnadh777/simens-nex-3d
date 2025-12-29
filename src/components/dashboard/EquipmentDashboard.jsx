// src/components/dashboard/EquipmentDashboard.jsx
export default function EquipmentDashboard({ data }) {
  // Logic to change metrics based on mesh name
  const isPower = data.name.includes('UPS') || data.name.includes('MDB');
  const isCooling = data.name.includes('Chiller') || data.name.includes('CRAH');
const MetricRow = ({ label, val, colorClass = "text-white" }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-mono font-bold ${colorClass}`}>{val}</span>
  </div>
);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black italic">{data.name}</h2>
      
      <div className="grid grid-cols-1 gap-2">
        <MetricRow label="Availability" val="99.99%" />
        <MetricRow label="Fault Frequency" val="2 / Month" />
        <hr className="opacity-10" />
        
        {isPower && (
          <>
            <MetricRow label="Input Voltage" val="415 V" />
            <MetricRow label="Current Load" val="72%" />
          </>
        )}

        {isCooling && (
          <>
            <MetricRow label="Chilled Water In" val="12°C" />
            <MetricRow label="Chilled Water Out" val="6.5°C" />
          </>
        )}
      </div>

      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-[10px] text-red-500 font-bold uppercase">Recent Alarms</p>
        <p className="text-xs text-white mt-1">Critical: Communication Loss with Controller B</p>
      </div>
    </div>
  );
}