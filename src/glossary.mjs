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
    id: 'cartridge-heater-bore-clearance', name: 'Cartridge Heater Bore Clearance',
    definition: 'The difference between the bore diameter and the heater outside diameter at a specified temperature. The allowable fit depends on heat transfer, machining tolerance, operating temperature and removal needs.',
    related: ['Custom Cartridge Heaters', '/heating-elements/cartridge-heaters/'],
  },
  {
    id: 'cold-end', name: 'Cold End',
    definition: 'The length of a heater outside the active heated section, often near a termination or mounting point. Adjacent hot sections can still transfer heat into the cold end.',
    related: ['Heating Element Watt Density', '/guides/heating-element-watt-density/'],
  },
  {
    id: 'cold-junction-compensation', name: 'Cold-Junction Compensation',
    definition: 'A correction an instrument applies for the temperature at the thermocouple reference connection so it can convert measured voltage into the temperature at the sensing junction.',
    related: ['Thermocouple vs. RTD', '/guides/thermocouple-vs-rtd/'],
  },
  {
    id: 'duct-heater', name: 'Duct Heater',
    definition: 'An assembly that heats air passing through a duct. Minimum airflow, inlet temperature, required temperature rise and duct dimensions are inputs to selection.',
    related: ['Industrial Duct Heaters', '/heating-elements/duct-heaters/'],
  },
  {
    id: 'exposed-junction', name: 'Exposed Junction',
    definition: 'A thermocouple junction where the joined conductors are exposed to the measurement medium. Direct exposure can reduce response time when the conductors can tolerate the environment.',
    related: ['Grounded vs. Ungrounded Thermocouples', '/guides/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'finned-strip-heater', name: 'Finned Strip Heater',
    definition: 'A flat-bodied electric heating element with fins that add surface area for air heating. The strip and fin profile determine the mounting and airflow clearances.',
    related: ['Finned Strip Heaters', '/heating-elements/strip-heaters/finned/'],
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
    related: ['Grounded vs. Ungrounded Thermocouples', '/guides/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'heat-trace-cable', name: 'Heat Trace Cable',
    definition: 'An electric heating cable applied along a pipe or equipment surface to offset heat loss, maintain a process temperature or help protect against freezing.',
    related: ['Heat Trace Cables', '/heating-elements/heating-cables/'],
  },
  {
    id: 'heated-length', name: 'Heated Length',
    definition: 'The active length over which an element generates heat. Use heated length, rather than overall length, when calculating cylindrical sheath area for watt density.',
    related: ['Heating Element Watt Density', '/guides/heating-element-watt-density/'],
  },
  {
    id: 'heater-insulation-resistance', name: 'Heater Insulation Resistance',
    definition: 'The electrical resistance of the insulation path between a heater’s live conductors and its metallic sheath or other accessible metal parts. Test conditions, moisture and temperature affect the measured value.',
    related: ['Custom Tubular Heaters', '/heating-elements/tubular-heaters/'],
  },
  {
    id: 'heater-lead-wire-insulation', name: 'Heater Lead Wire Insulation',
    definition: 'The dielectric covering around heater lead conductors. Select it for the voltage, local temperature at the lead exit, routing and environmental exposure.',
    related: ['How to Choose an Industrial Heating Element', '/guides/choose-a-heating-element/'],
  },
  {
    id: 'heater-sheath-temperature', name: 'Heater Sheath Temperature',
    definition: 'The temperature at the outer surface of a sheathed heating element. It depends on power per unit surface area, the medium, flow, deposits and heat transfer conditions.',
    related: ['Heating Element Watt Density', '/guides/heating-element-watt-density/'],
  },
  {
    id: 'hot-runner-coil-heater', name: 'Hot Runner Coil Heater',
    definition: 'A coiled heating element wrapped around a hot runner nozzle in molding equipment. Nozzle fit, heated length, lead exit and sensor position affect the specification.',
    related: ['Coil & Hot Runner Heaters', '/heating-elements/coil-heaters/'],
  },
  {
    id: 'iec-60584', name: 'IEC 60584',
    definition: 'A series of International Electrotechnical Commission standards for thermocouples. Part 1 covers reference electromotive force and tolerances, and Part 3 covers extension and compensating cables.',
    related: ['Thermocouple Types and Selection', '/guides/thermocouple-types/'],
  },
  {
    id: 'iec-60584-3', name: 'IEC 60584-3',
    definition: 'The part of IEC 60584 that specifies tolerances and identification for thermocouple extension and compensating cables, including the IEC color convention.',
    related: ['Thermocouple Wire Color Codes and Polarity', '/guides/thermocouple-wire-color-code/'],
  },
  {
    id: 'iec-60751', name: 'IEC 60751',
    definition: 'The IEC standard for industrial platinum resistance thermometers and temperature sensors. It specifies the nominal temperature–resistance relationship and tolerance classes for covered platinum RTDs.',
    related: ['Pt100 vs. Pt1000 RTD Sensors', '/guides/pt100-vs-pt1000/'],
  },
  {
    id: 'immersion-heater', name: 'Immersion Heater',
    definition: 'A heating element whose active section runs submerged to transfer heat directly to a liquid. Fluid compatibility, minimum submergence and watt density affect selection.',
    related: ['Industrial Immersion Heaters', '/heating-elements/immersion-heaters/'],
  },
  {
    id: 'immersion-heater-dry-firing', name: 'Immersion Heater Dry Firing',
    definition: 'Energizing a liquid immersion heater with part or all of its active section above the liquid. The reduced heat removal can cause the heater sheath to overheat.',
    related: ['Industrial Immersion Heater Sizing Guide', '/guides/immersion-heater-sizing/'],
  },
  {
    id: 'infrared-heating-element', name: 'Infrared Heating Element',
    definition: 'An element that warms a target by radiation. Absorption at the target, working distance and exposure time affect the heating result.',
    related: ['Infrared Heating Elements', '/heating-elements/infrared-heaters/'],
  },
  {
    id: 'insertion-length', name: 'Insertion Length',
    definition: 'The distance a probe or immersion heater extends from a specified reference face into the equipment, typically measured from the seating surface shown on its drawing.',
    related: ['Threaded Thermocouple Probes', '/thermocouples/threaded-probes/'],
  },
  {
    id: 'mineral-insulated-thermocouple', name: 'Mineral Insulated (MI) Thermocouple',
    definition: 'A thermocouple construction in which compacted mineral insulation separates the conductors within a metal sheath.',
    related: ['Mineral Insulated Thermocouples', '/thermocouples/mineral-insulated/'],
  },
  {
    id: 'minimum-submergence', name: 'Minimum Submergence',
    definition: 'The minimum liquid coverage required above the active section of an immersion heater for its specified installation. The reference point, mounting orientation and level limits belong on the heater or tank drawing.',
    related: ['Industrial Immersion Heater Sizing Guide', '/guides/immersion-heater-sizing/'],
  },
  {
    id: 'over-the-side-immersion-heater', name: 'Over-the-Side Immersion Heater',
    definition: 'An immersion heater that enters an open tank from above and is mounted at the rim or on a support. The active section operates below the minimum liquid level.',
    related: ['Over-the-Side Immersion Heaters', '/heating-elements/immersion-heaters/over-the-side/'],
  },
  {
    id: 'pt100', name: 'Pt100',
    definition: 'A platinum resistance temperature detector with a nominal resistance of 100 ohms at 0 °C. The instrument and wiring configuration are part of the measurement.',
    related: ['RTD & Pt100 Sensors', '/temperature-sensors/rtd/'],
  },
  {
    id: 'pt100-tolerance-class', name: 'Pt100 Tolerance Class',
    definition: 'A designation for permissible deviation from the nominal Pt100 curve over the applicable temperature range. The specified class applies to the covered sensing element or thermometer, and the installed measurement also includes wiring and instrument error.',
    related: ['Pt100 vs. Pt1000 RTD Sensors', '/guides/pt100-vs-pt1000/'],
  },
  {
    id: 'pt1000-sensor', name: 'Pt1000 Sensor',
    definition: 'A platinum resistance temperature detector with a nominal resistance of 1,000 ohms at 0 °C. It requires an input configured for the Pt1000 curve and the probe’s wiring.',
    related: ['Pt100 vs. Pt1000 RTD Sensors', '/guides/pt100-vs-pt1000/'],
  },
  {
    id: 'ptc-heating-element', name: 'PTC Heating Element',
    definition: 'A heating element designed around a positive temperature coefficient of resistance. Its resistance rises with temperature over the designed operating region, changing power at a fixed supply voltage.',
    related: ['PTC & Ceramic Heating Elements', '/heating-elements/ptc-ceramic-heaters/'],
  },
  {
    id: 'rtd', name: 'RTD',
    definition: 'A resistance temperature detector uses the change in electrical resistance of a sensing element to determine temperature. Pt100 is a common platinum RTD type.',
    related: ['Thermocouple vs. RTD', '/guides/thermocouple-vs-rtd/'],
  },
  {
    id: 'rtd-self-heating', name: 'RTD Self-Heating',
    definition: 'A rise in sensing-element temperature caused by the current used to measure RTD resistance. The resulting error depends on the measuring current, element resistance and the rate of heat exchange with the surroundings.',
    related: ['Pt100 vs. Pt1000 RTD Sensors', '/guides/pt100-vs-pt1000/'],
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
    related: ['Thermocouple Types and Selection', '/guides/thermocouple-types/'],
  },
  {
    id: 'thermocouple-extension-wire', name: 'Thermocouple Extension Wire',
    definition: 'A cable that extends a thermocouple circuit to an instrument or terminal block. Its extension-grade conductors match the nominal alloys of the thermocouple pair and are rated for a specified temperature interval.',
    related: ['Thermocouple Wire Color Codes and Polarity', '/guides/thermocouple-wire-color-code/'],
  },
  {
    id: 'thermocouple-polarity', name: 'Thermocouple Polarity',
    definition: 'The positive and negative designation of the two thermocouple conductors. Preserve the designated polarity through connectors, extension cable and instrument terminals to maintain the intended voltage sign.',
    related: ['Thermocouple Wire Color Codes and Polarity', '/guides/thermocouple-wire-color-code/'],
  },
  {
    id: 'thermocouple-response-time', name: 'Thermocouple Response Time',
    definition: 'The time a thermocouple assembly takes to indicate a specified fraction of a temperature step. The specified fraction, probe construction, medium, flow and mounting are needed to compare measurements.',
    related: ['Grounded vs. Ungrounded Thermocouples', '/guides/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'thermowell', name: 'Thermowell',
    definition: 'A closed-end protective fitting that separates a temperature sensor from a process fluid. Its material, mounting and bore must suit the vessel and the probe.',
    related: ['Thermowell Selection Guide', '/guides/thermowell-selection-guide/'],
  },
  {
    id: 'thermowell-insertion-length', name: 'Thermowell Insertion Length',
    definition: 'The length from the specified process connection reference to the thermowell tip. Check the drawing datum and the nozzle length to determine how far the tip extends into the process.',
    related: ['Thermowell Selection Guide', '/guides/thermowell-selection-guide/'],
  },
  {
    id: 'threaded-thermocouple-probe', name: 'Threaded Thermocouple Probe',
    definition: 'A thermocouple installed through a threaded body or fitting. Thread form, sealing interface and insertion length from the installed reference face determine its fit.',
    related: ['Threaded Thermocouple Probes', '/thermocouples/threaded-probes/'],
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
    related: ['Grounded vs. Ungrounded Thermocouples', '/guides/grounded-vs-ungrounded-thermocouples/'],
  },
  {
    id: 'watt-density', name: 'Watt Density',
    definition: 'Electrical power divided by active heating surface area, often expressed in W/cm² or W/in². For a cylindrical tubular sheath, surface area is π times sheath diameter times active heated length.',
    related: ['Heating Element Watt Density', '/guides/heating-element-watt-density/'],
  },
];
