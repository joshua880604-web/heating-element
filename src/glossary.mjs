export const glossary = [
  {
    id: 'bayonet-thermocouple', name: 'Bayonet Thermocouple',
    definition: 'A thermocouple with a bayonet cap that engages a matching adapter. Some assemblies use a spring to maintain contact between the probe tip and the measurement surface.',
    related: ['Industrial Thermocouples', '/thermocouples/'],
  },
  {
    id: 'cartridge-heater', name: 'Cartridge Heater',
    definition: 'A cylindrical electric heater designed to transfer heat to a solid material through a fitted bore, such as a mold, die or sealing jaw.',
    related: ['Custom Cartridge Heaters', '/heating-elements/cartridge-heaters/'],
  },
  {
    id: 'cold-end', name: 'Cold End',
    definition: 'The length of a heater outside the active heated section, often near a termination or mounting point. Adjacent hot sections can still transfer heat into the cold end.',
    related: ['Heating Element Watt Density', '/resources/heating-element-watt-density/'],
  },
  {
    id: 'cold-junction-compensation', name: 'Cold-Junction Compensation',
    definition: 'A correction an instrument applies for the temperature at the thermocouple reference connection so it can convert measured voltage into the temperature at the sensing junction.',
    related: ['Thermocouple vs. RTD', '/resources/thermocouple-vs-rtd/'],
  },
  {
    id: 'duct-heater', name: 'Duct Heater',
    definition: 'An assembly that heats air passing through a duct. Minimum airflow, inlet temperature, required temperature rise and duct dimensions are inputs to selection.',
    related: ['Industrial Duct Heaters', '/heating-elements/duct-heaters/'],
  },
  {
    id: 'finned-tubular-heater', name: 'Finned Tubular Heater',
    definition: 'A tubular heating element with metal fins around its sheath. The fins increase the exposed area available to transfer heat to moving air.',
    related: ['Finned Tubular Heaters', '/heating-elements/tubular-heaters/finned/'],
  },
  {
    id: 'flanged-immersion-heater', name: 'Flanged Immersion Heater',
    definition: 'An immersion heater mounted through a vessel flange. The flange establishes the mounting and sealing interface, while the heated sections extend into the liquid.',
    related: ['Flanged Immersion Heaters', '/heating-elements/immersion-heaters/flanged/'],
  },
  {
    id: 'grounded-junction', name: 'Grounded Junction',
    definition: 'A thermocouple junction bonded to the probe sheath. The bond creates an electrical connection to the sheath and can affect thermal response.',
    related: ['Grounded vs. Ungrounded Thermocouples', '/resources/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'heat-trace-cable', name: 'Heat Trace Cable',
    definition: 'An electric heating cable applied along a pipe or equipment surface to offset heat loss, maintain a process temperature or help protect against freezing.',
    related: ['Heat Trace Cables', '/heating-elements/heating-cables/'],
  },
  {
    id: 'heated-length', name: 'Heated Length',
    definition: 'The active length over which an element generates heat. Use heated length, rather than overall length, when calculating cylindrical sheath area for watt density.',
    related: ['Heating Element Watt Density', '/resources/heating-element-watt-density/'],
  },
  {
    id: 'hot-runner-coil-heater', name: 'Hot Runner Coil Heater',
    definition: 'A coiled heating element wrapped around a hot runner nozzle in molding equipment. Nozzle fit, heated length, lead exit and sensor position affect the specification.',
    related: ['Coil & Hot Runner Heaters', '/heating-elements/coil-heaters/'],
  },
  {
    id: 'immersion-heater', name: 'Immersion Heater',
    definition: 'A heating element whose active section runs submerged to transfer heat directly to a liquid. Fluid compatibility, minimum submergence and watt density affect selection.',
    related: ['Industrial Immersion Heaters', '/heating-elements/immersion-heaters/'],
  },
  {
    id: 'infrared-heating-element', name: 'Infrared Heating Element',
    definition: 'An element that warms a target by radiation. Absorption at the target, working distance and exposure time affect the heating result.',
    related: ['Infrared Heating Elements', '/heating-elements/infrared-heaters/'],
  },
  {
    id: 'insertion-length', name: 'Insertion Length',
    definition: 'The distance a probe or immersion heater extends from a specified reference face into the equipment, typically measured from the seating surface shown on its drawing.',
    related: ['Industrial Thermocouples', '/thermocouples/'],
  },
  {
    id: 'mineral-insulated-thermocouple', name: 'Mineral Insulated (MI) Thermocouple',
    definition: 'A thermocouple construction in which compacted mineral insulation separates the conductors within a metal sheath.',
    related: ['Mineral Insulated Thermocouples', '/thermocouples/mineral-insulated/'],
  },
  {
    id: 'pt100', name: 'Pt100',
    definition: 'A platinum resistance temperature detector with a nominal resistance of 100 ohms at 0 °C. The instrument and wiring configuration are part of the measurement.',
    related: ['RTD & Pt100 Sensors', '/temperature-sensors/rtd/'],
  },
  {
    id: 'ptc-heating-element', name: 'PTC Heating Element',
    definition: 'A heating element designed around a positive temperature coefficient of resistance. Its resistance rises with temperature over the designed operating region, changing power at a fixed supply voltage.',
    related: ['PTC & Ceramic Heating Elements', '/heating-elements/ptc-ceramic-heaters/'],
  },
  {
    id: 'rtd', name: 'RTD',
    definition: 'A resistance temperature detector uses the change in electrical resistance of a sensing element to determine temperature. Pt100 is a common platinum RTD type.',
    related: ['Thermocouple vs. RTD', '/resources/thermocouple-vs-rtd/'],
  },
  {
    id: 'screw-plug-immersion-heater', name: 'Screw Plug Immersion Heater',
    definition: 'An immersion heater with a threaded plug for mounting into a matching tank or vessel port. Thread form, size, sealing and insertion clearance are key dimensions.',
    related: ['Screw Plug Immersion Heaters', '/heating-elements/immersion-heaters/screw-plug/'],
  },
  {
    id: 'sheath', name: 'Sheath',
    definition: 'The outer protective tube of a sheathed sensor or heater. Material and thickness affect compatibility with the process, mechanical protection and heat transfer.',
    related: ['Custom Tubular Heaters', '/heating-elements/tubular-heaters/'],
  },
  {
    id: 'silicone-rubber-heater', name: 'Silicone Rubber Heater',
    definition: 'A flexible heater with a resistive element incorporated into a silicone rubber construction, shaped to fit a surface, enclosure or assembly.',
    related: ['Flexible & Silicone Rubber Heaters', '/heating-elements/flexible-heaters/'],
  },
  {
    id: 'thermocouple', name: 'Thermocouple',
    definition: 'A temperature sensor made from two dissimilar conductors. Its thermoelectric voltage depends on the temperatures at the sensing junction and reference connection.',
    related: ['Thermocouple Types and Selection', '/resources/thermocouple-types/'],
  },
  {
    id: 'thermowell', name: 'Thermowell',
    definition: 'A closed-end protective fitting that separates a temperature sensor from a process fluid. Its material, mounting and bore must suit the vessel and the probe.',
    related: ['Thermocouple Accessories', '/temperature-sensors/accessories/'],
  },
  {
    id: 'tubular-heating-element', name: 'Tubular Heating Element',
    definition: 'An electric resistance element enclosed within an insulated metal tube. The tube can be straight or formed, with sheath and mounting chosen for the application.',
    related: ['Custom Tubular Heaters', '/heating-elements/tubular-heaters/'],
  },
  {
    id: 'type-j-thermocouple', name: 'Type J Thermocouple',
    definition: 'An iron–copper-nickel thermocouple. The probe, extension wire and instrument input must match Type J for the measurement to use the correct voltage-to-temperature relationship.',
    related: ['Type J Thermocouples', '/thermocouples/type-j/'],
  },
  {
    id: 'type-k-thermocouple', name: 'Type K Thermocouple',
    definition: 'A thermocouple type that uses two nickel-based alloys. The application limits of a Type K probe also depend on its sheath, junction, leads and operating conditions.',
    related: ['Type K Thermocouples', '/thermocouples/type-k/'],
  },
  {
    id: 'ungrounded-junction', name: 'Ungrounded Junction',
    definition: 'A thermocouple junction separated from the metal sheath by insulation. This construction provides electrical isolation between the junction and sheath.',
    related: ['Grounded vs. Ungrounded Thermocouples', '/resources/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'watt-density', name: 'Watt Density',
    definition: 'Electrical power divided by active heating surface area, often expressed in W/cm² or W/in². For a cylindrical tubular sheath, surface area is π times sheath diameter times active heated length.',
    related: ['Heating Element Watt Density', '/resources/heating-element-watt-density/'],
  },
];
