const form = document.querySelector('[data-calculator]');
const output = form.querySelector('output');
const quoteLink = form.querySelector('[data-calculator-quote]');
const quoteHint = form.querySelector('[data-calculator-quote-hint]');
const quoteUrl = new URL(quoteLink.href);
const inputs = form.elements;
const number = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 });

function heaterResistance() {
  const voltage = inputs.namedItem('voltage').valueAsNumber;
  const power = inputs.namedItem('power').valueAsNumber;
  if (![voltage, power].every(value => Number.isFinite(value) && value > 0)) {
    return { message: 'Enter positive values for rated circuit voltage and power.' };
  }
  const resistance = voltage ** 2 / power;
  if (!Number.isFinite(resistance) || resistance <= 0) {
    return { message: 'Check the scale and units of the entered values.' };
  }
  return {
    message: `Nominal resistance at the rated conditions: ${number.format(resistance)} Ω.`,
    details: [
      'Preliminary resistance calculation for one heater circuit',
      `Rated circuit voltage: ${voltage} V`,
      `Rated circuit power: ${power} W`,
    ],
  };
}

function wattDensity() {
  const power = inputs.namedItem('power').valueAsNumber;
  const diameter = inputs.namedItem('diameter').valueAsNumber;
  const length = inputs.namedItem('length').valueAsNumber;
  if ([power, diameter, length].some(value => !Number.isFinite(value) || value <= 0)) {
    return { message: 'Enter positive values for power, diameter and active heated length.' };
  }
  const lengthUnit = inputs.namedItem('lengthUnit').value;
  const mmPerUnit = lengthUnit === 'in' ? 25.4 : 1;
  const areaCm2 = Math.PI * diameter * length * (mmPerUnit / 10) ** 2;
  const wattsPerCm2 = power / areaCm2;
  const wattsPerIn2 = wattsPerCm2 * 2.54 ** 2;
  if (![areaCm2, wattsPerCm2, wattsPerIn2].every(value => Number.isFinite(value) && value > 0)) {
    return { message: 'Check the scale and units of the entered values.' };
  }
  return {
    message: `Surface watt density: ${number.format(wattsPerCm2)} W/cm² or ${number.format(wattsPerIn2)} W/in². Active sheath area: ${number.format(areaCm2)} cm².`,
    details: [
      'Preliminary tubular heater calculation',
      `Element power: ${power} W`,
      `Sheath outside diameter: ${diameter} ${lengthUnit}`,
      `Active heated length: ${length} ${lengthUnit}`,
    ],
  };
}

const waterSpecificHeat = 4.186;
const litersPerUsGallon = 3.785411784;

function waterHeating() {
  const volume = inputs.namedItem('volume').valueAsNumber;
  const amount = inputs.namedItem('amount').valueAsNumber;
  if (![volume, amount].every(value => Number.isFinite(value) && value > 0)) {
    return { message: 'Enter a positive water volume and heat-up time or power.' };
  }
  const start = inputs.namedItem('start').valueAsNumber;
  const target = inputs.namedItem('target').valueAsNumber;
  const fahrenheit = inputs.namedItem('temperatureUnit').value === 'f';
  const [freezing, boiling] = fahrenheit ? [32, 212] : [0, 100];
  if (!Number.isFinite(start) || !Number.isFinite(target) || start < freezing || target >= boiling || target <= start) {
    const units = fahrenheit ? '°F' : '°C';
    return { message: `Use a starting temperature of at least ${freezing} ${units} and a higher target below ${boiling} ${units}.` };
  }
  const gallons = inputs.namedItem('volumeUnit').value === 'gal';
  const liters = volume * (gallons ? litersPerUsGallon : 1);
  const riseC = (target - start) * (fahrenheit ? 5 / 9 : 1);
  const energyKj = liters * waterSpecificHeat * riseC; // Approximate liquid water mass as 1 kg per liter.
  const powerMode = inputs.namedItem('mode').value === 'power';
  const result = energyKj / amount / 60;
  if (!Number.isFinite(result) || result <= 0 || (powerMode && !Number.isFinite(result * 1000))) {
    return { message: 'Check the scale and units of the entered values.' };
  }
  return {
    message: powerMode
      ? `Ideal heat-up power: ${number.format(result)} kW (${number.format(result * 1000)} W).`
      : `Ideal heat-up time: ${number.format(result)} minutes.`,
    details: [
      'Preliminary water heat-up calculation (liquid only)',
      `Water volume: ${volume} ${gallons ? 'US gal' : 'L'}`,
      `Water temperatures: ${start} to ${target} ${fahrenheit ? '°F' : '°C'}`,
      powerMode ? `Allowed heat-up time: ${amount} minutes` : `Available heater power: ${amount} kW`,
    ],
  };
}

const calculate = {
  'heater-resistance': heaterResistance,
  'watt-density': wattDensity,
  'water-heating': waterHeating,
}[form.dataset.calculator];
if (calculate === waterHeating) {
  const mode = inputs.namedItem('mode');
  const label = form.querySelector('[data-amount-label]');
  function setAmountLabel() {
    label.textContent = mode.value === 'power' ? 'Allowed heat-up time (minutes)' : 'Available heater power (kW)';
  }
  setAmountLabel();
  mode.addEventListener('change', () => {
    setAmountLabel();
    inputs.namedItem('amount').value = '';
  });
}

function showQuoteAction(visible) {
  quoteLink.hidden = !visible;
  if (quoteHint) quoteHint.hidden = !visible;
}

form.addEventListener('input', () => {
  output.textContent = '';
  showQuoteAction(false);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const { message, details } = calculate();
  output.textContent = message;
  showQuoteAction(Boolean(details));
  if (details) {
    // Transport the calculation in the fragment, which stays out of the HTTP request.
    quoteUrl.hash = new URLSearchParams({ estimate: [...details, message].join('\n') }).toString();
    quoteLink.href = quoteUrl.href;
  }
});
form.querySelector('fieldset').disabled = false;
