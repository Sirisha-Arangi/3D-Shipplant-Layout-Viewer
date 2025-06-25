import * as THREE from 'three';
export function createShipModel(): THREE.Group {
  const ship = new THREE.Group();
  // Ship hull - make it larger
  const hullGeometry = new THREE.BoxGeometry(30, 5, 12);
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x66cccc,
    transparent: true,
    opacity: 0.7
  });
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.position.y = 0;
  hull.userData = {
    system: 'structural'
  };
  ship.add(hull);
  // Main deck
  const mainDeckGeometry = new THREE.BoxGeometry(28, 0.5, 11);
  const mainDeckMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd
  });
  const mainDeck = new THREE.Mesh(mainDeckGeometry, mainDeckMaterial);
  mainDeck.position.y = 2.5;
  mainDeck.userData = {
    system: 'structural'
  };
  ship.add(mainDeck);
  // Upper deck (bridge)
  const upperDeckGeometry = new THREE.BoxGeometry(10, 0.5, 8);
  const upperDeckMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc
  });
  const upperDeck = new THREE.Mesh(upperDeckGeometry, upperDeckMaterial);
  upperDeck.position.set(8, 5.5, 0);
  upperDeck.userData = {
    system: 'structural'
  };
  ship.add(upperDeck);
  // Bridge structure
  const bridgeGeometry = new THREE.BoxGeometry(8, 3, 6);
  const bridgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.9
  });
  const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
  bridge.position.set(8, 7, 0);
  bridge.userData = {
    system: 'structural'
  };
  ship.add(bridge);
  // Windows on bridge
  createBridgeWindows(ship, 8, 7, 0);
  // Propulsion system (engines)
  createPropulsionSystem(ship);
  // Electrical system
  createElectricalSystem(ship);
  // HVAC system
  createHVACSystem(ship);
  // Piping system
  createPipingSystem(ship);
  // Structural elements
  createStructuralElements(ship);
  // Add additional equipment
  createAdditionalEquipment(ship);
  // Add deck compartments
  createDeckCompartments(ship);
  // Add navigation equipment
  createNavigationEquipment(ship);
  return ship;
}
function createBridgeWindows(ship: THREE.Group, x: number, y: number, z: number) {
  // Front windows
  for (let i = 0; i < 5; i++) {
    const windowGeometry = new THREE.PlaneGeometry(0.8, 1);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(x + 4.01, y, z - 2 + i);
    window.rotation.y = Math.PI / 2;
    window.userData = {
      system: 'structural'
    };
    ship.add(window);
  }
  // Side windows
  for (let i = 0; i < 3; i++) {
    // Port side
    const portWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1), new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }));
    portWindow.position.set(x + 2 - i * 2, y, z + 3.01);
    portWindow.userData = {
      system: 'structural'
    };
    ship.add(portWindow);
    // Starboard side
    const starboardWindow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1), new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }));
    starboardWindow.position.set(x + 2 - i * 2, y, z - 3.01);
    starboardWindow.rotation.y = Math.PI;
    starboardWindow.userData = {
      system: 'structural'
    };
    ship.add(starboardWindow);
  }
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
  // Frames - more of them
  for (let i = 0; i < 11; i++) {
    const frameGeometry = new THREE.BoxGeometry(0.3, 5, 12);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ffff,
      transparent: true,
      opacity: 0.6
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.x = i * 3 - 15;
    frame.userData = {
      system: 'structural'
    };
    ship.add(frame);
  }
  // Longitudinal beams
  for (let i = 0; i < 3; i++) {
    const beamGeometry = new THREE.BoxGeometry(30, 0.3, 0.3);
    const beamMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ffff
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(0, 1 + i * 2, -5.5);
    beam.userData = {
      system: 'structural'
    };
    ship.add(beam);
    const beam2 = new THREE.Mesh(beamGeometry, beamMaterial);
    beam2.position.set(0, 1 + i * 2, 5.5);
    beam2.userData = {
      system: 'structural'
    };
    ship.add(beam2);
  }
  // Deck supports
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 3; j++) {
      const supportGeometry = new THREE.BoxGeometry(0.2, 2.5, 0.2);
      const supportMaterial = new THREE.MeshStandardMaterial({
        color: 0x64ffff
      });
      const support = new THREE.Mesh(supportGeometry, supportMaterial);
      support.position.set(i * 3 - 12, 1.25, j * 5 - 5);
      support.userData = {
        system: 'structural'
      };
      ship.add(support);
    }
  }
  // Bulkheads
  const bulkheadPositions = [-12, -6, 6, 12];
  bulkheadPositions.forEach(x => {
    const bulkheadGeometry = new THREE.BoxGeometry(0.3, 5, 11.5);
    const bulkheadMaterial = new THREE.MeshStandardMaterial({
      color: 0x64ffff,
      transparent: true,
      opacity: 0.7
    });
    const bulkhead = new THREE.Mesh(bulkheadGeometry, bulkheadMaterial);
    bulkhead.position.set(x, 0, 0);
    bulkhead.userData = {
      system: 'structural'
    };
    ship.add(bulkhead);
    // Add door in bulkhead
    const doorGeometry = new THREE.BoxGeometry(0.4, 2, 1);
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(x, 1, 0);
    door.userData = {
      system: 'structural'
    };
    ship.add(door);
    // Door handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(x - 0.25, 1, 0.3);
    handle.userData = {
      system: 'structural'
    };
    ship.add(handle);
  });
  // Railings on upper deck
  const railingMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa
  });
  // Front railing
  for (let i = 0; i < 5; i++) {
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const post = new THREE.Mesh(postGeometry, railingMaterial);
    post.position.set(13, 6, i * 2 - 4);
    post.userData = {
      system: 'structural'
    };
    ship.add(post);
  }
  // Top rail
  const topRailGeometry = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
  const topRail = new THREE.Mesh(topRailGeometry, railingMaterial);
  topRail.rotation.z = Math.PI / 2;
  topRail.position.set(13, 6.5, 0);
  topRail.userData = {
    system: 'structural'
  };
  ship.add(topRail);
  // Middle rail
  const midRailGeometry = new THREE.CylinderGeometry(0.03, 0.03, 8, 8);
  const midRail = new THREE.Mesh(midRailGeometry, railingMaterial);
  midRail.rotation.z = Math.PI / 2;
  midRail.position.set(13, 6, 0);
  midRail.userData = {
    system: 'structural'
  };
  ship.add(midRail);
  // Side railings
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 5; i++) {
      const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
      const post = new THREE.Mesh(postGeometry, railingMaterial);
      post.position.set(13 - i, 6, side * 4);
      post.userData = {
        system: 'structural'
      };
      ship.add(post);
    }
    const sideRailGeometry = new THREE.CylinderGeometry(0.04, 0.04, 5, 8);
    const sideRail = new THREE.Mesh(sideRailGeometry, railingMaterial);
    sideRail.rotation.x = Math.PI / 2;
    sideRail.position.set(10.5, 6.5, side * 4);
    sideRail.userData = {
      system: 'structural'
    };
    ship.add(sideRail);
    const sideMidRailGeometry = new THREE.CylinderGeometry(0.03, 0.03, 5, 8);
    const sideMidRail = new THREE.Mesh(sideMidRailGeometry, railingMaterial);
    sideMidRail.rotation.x = Math.PI / 2;
    sideMidRail.position.set(10.5, 6, side * 4);
    sideMidRail.userData = {
      system: 'structural'
    };
    ship.add(sideMidRail);
  }
}
function createAdditionalEquipment(ship: THREE.Group) {
  // Winch on deck
  const winchBaseGeometry = new THREE.BoxGeometry(2, 0.5, 1.5);
  const winchBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444
  });
  const winchBase = new THREE.Mesh(winchBaseGeometry, winchBaseMaterial);
  winchBase.position.set(12, 2.75, 0);
  winchBase.userData = {
    system: 'structural'
  };
  ship.add(winchBase);
  const drumGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
  const drumMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666
  });
  const drum = new THREE.Mesh(drumGeometry, drumMaterial);
  drum.rotation.z = Math.PI / 2;
  drum.position.set(12, 3.5, 0);
  drum.userData = {
    system: 'structural'
  };
  ship.add(drum);
  // Anchor chain
  const chainGeometry = new THREE.BoxGeometry(0.2, 0.1, 3);
  const chainMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666
  });
  const chain = new THREE.Mesh(chainGeometry, chainMaterial);
  chain.position.set(14, 3, 0);
  chain.userData = {
    system: 'structural'
  };
  ship.add(chain);
  // Ladders between decks
  for (let i = 0; i < 2; i++) {
    const ladderGeometry = new THREE.BoxGeometry(0.1, 3, 1);
    const ladderMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999
    });
    const ladder = new THREE.Mesh(ladderGeometry, ladderMaterial);
    ladder.position.set(i * 16 - 8, 1.5, 0);
    ladder.userData = {
      system: 'structural'
    };
    ship.add(ladder);
    // Ladder rungs
    for (let j = 0; j < 6; j++) {
      const rungGeometry = new THREE.BoxGeometry(0.1, 0.05, 1);
      const rung = new THREE.Mesh(rungGeometry, ladderMaterial);
      rung.position.set(i * 16 - 8, j * 0.5, 0);
      rung.userData = {
        system: 'structural'
      };
      ship.add(rung);
    }
  }
  // Crane on deck
  const craneBaseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
  const craneBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
  });
  const craneBase = new THREE.Mesh(craneBaseGeometry, craneBaseMaterial);
  craneBase.position.set(5, 2.75, -4);
  craneBase.userData = {
    system: 'structural'
  };
  ship.add(craneBase);
  const cranePillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
  const cranePillarMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00
  });
  const cranePillar = new THREE.Mesh(cranePillarGeometry, cranePillarMaterial);
  cranePillar.position.set(5, 4.5, -4);
  cranePillar.userData = {
    system: 'structural'
  };
  ship.add(cranePillar);
  const craneArmGeometry = new THREE.BoxGeometry(4, 0.3, 0.3);
  const craneArmMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00
  });
  const craneArm = new THREE.Mesh(craneArmGeometry, craneArmMaterial);
  craneArm.position.set(7, 6, -4);
  craneArm.userData = {
    system: 'structural'
  };
  ship.add(craneArm);
  const craneWireGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 8);
  const craneWireMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999
  });
  const craneWire = new THREE.Mesh(craneWireGeometry, craneWireMaterial);
  craneWire.position.set(9, 5, -4);
  craneWire.userData = {
    system: 'structural'
  };
  ship.add(craneWire);
  // Cargo hatch
  const hatchGeometry = new THREE.BoxGeometry(3, 0.2, 3);
  const hatchMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });
  const hatch = new THREE.Mesh(hatchGeometry, hatchMaterial);
  hatch.position.set(-2, 2.6, 0);
  hatch.userData = {
    system: 'structural'
  };
  ship.add(hatch);
  // Hatch coaming
  const coamingGeometry = new THREE.BoxGeometry(3.4, 0.4, 3.4);
  const coamingMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
  });
  const coaming = new THREE.Mesh(coamingGeometry, coamingMaterial);
  coaming.position.set(-2, 2.5, 0);
  coaming.userData = {
    system: 'structural'
  };
  ship.add(coaming);
  // Hatch opening (just an indentation)
  const hatchOpeningGeometry = new THREE.BoxGeometry(2.8, 0.1, 2.8);
  const hatchOpeningMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222
  });
  const hatchOpening = new THREE.Mesh(hatchOpeningGeometry, hatchOpeningMaterial);
  hatchOpening.position.set(-2, 2.61, 0);
  hatchOpening.userData = {
    system: 'structural'
  };
  ship.add(hatchOpening);
}
function createDeckCompartments(ship: THREE.Group) {
  // Create cabin walls
  const createCompartment = (x: number, z: number, width: number, depth: number, height: number) => {
    // Floor
    const floorGeometry = new THREE.BoxGeometry(width, 0.1, depth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(x, 2.55, z);
    floor.userData = {
      system: 'structural'
    };
    ship.add(floor);
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.9
    });
    // Front wall
    const frontWallGeometry = new THREE.BoxGeometry(width, height, 0.1);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(x, 2.55 + height / 2, z + depth / 2);
    frontWall.userData = {
      system: 'structural'
    };
    ship.add(frontWall);
    // Back wall
    const backWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    backWall.position.set(x, 2.55 + height / 2, z - depth / 2);
    backWall.userData = {
      system: 'structural'
    };
    ship.add(backWall);
    // Left wall
    const sideWallGeometry = new THREE.BoxGeometry(0.1, height, depth);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(x - width / 2, 2.55 + height / 2, z);
    leftWall.userData = {
      system: 'structural'
    };
    ship.add(leftWall);
    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(x + width / 2, 2.55 + height / 2, z);
    rightWall.userData = {
      system: 'structural'
    };
    ship.add(rightWall);
    // Door in front wall
    const doorGeometry = new THREE.BoxGeometry(0.8, 1.8, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x885533
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(x, 2.55 + 0.9, z + depth / 2);
    door.userData = {
      system: 'structural'
    };
    ship.add(door);
    // Door handle
    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(x + 0.3, 2.55 + 0.9, z + depth / 2 + 0.1);
    handle.userData = {
      system: 'structural'
    };
    ship.add(handle);
  };
  // Create multiple compartments
  createCompartment(8, -2, 4, 3, 2); // Bridge deck cabin
  createCompartment(8, 2, 4, 3, 2); // Bridge deck cabin
  createCompartment(0, -3, 5, 3, 2.5); // Main deck cabin
  createCompartment(0, 3, 5, 3, 2.5); // Main deck cabin
  createCompartment(-8, 0, 4, 8, 2.5); // Engine control room
}
function createNavigationEquipment(ship: THREE.Group) {
  // Radar mast
  const mastGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 16);
  const mastMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999
  });
  const mast = new THREE.Mesh(mastGeometry, mastMaterial);
  mast.position.set(8, 10, 0);
  mast.userData = {
    system: 'electrical'
  };
  ship.add(mast);
  // Radar scanner
  const scannerBaseGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.6);
  const scannerBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });
  const scannerBase = new THREE.Mesh(scannerBaseGeometry, scannerBaseMaterial);
  scannerBase.position.set(8, 11.5, 0);
  scannerBase.userData = {
    system: 'electrical'
  };
  ship.add(scannerBase);
  const scannerGeometry = new THREE.BoxGeometry(2, 0.1, 0.3);
  const scannerMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666
  });
  const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
  scanner.position.set(8, 11.6, 0);
  scanner.userData = {
    system: 'electrical'
  };
  ship.add(scanner);
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
  createNavLight(14, 3, -5.5, 0xff0000); // Port - red
  createNavLight(14, 3, 5.5, 0x00ff00); // Starboard - green
  createNavLight(14, 3, 0, 0xffffff); // Masthead - white
  createNavLight(-14, 3, 0, 0xffffff); // Stern - white
  // Antennas
  for (let i = 0; i < 3; i++) {
    const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(8 + i - 1, 12, 0);
    antenna.userData = {
      system: 'electrical'
    };
    ship.add(antenna);
  }
  // Bridge console
  const consoleBaseGeometry = new THREE.BoxGeometry(3, 1, 0.8);
  const consoleBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444
  });
  const consoleBase = new THREE.Mesh(consoleBaseGeometry, consoleBaseMaterial);
  consoleBase.position.set(8, 6.5, -2);
  consoleBase.userData = {
    system: 'electrical'
  };
  ship.add(consoleBase);
  const consoleTopGeometry = new THREE.BoxGeometry(3, 0.5, 0.8);
  const consoleTopMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });
  const consoleTop = new THREE.Mesh(consoleTopGeometry, consoleTopMaterial);
  consoleTop.position.set(8, 7.2, -2.2);
  consoleTop.rotation.x = Math.PI / 6;
  consoleTop.userData = {
    system: 'electrical'
  };
  ship.add(consoleTop);
  // Screens and controls on console
  for (let i = 0; i < 3; i++) {
    const screenGeometry = new THREE.PlaneGeometry(0.8, 0.6);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x222266,
      emissive: 0x222266,
      emissiveIntensity: 0.5
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(7 + i - 0.5, 7.2, -2.15);
    screen.rotation.x = Math.PI / 6;
    screen.userData = {
      system: 'electrical'
    };
    ship.add(screen);
  }
  // Helm wheel
  const wheelGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(8, 7, -1.5);
  wheel.rotation.x = Math.PI / 2;
  wheel.userData = {
    system: 'structural'
  };
  ship.add(wheel);
  // Spokes on wheel
  for (let i = 0; i < 6; i++) {
    const spokeGeometry = new THREE.BoxGeometry(0.03, 0.03, 0.6);
    const spokeMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333
    });
    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
    spoke.position.set(8, 7, -1.5);
    spoke.rotation.z = i * Math.PI / 3;
    spoke.userData = {
      system: 'structural'
    };
    ship.add(spoke);
  }
  // Chair
  const chairBaseGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const chairBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333
  });
  const chairBase = new THREE.Mesh(chairBaseGeometry, chairBaseMaterial);
  chairBase.position.set(8, 6, -1);
  chairBase.userData = {
    system: 'structural'
  };
  ship.add(chairBase);
  const chairSeatGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
  const chairSeatMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000aa
  });
  const chairSeat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial);
  chairSeat.position.set(8, 6.5, -1);
  chairSeat.userData = {
    system: 'structural'
  };
  ship.add(chairSeat);
  const chairBackGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.1);
  const chairBack = new THREE.Mesh(chairBackGeometry, chairSeatMaterial);
  chairBack.position.set(8, 6.8, -1.25);
  chairBack.userData = {
    system: 'structural'
  };
  ship.add(chairBack);
}