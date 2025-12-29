const ServerDetails = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 bg-blue-500/5 border border-white/5 rounded-lg">
        <p className="text-[8px] text-slate-500">CPU LOAD</p>
        <p className="text-sm font-bold">88%</p>
      </div>
      {/* Add more server-specific metrics */}
    </div>
  </div>
);