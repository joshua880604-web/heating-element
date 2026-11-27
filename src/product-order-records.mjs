const recordProfiles = [
  [
    ['thermocouples', 'rtd', 'ntc-thermistor-probes', 'duct-temperature-sensors'],
    [
      ['Probe assembly drawing', 'Match the seating face, sensing point, insertion length, sheath material, lead exit and connector or terminal assignment.'],
      ['Sensor specification or inspection record', 'Match the sensing type and curve to the input. Confirm the stated tolerance across the required temperature interval, including the lead transition conditions.'],
    ],
  ],
  [
    ['thin-film-rtd-elements', 'wire-wound-rtd-elements'],
    [
      ['Element and lead drawing', 'Confirm the element envelope, lead layout, attachment method and allowable assembly exposure.'],
      ['Element data or inspection record', 'Match the nominal resistance, curve, class and applicable class interval. Specify the excitation current and test temperature when comparing readings.'],
    ],
  ],
  [
    ['explosion-proof-thermocouples'],
    [
      ['Assembly marking and connection drawing', 'Match the complete probe or head marking and installed connection, including gland, process port and sensor construction.'],
      ['Approval documents for the ordered assembly', 'Check the specified protection marking, approval scope, required ambient and process conditions, and applicable drawing or certificate revision.'],
    ],
  ],
  [
    ['fast-response-thermocouples'],
    [
      ['Tip and installation drawing', 'Locate the junction relative to the probe tip and mounting face. Check the sheath or bead size and installed depth.'],
      ['Response test record', 'Use the same medium, flow or contact, temperature step and response criterion when comparing two probes. Record the instrument sample rate.'],
    ],
  ],
  [
    ['ds18b20-sensors'],
    [
      ['Probe drawing and pinout', 'Match the sensing IC, sheath length and diameter, cable material and pin assignments at the 1-Wire host.'],
      ['Assembly limits and sealing record', 'Check the probe, lead and connector limits. For a required ingress rating, verify which sections were tested, at what depth and for how long.'],
    ],
  ],
  [
    ['bimetal-thermometers', 'gas-actuated-thermometers'],
    [
      ['Dial and stem drawing', 'Check the dial range and units, mounting orientation, process connection, sensing depth and capillary route where applicable.'],
      ['Instrument specification or calibration record', 'Check the accuracy basis, calibrated interval and test conditions for the installed sensing arrangement.'],
    ],
  ],
  [
    ['handheld-infrared-pyrometers', 'infrared-thermocouple-sensors'],
    [
      ['Optical layout and output details', 'Confirm the working distance, target spot size, viewing angle and receiver or display configuration.'],
      ['Instrument specification or test record', 'Check the stated temperature range and accuracy against target emissivity, background conditions and the optical path used in service.'],
    ],
  ],
  [
    ['industrial-digital-thermometers', 'handheld-thermocouple-readers', 'thermocouple-data-loggers', 'wireless-thermocouple-systems'],
    [
      ['Instrument and probe interface', 'Match the complete instrument version, channel count, sensor type and the connector or terminal assignments.'],
      ['Instrument data and accuracy conditions', 'Check the input range, resolution and accuracy basis. Specify sampling or reporting interval and the probe accuracy when comparing a complete channel.'],
    ],
  ],
  [
    ['sensor-accessories', 'thermocouple-connection-heads', 'thermocouple-bayonet-adapters',
      'thermocouple-connectors', 'thermocouple-terminal-blocks', 'rtd-connectors', 'thermocouple-selector-switches'],
    [
      ['Mating interface drawing', 'Match the parts on both sides of the interface, the mounting dimensions, contact or pin assignments where applicable, and cable or tool clearance.'],
      ['Component specification', 'Check materials and temperature limits at the installed interface. Match the pinout and signal contact material where the component carries a sensor signal.'],
    ],
  ],
  [
    ['thermowells', 'ceramic-thermocouple-protection-tubes', 'quartz-thermocouple-protection-tubes'],
    [
      ['Protection tube or thermowell drawing', 'Verify material grade, outside profile, usable bore depth, probe seating reference and installed insertion length.'],
      ['Service or material documentation', 'Check the process environment and temperature for the specified material. For a pressure boundary, review the rated service conditions and required evidence for the complete assembly.'],
    ],
  ],
  [
    ['thermocouple-feedthroughs'],
    [
      ['Feedthrough interface drawing', 'Match the flange and gasket or seal, pole count and pinout, signal alloys and access on each side of the chamber.'],
      ['Vacuum and thermal test record', 'Verify the specified leak rate, test method and bakeout conditions for the same seal and electrical configuration.'],
    ],
  ],
  [
    ['thermocouple-vacuum-gauge-tubes'],
    [
      ['Gauge tube and connection drawing', 'Confirm the gauge controller, tube model, process fitting and terminal functions.'],
      ['Gauge specification or calibration record', 'Check the pressure range with the specified controller and calibration gas. Confirm any gas correction needed for the process.'],
    ],
  ],
  [
    ['thermocouple-extension-wire', 'fine-wire-thermocouples'],
    [
      ['Conductor and termination specification', 'Verify the wire or probe designation, alloy of each leg, conductor sizes, insulation and termination for the drawing revision.'],
      ['Tolerance and temperature documentation', 'Match the declared sensing, extension or compensating grade to its stated conditions. Check continuous and peak exposure separately at the wire and terminations.'],
    ],
  ],
  [
    ['ceramic-thermocouple-insulators'],
    [
      ['Ceramic profile drawing', 'Check the number, diameter and spacing of the bores, the body dimensions, edge finish and fit with the wire or support.'],
      ['Material specification', 'Confirm the ceramic grade and the allowable atmosphere and temperature at the installed position.'],
    ],
  ],
  [
    ['thermocouple-welders'],
    [
      ['Welder and tooling identification', 'Match the power supply, electrode or fixture, supported wire sizes and the intended junction geometry.'],
      ['Weld acceptance record', 'Document the wire alloys, settings and inspection method for the junction samples used to qualify the setup.'],
    ],
  ],
  [
    ['tubular-heaters', 'defrost-heaters'],
    [
      ['Formed element drawing', 'Confirm the tube centerline profile, sheath diameter and alloy, active span, cold ends, supports and terminal orientation.'],
      ['Rating and circuit documentation', 'Match voltage, phase and watts per circuit to the same drawing revision. Verify the intended medium, mounting and limits during the operating cycle.'],
    ],
  ],
  [
    ['immersion-heaters'],
    [
      ['Wetted assembly drawing', 'Mark the mounting face, seal, wetted materials, active zone, minimum liquid level and bundle withdrawal path.'],
      ['Rating and operating conditions', 'Match voltage and power per circuit with the approved fluid, operating temperature and minimum heat removal conditions. For an assembly that retains pressure, confirm the rated conditions and test documentation.'],
    ],
  ],
  [
    ['circulation-heaters'],
    [
      ['Vessel, port and wiring drawings', 'Locate inlet, outlet, heated section, flow and temperature sensing points, and the electrical zones.'],
      ['Thermal duty and acceptance record', 'Tie power and phase to the minimum flow, inlet and outlet targets, design pressure and fluid. Confirm any required flow and over-temperature interlocks.'],
    ],
  ],
  [
    ['duct-heaters', 'industrial-unit-heaters'],
    [
      ['Air path and mounting drawing', 'Check the opening, element or unit envelope, flow direction, supports, service clearance and installed temperature sensor position.'],
      ['Duty and electrical documentation', 'Match voltage, phase and staged load to the minimum airflow and target temperature rise. Review the temperature protection and airflow provisions with the equipment drawing.'],
    ],
  ],
  [
    ['cartridge-heaters', 'hot-plate-heating-elements', 'coil-heaters', 'strip-heaters'],
    [
      ['Heater and tool drawings', 'Check the heater envelope and tolerances, contact or insertion geometry, active span and cold end, retaining features and cable or terminal access.'],
      ['Electrical rating and test conditions', 'Verify rated voltage and watts for the defined active area. Check the stated cold resistance at its reference temperature and record any required insulation test conditions.'],
    ],
  ],
  [
    ['cast-in-aluminum-heaters', 'cast-iron-plate-heaters'],
    [
      ['Casting, heater and machining drawings', 'Match the contact surface, embedded-element position, hole depths and locations, and terminal and sensor access.'],
      ['Rating and surface test conditions', 'Verify the voltage and power of each zone. If surface uniformity or flatness is specified, record test temperature, support conditions and measurement positions.'],
    ],
  ],
  [
    ['band-heaters', 'metal-jacketed-drum-heaters', 'crankcase-heaters'],
    [
      ['Heater and mating surface drawings', 'Match the installed contact diameter or mounting interface, active width, fasteners and orientation of terminals or leads.'],
      ['Rating and contact conditions', 'Confirm voltage and watts, operating surface temperature and duty cycle. Review the sensor location and the allowable temperature at the leads and connections.'],
    ],
  ],
  [
    ['flexible-heaters', 'drum-base-heaters'],
    [
      ['Outline and heating-zone drawing', 'Mark the active area, cutouts, attachment method, lead exit and temperature sensor position. Include curvature or mounted footprint and the finished thickness.'],
      ['Rating and installation conditions', 'Match voltage and watts to the mounting surface and thermal duty. Check the limits for the heater, attachment materials and lead transition at their installed positions.'],
    ],
  ],
  [
    ['heated-hoses'],
    [
      ['Hose assembly drawing', 'Verify hose length, end fittings, heating-zone limits, insulation, installed bend radius and temperature-sensor position.'],
      ['Operating and electrical limits', 'Match fluid, operating temperature and pressure to the hose and fittings. Confirm voltage, watts and protective controls for the same assembly.'],
    ],
  ],
  [
    ['infrared-heaters'],
    [
      ['Emitter and reflector drawing', 'Match the active radiating span, end clearances, mounting orientation and working distance to the target.'],
      ['Rating and operating conditions', 'Verify rated voltage and power and the emitter specification. Review the switching, enclosure ventilation and test conditions against the required heat pattern.'],
    ],
  ],
  [
    ['silicon-carbide-heating-elements', 'mosi2-heating-elements', 'open-coil-heaters', 'ceramic-fiber-heaters', 'vacuum-chamber-heaters'],
    [
      ['Hot-zone and termination drawings', 'Check the active and terminal sections, supports, installation clearance, furnace or chamber atmosphere and expansion space.'],
      ['Element grade and circuit documentation', 'Confirm the material and allowable duty. Compare resistance only at the specified reference conditions and match the supply and control arrangement to the approved design.'],
    ],
  ],
  [
    ['ptc-ceramic-heaters', 'enclosure-heaters', 'industrial-convection-heaters'],
    [
      ['Heater and enclosure layout', 'Check mounting points, orientation, heat transfer path, clearance around terminals and the position of any thermostat or sensor.'],
      ['Rating and load conditions', 'Match voltage and thermal output to the published temperature or airflow conditions. Check startup current and over-temperature protection as specified for the equipment.'],
    ],
  ],
  [
    ['pellet-stove-igniters'],
    [
      ['Installed igniter and holder drawing', 'Match the locating collar or flange, heated tip position, clearance to the air passage and lead connector.'],
      ['Igniter and equipment electrical data', 'Verify rated voltage and power against the original part and controller. Include the intended ignition cycle and airflow when comparing test results.'],
    ],
  ],
  [
    ['heating-cables'],
    [
      ['Route and termination schedule', 'Mark the heated length, supply end, joints, bends, insulation and supports. Match the connection and end-seal specifications.'],
      ['Cable rating and design conditions', 'Confirm voltage and whether the rating is stated per length or per circuit. Check installation and exposure limits, cold-start conditions and the controller requirements for the selected cable.'],
    ],
  ],
  [
    ['high-temperature-lead-wire'],
    [
      ['Lead construction and end drawing', 'Check conductor gauge or area, strand and insulation construction, jacket diameter, and terminal or lug dimensions.'],
      ['Wire and terminal data', 'Match voltage, current and temperature limits for the installed environment, including bundling and the temperature at the termination.'],
    ],
  ],
  [
    ['pid-temperature-controllers', 'heater-control-panels', 'temperature-limit-controllers',
      'hot-runner-temperature-controllers', 'heat-trace-controllers'],
    [
      ['Order code and wiring drawings', 'Match supply, input types, output and alarm options, panel fit and terminal assignments for the required configuration.'],
      ['Control and safety function requirements', 'Verify the load, switching interface, setpoints and independent limits required by the equipment. Include the specified trip and reset behavior in acceptance checks.'],
    ],
  ],
  [
    ['solid-state-relays', 'scr-power-controllers', 'ceramic-power-terminal-blocks'],
    [
      ['Mounting and terminal drawings', 'Check the equipment interface, channel layout, wire sizes, terminal clearance and cooling arrangement.'],
      ['Electrical ratings for the installed conditions', 'Match the rated circuit voltage and load current to the device and ambient conditions. Include the applicable heat sink, ventilation and any required switching or insulation characteristics.'],
    ],
  ],
  [
    ['rtd-temperature-transmitters', 'thermocouple-temperature-transmitters', 'din-rail-temperature-transmitters',
      'thermocouple-signal-conditioners', 'thermocouple-multiplexers'],
    [
      ['Order code and terminal diagram', 'Confirm the sensor input, channel or wiring arrangement, supply and output for the required version.'],
      ['Input and output acceptance checks', 'Specify the configured range, reference signal and corresponding output at each test point. Include the receiver load and any required isolation or fault behavior.'],
    ],
  ],
  [
    ['capillary-thermostats', 'bimetal-temperature-switches'],
    [
      ['Mount, sensor and contact drawings', 'Match the sensing location, travel or bulb and capillary routing, terminal positions and original switch contact arrangement.'],
      ['Switching and load specification', 'Check the actuation and reset temperatures, permitted deviation, cycle conditions and load rating for the specified contacts.'],
    ],
  ],
  [
    ['thermocouple-calibrators', 'rtd-calibrators'],
    [
      ['Instrument configuration and connection diagram', 'Verify the supported input or output modes, sensor curves, terminal assignments and reference-junction or excitation conditions.'],
      ['Calibration specification or record', 'Match resolution and accuracy to the required points, ranges and ambient conditions. Identify the reference and test date if a calibration record is needed.'],
    ],
  ],
  [
    ['dry-block-calibrators', 'temperature-calibration-baths'],
    [
      ['Working zone and probe layout', 'Confirm the insert or bath dimensions, usable immersion depth, probe spacing and reference probe position.'],
      ['Calibration performance conditions', 'Check setpoints, stability and uniformity under the actual loading and settling conditions. Specify the reference and measurement uncertainty for acceptance.'],
    ],
  ],
];

const recordsByProduct = new Map(recordProfiles.flatMap(([ids, records]) => ids.map(id => [id, records])));
const generalRecords = [
  ['Part or assembly drawing', 'Confirm the identification, installed dimensions, mating components and applicable drawing revision.'],
  ['Specification or inspection record', 'Match the required ratings, measurement conditions and acceptance limits to the same configuration.'],
];

export function productModelRecords(product, productsById) {
  for (let current = product; current; current = productsById.get(current.parent)) {
    const records = recordsByProduct.get(current.id);
    if (records) return records;
  }
  return generalRecords;
}
