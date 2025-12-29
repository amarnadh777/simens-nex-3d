import BuildingDashboard from './BuildingDashboard';
import SolarDetails from './SolarDetails';
import ServerDetails from './ServerDetails';

// Simple fallback component when nothing matches
const DefaultDetails = ({ data }) => (
  <div className="p-4 text-sm text-slate-400">No details available.</div>
);

export const dashboardMap = {
  // The KEY must exactly match the mesh name in your 3D model
  Shed_Dirty_Wood_Planks_0: SolarDetails,
  solar004: SolarDetails, // multiple meshes can use the same component
  building004: BuildingDashboard,
  building002: BuildingDashboard,
  Shed_Wood_Planks_0: ServerDetails,
};

// Helper to get the component or a default fallback
export const getComponentByName = (name) => {
  return dashboardMap[name] || DefaultDetails;
};