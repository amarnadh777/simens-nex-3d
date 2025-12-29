const SolarDetails = ({ data }) => (
  <div className="space-y-4">
    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
      <p className="text-[10px] text-amber-500 font-bold uppercase">Solar Yield</p>
      <div className="text-3xl font-black text-white">4.2 <span className="text-sm">kWh</span></div>
    </div>
    {/* Add a specific Solar Chart here */}
  </div>
);