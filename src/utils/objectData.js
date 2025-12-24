// Simple mapping for object names to data
export const objectData = {
  // Example for Object_710 (assuming it's a server)
  'Object_710': {
    name: 'Database Server DB-01',
    type: 'Server',
    status: 'Active',
    cpu: 'Intel Xeon E-2378',
    memory: '128 GB',
    storage: '2 TB SSD',
    ip: '192.168.1.101',
    role: 'Primary Database',
    description: 'Hosts customer database and transaction logs'
  },
  
  // Example for Object_711 (assuming it's a switch)
  'Object_711': {
    name: 'Network Switch SW-01',
    type: 'Network',
    status: 'Active', 
    ports: '48',
    speed: '10 Gbps',
    brand: 'Cisco',
    model: 'Catalyst 9300',
    ip: '192.168.1.1',
    description: 'Core network switch for rack 1'
  },
  
  // Example for Object_712 (assuming it's storage)
  'Object_712': {
    name: 'Storage Array SA-01',
    type: 'Storage',
    status: 'Active',
    capacity: '500 TB',
    used: '320 TB (64%)',
    raid: 'RAID 6',
    brand: 'Dell EMC',
    description: 'Primary storage for virtual machines'
  },
  
  // Generic fallback for any object
  'default': {
    name: 'Data Center Equipment',
    type: 'Infrastructure',
    status: 'Active',
    description: 'Data center infrastructure component'
  }
};

// Simple function to get data for any object
export function getObjectData(objectName) {
  // Return specific data if exists
  if (objectData[objectName]) {
    return objectData[objectName];
  }
  
  // Try to guess type from name
  const name = objectName.toLowerCase();
  
  if (name.includes('server') || name.includes('srv')) {
    return {
      ...objectData['default'],
      name: 'Server Unit',
      type: 'Server',
      cpu: 'Intel Xeon',
      memory: '64 GB',
      description: 'Compute server unit'
    };
  }
  
  if (name.includes('switch') || name.includes('router')) {
    return {
      ...objectData['default'],
      name: 'Network Device',
      type: 'Network',
      ports: '24',
      speed: '1 Gbps',
      description: 'Network switching equipment'
    };
  }
  
  if (name.includes('storage') || name.includes('array')) {
    return {
      ...objectData['default'],
      name: 'Storage Device',
      type: 'Storage',
      capacity: '100 TB',
      description: 'Data storage equipment'
    };
  }
  
  // Default fallback
  return {
    ...objectData['default'],
    name: objectName // Use the actual object name
  };
}