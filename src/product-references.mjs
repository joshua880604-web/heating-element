const nistReference = 'https://doi.org/10.6028/NIST.MONO.175';
const thermocoupleCurves = {
  K: ['−270 to 1,372 °C', [[-40, '−1.527'], [0, '0.000'], [100, '+4.096'], [600, '+24.905']]],
  J: ['−210 to 1,200 °C', [[-40, '−1.961'], [0, '0.000'], [100, '+5.269'], [400, '+21.848']]],
  T: ['−270 to 400 °C', [[-50, '−1.819'], [0, '0.000'], [100, '+4.279'], [300, '+14.862']]],
  E: ['−270 to 1,000 °C', [[-40, '−2.255'], [0, '0.000'], [100, '+6.319'], [400, '+28.946']]],
  N: ['−270 to 1,300 °C', [[0, '0.000'], [100, '+2.774'], [500, '+16.748'], [1000, '+36.256']]],
  R: ['−50 to 1,768.1 °C', [[0, '0.000'], [500, '+4.471'], [1000, '+10.506'], [1500, '+17.451']]],
  S: ['−50 to 1,768.1 °C', [[0, '0.000'], [500, '+4.233'], [1000, '+9.587'], [1500, '+15.582']]],
  B: ['0 to 1,820 °C', [[500, '+1.242'], [1000, '+4.834'], [1500, '+10.099'], [1700, '+12.433']]],
};

const thermocoupleReferences = Object.entries(thermocoupleCurves).map(([type, [interval, readings]]) => [
  `type-${type.toLowerCase()}`,
  [`Type ${type} Nominal Output at a 0 °C Reference Junction`, [
    `Use these values to check the Type ${type} instrument input or compare a measured signal at a known reference temperature. The `,
    ['NIST ITS-90 reference function', nistReference],
    ` spans ${interval}. Confirm the assembled probe’s working range and tolerance from its specification.`,
  ], {
    anchor: 'reference-output',
    table: [['Measuring junction temperature', 'Nominal output (mV)'],
      ...readings.map(([temperature, voltage]) => [`${String(temperature).replace('-', '−')} °C`, voltage]),
    ],
    links: [['Compare thermocouple types and instrument inputs', '/guides/thermocouple-types/#thermocouple-reference-intervals']],
  }],
]);

const thermocoupleFamilyReference = [
  'Compare Thermocouple Designations and Reference Signals',
  [
    'Choose the letter designation supported by the instrument. These nominal signals use a 0 °C reference junction and come from the ',
    ['NIST ITS-90 reference functions', nistReference],
    '. Verify the working range, materials and tolerance of the installed assembly for your process.',
  ],
  {
    anchor: 'reference-output',
    table: [
      ['Thermocouple designation', 'Measuring junction', 'Nominal output (mV)', 'Reference function interval'],
      ...Object.entries(thermocoupleCurves).map(([type, [interval, readings]]) => {
        const comparisonTemperature = ['R', 'S', 'B'].includes(type) ? 1000 : 100;
        const voltage = readings.find(([temperature]) => temperature === comparisonTemperature)[1];
        return [[`Type ${type}`, `/thermocouples/type-${type.toLowerCase()}/#reference-output`], `${comparisonTemperature} °C`, voltage, interval];
      }),
    ],
  },
];

const platinumRtdReference = [
  'IEC 60751 Nominal Resistance for Pt100 and Pt1000',
  [
    'Use the nominal resistance for a known element temperature to check the instrument curve and wiring. The values follow the ',
    ['IEC 60751 platinum curve', '/glossary/#iec-60751'],
    '. Confirm the probe’s tolerance class and working range with its specification and include lead resistance when evaluating measurements.',
  ],
  {
    anchor: 'reference-resistance',
    table: [
      ['Element temperature', 'Pt100 (Ω)', 'Pt1000 (Ω)'],
      ['−50 °C', '80.31', '803.1'],
      ['0 °C', '100.00', '1,000.0'],
      ['25 °C', '109.73', '1,097.3'],
      ['100 °C', '138.51', '1,385.1'],
      ['200 °C', '175.86', '1,758.6'],
    ],
    links: [
      ['Compare Pt100 and Pt1000 input curves', '/guides/pt100-vs-pt1000/'],
      ['Check 2-, 3- and 4-wire RTD connections', '/guides/pt100-wiring-diagram/'],
    ],
  },
];

const ds18b20Reference = [
  'DS18B20 IC Specifications',
  'These values apply to the DS18B20 sensing IC under the conditions in its Rev. 4 datasheet. Confirm the assembled probe’s temperature and immersion limits, cable rating and response time for the installation.',
  {
    anchor: 'ds18b20-ic-specifications',
    table: [
      ['IC parameter', 'Value and condition'],
      ['Measurement range', '−55 to +125 °C'],
      ['Temperature error', '±0.5 °C from −10 to +85 °C'],
      ['Local supply (VDD)', '3.0 to 5.5 V DC'],
      ['Resolution and maximum conversion time', '93.75 ms at 9 bits, 187.5 ms at 10 bits, 375 ms at 11 bits and 750 ms at 12 bits.'],
    ],
    links: [['Check the digital input and wiring', '/guides/thermocouple-vs-rtd/#identify-a-digital-probe-input']],
  },
];

const pipeThreadPitchReference = [
  'NPT and BSPP Thread Pitch Reference',
  'Use a pitch gauge to check the number of threads per inch and confirm the callout with the port drawing. ASME B1.20.1 NPT uses a tapered thread with a 60° form. ISO 228-1 BSPP (G) uses a parallel thread with a 55° form. For example, 1/2 NPT and G 1/2 both have 14 threads per inch. Confirm the full thread designation, engagement and sealing method before ordering.',
  {
    anchor: 'pipe-thread-pitch',
    table: [
      ['Nominal size', 'NPT (threads/in)', 'BSPP (threads/in)'],
      ['1/8', '27', '28'],
      ['1/4', '18', '19'],
      ['3/8', '18', '19'],
      ['1/2', '14', '14'],
      ['3/4', '14', '14'],
      ['1', '11.5', '11'],
      ['1 1/4, 1 1/2 and 2', '11.5', '11'],
    ],
  },
];

const rtdLoopTestReference = [
  'Five-Point Check for a 0–200 °C RTD Transmitter Span',
  'This commissioning example uses nominal IEC platinum RTD resistance and a transmitter configured for linear 4–20 mA output over 0–200 °C. Select the configured sensor curve and wire mode before simulating the input. Use the instrument specification to set acceptable deviations at each point.',
  {
    anchor: 'rtd-loop-test-points',
    table: [
      ['Simulated temperature', 'Pt100 (Ω)', 'Pt1000 (Ω)', 'Expected output (mA)'],
      ['0 °C', '100.00', '1,000.0', '4.00'],
      ['50 °C', '119.40', '1,194.0', '8.00'],
      ['100 °C', '138.51', '1,385.1', '12.00'],
      ['150 °C', '157.33', '1,573.3', '16.00'],
      ['200 °C', '175.86', '1,758.6', '20.00'],
    ],
    links: [['Verify a transmitter or controller input', '/guides/temperature-sensor-calibration/#verify-a-transmitter-or-controller-input']],
  },
];

export const productReferences = new Map([
  ...thermocoupleReferences,
  ['thermocouples', thermocoupleFamilyReference],
  ['rtd', platinumRtdReference],
  ['pt1000-sensors', platinumRtdReference],
  ['ds18b20-sensors', ds18b20Reference],
  ['threaded-thermocouple', pipeThreadPitchReference],
  ['threaded-rtd-probes', pipeThreadPitchReference],
  ['threaded-thermowells', pipeThreadPitchReference],
  ['screw-plug-immersion', pipeThreadPitchReference],
  ['rtd-temperature-transmitters', rtdLoopTestReference],
  ['rtd-calibrators', rtdLoopTestReference],
]);
