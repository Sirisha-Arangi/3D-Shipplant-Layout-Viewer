import * as THREE from 'three';
export function createShipModel(): THREE.Group {
  const ship = new THREE.Group();
  // Remove hull, decks, bridge, and other structural elements at the top
  // Only keeping the colored equipment systems
  // Propulsion system (engines)
  createPropulsionSystem(ship);
  // Electrical system
  createElectricalSystem(ship);
  // HVAC system
  createHVACSystem(ship);
  // Piping system
  createPipingSystem(ship);
  return ship;
}
function createBridgeWindows(ship: THREE.Group, x: number, y: number, z: number) {
  // Not needed anymore - removed
}
function createPropulsionSystem(ship: THREE.Group) {
  // Main engines - larger and more detailed
  for (let i = 0; i < 2; i++) {
    // Engine block
    const engineGeometry = new THREE.BoxGeometry(4, 2.5, 2);
    const engineMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6464
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.set(-10, 0.5, i === 0 ? -2.5 : 2.5);
    engine.userData = {
      system: 'propulsion'
    };
    ship.add(engine);
    // Engine cylinder heads
    for (let j = 0; j < 3; j++) {
      const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
      const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd
      });
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.rotation.x = Math.PI / 2;
      cylinder.position.set(-10 + j - 1, 1.5, i === 0 ? -2.5 : 2.5);
      cylinder.userData = {
        system: 'propulsion'
      };
      ship.add(cylinder);
    }
    // Engine exhaust
    const exhaustGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2, 16);
    const exhaustMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444
    });
    const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaust.position.set(-12, 3, i === 0 ? -2.5 : 2.5);
    exhaust.userData = {
      system: 'propulsion'
    };
    ship.add(exhaust);
  }
  // Propeller shafts
  for (let i = 0; i < 2; i++) {
    const shaftGeometry = new THREE.CylinderGeometry(0.25, 0.25, 8, 16);
    const shaftMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-14, 0, i === 0 ? -2.5 : 2.5);
    shaft.userData = {
      system: 'propulsion'
    };
    ship.add(shaft);
    // Propeller
    const propellerGroup = new THREE.Group();
    propellerGroup.position.set(-18, 0, i === 0 ? -2.5 : 2.5);
    // Create 4 blades
    for (let j = 0; j < 4; j++) {
      const bladeGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.4);
      const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0xbbbb00
      });
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.position.set(0, 0.8, 0);
      blade.rotation.z = j * Math.PI / 2;
      blade.userData = {
        system: 'propulsion'
      };
      propellerGroup.add(blade);
    }
    propellerGroup.userData = {
      system: 'propulsion'
    };
    ship.add(propellerGroup);
  }
  // Thrust bearings
  for (let i = 0; i < 2; i++) {
    const bearingGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16);
    const bearingMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999
    });
    const bearing = new THREE.Mesh(bearingGeometry, bearingMaterial);
    bearing.rotation.z = Math.PI / 2;
    bearing.position.set(-12, 0, i === 0 ? -2.5 : 2.5);
    bearing.userData = {
      system: 'propulsion'
    };
    ship.add(bearing);
  }
  // Gearbox
  for (let i = 0; i < 2; i++) {
    const gearboxGeometry = new THREE.BoxGeometry(2, 1.8, 1.8);
    const gearboxMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666
    });
    const gearbox = new THREE.Mesh(gearboxGeometry, gearboxMaterial);
    gearbox.position.set(-8, 0.5, i === 0 ? -2.5 : 2.5);
    gearbox.userData = {
      system: 'propulsion'
    };
    ship.add(gearbox);
  }
}
function createElectricalSystem(ship: THREE.Group) {
  // Main switchboard
  const switchboardGeometry = new THREE.BoxGeometry(3, 2.5, 0.8);
  const switchboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x6464ff
  });
  const switchboard = new THREE.Mesh(switchboardGeometry, switchboardMaterial);
  switchboard.position.set(-4, 1, -4);
  switchboard.userData = {
    system: 'electrical'
  };
  ship.add(switchboard);
  // Control panels on switchboard
  for (let i = 0; i < 6; i++) {
    const panelGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(-4, 1 + i % 3 * 0.5, -3.61 + Math.floor(i / 3) * 0.5);
    panel.rotation.y = Math.PI / 2;
    panel.userData = {
      system: 'electrical'
    };
    ship.add(panel);
  }
  // Generators - larger and more detailed
  for (let i = 0; i < 2; i++) {
    // Generator base
    const genBaseGeometry = new THREE.BoxGeometry(2.5, 0.5, 2);
    const genBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const genBase = new THREE.Mesh(genBaseGeometry, genBaseMaterial);
    genBase.position.set(-5, 0.25, i === 0 ? 3 : 0);
    genBase.userData = {
      system: 'electrical'
    };
    ship.add(genBase);
    // Generator engine
    const genEngineGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.8);
    const genEngineMaterial = new THREE.MeshStandardMaterial({
      color: 0x6464ff
    });
    const genEngine = new THREE.Mesh(genEngineGeometry, genEngineMaterial);
    genEngine.position.set(-5.5, 1, i === 0 ? 3 : 0);
    genEngine.userData = {
      system: 'electrical'
    };
    ship.add(genEngine);
    // Generator alternator
    const genAltGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const genAltMaterial = new THREE.MeshStandardMaterial({
      color: 0x9999ff
    });
    const genAlt = new THREE.Mesh(genAltGeometry, genAltMaterial);
    genAlt.rotation.z = Math.PI / 2;
    genAlt.position.set(-4, 1, i === 0 ? 3 : 0);
    genAlt.userData = {
      system: 'electrical'
    };
    ship.add(genAlt);
  }
  // Distribution panels - more of them and more detailed
  for (let i = 0; i < 5; i++) {
    const panelGeometry = new THREE.BoxGeometry(0.5, 1.8, 1.2);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x6464ff
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    // Distribute panels throughout the ship
    if (i < 3) {
      panel.position.set(i * 8 - 8, 1.8, 4.5);
    } else {
      panel.position.set((i - 3) * 10, 1.8, -4.5);
    }
    panel.userData = {
      system: 'electrical'
    };
    ship.add(panel);
    // Add panel details
    const detailGeometry = new THREE.PlaneGeometry(0.4, 1.6);
    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const detail = new THREE.Mesh(detailGeometry, detailMaterial);
    detail.position.copy(panel.position);
    detail.position.z += 0.61;
    detail.userData = {
      system: 'electrical'
    };
    ship.add(detail);
  }
  // Cable trays along the ceiling
  const cableTrayGeometry = new THREE.BoxGeometry(25, 0.1, 0.4);
  const cableTrayMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999
  });
  const cableTray = new THREE.Mesh(cableTrayGeometry, cableTrayMaterial);
  cableTray.position.set(0, 2.2, -4);
  cableTray.userData = {
    system: 'electrical'
  };
  ship.add(cableTray);
  const cableTray2 = new THREE.Mesh(cableTrayGeometry, cableTrayMaterial);
  cableTray2.position.set(0, 2.2, 4);
  cableTray2.userData = {
    system: 'electrical'
  };
  ship.add(cableTray2);
  // Cross cable trays
  for (let i = 0; i < 5; i++) {
    const crossTrayGeometry = new THREE.BoxGeometry(0.4, 0.1, 8);
    const crossTray = new THREE.Mesh(crossTrayGeometry, cableTrayMaterial);
    crossTray.position.set(i * 5 - 10, 2.2, 0);
    crossTray.userData = {
      system: 'electrical'
    };
    ship.add(crossTray);
  }
  // Navigation equipment - keep only the colored parts
  // Navigation lights
  const createNavLight = (x: number, y: number, z: number, color: number) => {
    const lightBaseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 16);
    const lightBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const lightBase = new THREE.Mesh(lightBaseGeometry, lightBaseMaterial);
    lightBase.position.set(x, y, z);
    lightBase.userData = {
      system: 'electrical'
    };
    ship.add(lightBase);
    const lightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(x, y + 0.2, z);
    light.userData = {
      system: 'electrical'
    };
    ship.add(light);
  };
  // Port (red) and starboard (green) lights
  createNavLight(14, 0, -5.5, 0xff0000); // Port - red
  createNavLight(14, 0, 5.5, 0x00ff00); // Starboard - green
}
function createHVACSystem(ship: THREE.Group) {
  // Main AC units - larger and more detailed
  for (let i = 0; i < 2; i++) {
    // AC base
    const acBaseGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const acBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const acBase = new THREE.Mesh(acBaseGeometry, acBaseMaterial);
    acBase.position.set(i * 12 - 3, 0.25, -1);
    acBase.userData = {
      system: 'hvac'
    };
    ship.add(acBase);
    // AC unit
    const acGeometry = new THREE.BoxGeometry(2.8, 1.8, 1.8);
    const acMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ff64
    });
    const ac = new THREE.Mesh(acGeometry, acMaterial);
    ac.position.set(i * 12 - 3, 1.4, -1);
    ac.userData = {
      system: 'hvac'
    };
    ship.add(ac);
    // Fan cover
    const fanCoverGeometry = new THREE.CircleGeometry(0.6, 16);
    const fanCoverMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const fanCover = new THREE.Mesh(fanCoverGeometry, fanCoverMaterial);
    fanCover.position.set(i * 12 - 3, 1.4, -0.1);
    fanCover.userData = {
      system: 'hvac'
    };
    ship.add(fanCover);
    // Fan blades
    const fanGroup = new THREE.Group();
    fanGroup.position.set(i * 12 - 3, 1.4, -0.09);
    for (let j = 0; j < 6; j++) {
      const bladeGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.02);
      const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc
      });
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.position.y = 0.25;
      blade.rotation.z = j * Math.PI / 3;
      blade.userData = {
        system: 'hvac'
      };
      fanGroup.add(blade);
    }
    fanGroup.userData = {
      system: 'hvac'
    };
    ship.add(fanGroup);
  }
  // Main ducts - larger system
  const mainDuctGeometry = new THREE.BoxGeometry(25, 0.8, 0.8);
  const mainDuctMaterial = new THREE.MeshStandardMaterial({
    color: 0x64ff64
  });
  const mainDuct = new THREE.Mesh(mainDuctGeometry, mainDuctMaterial);
  mainDuct.position.set(0, 2.2, 0);
  mainDuct.userData = {
    system: 'hvac'
  };
  ship.add(mainDuct);
  // Branch ducts - more of them
  for (let i = 0; i < 6; i++) {
    const branchGeometry = new THREE.BoxGeometry(0.8, 0.8, 3);
    const branchMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ff64
    });
    const branch = new THREE.Mesh(branchGeometry, branchMaterial);
    branch.position.set(i * 4 - 10, 2.2, 1.5);
    branch.userData = {
      system: 'hvac'
    };
    ship.add(branch);
    // Add vents at the end of branches
    const ventGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
    const ventMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd
    });
    const vent = new THREE.Mesh(ventGeometry, ventMaterial);
    vent.position.set(i * 4 - 10, 1, 3);
    vent.userData = {
      system: 'hvac'
    };
    ship.add(vent);
    // Grill lines on vents
    for (let j = 0; j < 3; j++) {
      const grillGeometry = new THREE.BoxGeometry(0.6, 0.01, 0.05);
      const grillMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999
      });
      const grill = new THREE.Mesh(grillGeometry, grillMaterial);
      grill.position.set(i * 4 - 10, 1, 3 + (j - 1) * 0.15);
      grill.userData = {
        system: 'hvac'
      };
      ship.add(grill);
    }
  }
  // Cooling water pumps for AC
  for (let i = 0; i < 2; i++) {
    const pumpGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const pumpMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ff64
    });
    const pump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    pump.position.set(i * 12 - 3, 0.8, -2.5);
    pump.userData = {
      system: 'hvac'
    };
    ship.add(pump);
    // Motor on top
    const motorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const motorMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999
    });
    const motor = new THREE.Mesh(motorGeometry, motorMaterial);
    motor.position.set(i * 12 - 3, 1.45, -2.5);
    motor.userData = {
      system: 'hvac'
    };
    ship.add(motor);
  }
}
function createPipingSystem(ship: THREE.Group) {
  // Main pipes - more of them and more organized
  const createPipe = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, radius: number, color: number) => {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    const pipeGeometry = new THREE.CylinderGeometry(radius, radius, length, 16);
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color
    });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    // Position at center point
    pipe.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
    // Orient the cylinder to point from p1 to p2
    if (x1 !== x2 || z1 !== z2) {
      pipe.lookAt(new THREE.Vector3(x2, y2, z2));
      pipe.rotateX(Math.PI / 2);
    }
    pipe.userData = {
      system: 'piping'
    };
    ship.add(pipe);
    return pipe;
  };
  // Fuel system - yellow pipes
  createPipe(-14, 0.5, 0, -8, 0.5, 0, 0.2, 0xffcc00);
  createPipe(-8, 0.5, 0, -8, 0.5, -2.5, 0.2, 0xffcc00);
  createPipe(-8, 0.5, 0, -8, 0.5, 2.5, 0.2, 0xffcc00);
  // Cooling water - blue pipes
  createPipe(-10, 1, -2.5, -10, 1, 2.5, 0.25, 0x0088ff);
  createPipe(-10, 1, -2.5, -3, 1, -2.5, 0.25, 0x0088ff);
  createPipe(-10, 1, 2.5, -3, 1, 2.5, 0.25, 0x0088ff);
  createPipe(-3, 1, -2.5, -3, 1, 2.5, 0.25, 0x0088ff);
  // Exhaust - dark gray pipes
  createPipe(-12, 3, -2.5, -12, 5, -2.5, 0.4, 0x333333);
  createPipe(-12, 3, 2.5, -12, 5, 2.5, 0.4, 0x333333);
  // Fresh water - light blue
  createPipe(5, 0.5, 3, 5, 2, 3, 0.2, 0x88ffff);
  createPipe(5, 2, 3, 5, 2, -3, 0.2, 0x88ffff);
  createPipe(5, 2, -3, 5, 0.5, -3, 0.2, 0x88ffff);
  // Fire main - red pipes
  createPipe(-13, 0.5, -5, 13, 0.5, -5, 0.25, 0xff3333);
  createPipe(-13, 0.5, 5, 13, 0.5, 5, 0.25, 0xff3333);
  for (let i = 0; i < 6; i++) {
    createPipe(i * 5 - 12, 0.5, -5, i * 5 - 12, 2, -5, 0.2, 0xff3333);
    createPipe(i * 5 - 12, 0.5, 5, i * 5 - 12, 2, 5, 0.2, 0xff3333);
  }
  // Pumps - more of them and more detailed
  for (let i = 0; i < 3; i++) {
    // Pump base
    const pumpBaseGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.8);
    const pumpBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444
    });
    const pumpBase = new THREE.Mesh(pumpBaseGeometry, pumpBaseMaterial);
    pumpBase.position.set(i * 8 - 8, 0.15, 4);
    pumpBase.userData = {
      system: 'piping'
    };
    ship.add(pumpBase);
    // Pump body
    const pumpGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const pumpMaterial = new THREE.MeshStandardMaterial({
      color: 0xff64ff
    });
    const pump = new THREE.Mesh(pumpGeometry, pumpMaterial);
    pump.position.set(i * 8 - 8, 0.7, 4);
    pump.userData = {
      system: 'piping'
    };
    ship.add(pump);
    // Pump motor
    const motorGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.6);
    const motorMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777
    });
    const motor = new THREE.Mesh(motorGeometry, motorMaterial);
    motor.position.set(i * 8 - 8, 1.4, 4);
    motor.userData = {
      system: 'piping'
    };
    ship.add(motor);
  }
  // Tanks - more of them and more varied
  const tankTypes = [{
    size: [2, 2, 2],
    color: 0xff64ff,
    position: [0, 0, 3]
  },
  // General service
  {
    size: [2, 2, 2],
    color: 0xff64ff,
    position: [6, 0, 3]
  },
  // General service
  {
    size: [1.5, 2.5, 1.5],
    color: 0xffcc00,
    position: [-6, 0, 3]
  },
  // Fuel
  {
    size: [1.5, 1.5, 1.5],
    color: 0x88ffff,
    position: [3, 0, -3]
  },
  // Fresh water
  {
    size: [2, 1, 2],
    color: 0x996633,
    position: [9, 0, -3]
  } // Sewage
  ];
  tankTypes.forEach(tank => {
    const [width, height, depth] = tank.size;
    const [x, y, z] = tank.position;
    // Tank body
    const tankGeometry = new THREE.BoxGeometry(width, height, depth);
    const tankMaterial = new THREE.MeshStandardMaterial({
      color: tank.color
    });
    const tankMesh = new THREE.Mesh(tankGeometry, tankMaterial);
    tankMesh.position.set(x, y + height / 2, z);
    tankMesh.userData = {
      system: 'piping'
    };
    ship.add(tankMesh);
    // Tank top connections
    const connGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const connMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999
    });
    const conn = new THREE.Mesh(connGeometry, connMaterial);
    conn.position.set(x, y + height + 0.2, z);
    conn.userData = {
      system: 'piping'
    };
    ship.add(conn);
  });
  // Valves
  for (let i = 0; i < 8; i++) {
    const valveGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const valveMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd
    });
    const valve = new THREE.Mesh(valveGeometry, valveMaterial);
    // Distribute valves throughout the piping system
    if (i < 4) {
      valve.position.set(i * 5 - 8, 0.5, i % 2 === 0 ? -5 : 5);
    } else {
      valve.position.set((i - 4) * 5 - 8, 2, (i - 4) % 2 === 0 ? -5 : 5);
    }
    valve.userData = {
      system: 'piping'
    };
    ship.add(valve);
    // Valve handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.copy(valve.position);
    handle.position.y += 0.3;
    handle.userData = {
      system: 'piping'
    };
    ship.add(handle);
  }
}
function createStructuralElements(ship: THREE.Group) {
  // This function is now empty as we're removing structural elements
  // Keeping it for consistency with existing code
}
function createAdditionalEquipment(ship: THREE.Group) {
  // This function is now empty as we're removing additional equipment
  // Keeping it for consistency with existing code
}
function createDeckCompartments(ship: THREE.Group) {
  // This function is now empty as we're removing deck compartments
  // Keeping it for consistency with existing code
}
function createNavigationEquipment(ship: THREE.Group) {
  // This function is now empty as we're removing navigation equipment
  // Keeping it for consistency with existing code
}