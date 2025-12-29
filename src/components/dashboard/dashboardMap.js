import SolarDashboard from './SolarDashboard';
import BuildingDashboard from './BuildingDashboard';
import ThermalDashboard from './ThermalDashboard';
import DataHallDashboard from './DataHallDashboard';
import EquipmentDashboard from './EquipmentDashboard';

export const dashboardMap = {
  Shed_Scratched_wood_0: DataHallDashboard,
  Shed_Wood_Planks_0: EquipmentDashboard,

  Shed_Dirty_Wood_Planks_0: DataHallDashboard,

  Shed_Dirty_Wood_Planks_0: ThermalDashboard,
};
