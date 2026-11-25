const form = document.querySelector('[data-calculator]');
const output = form.querySelector('output');
const inputs = form.elements;
const number = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 });

function wattDensity() {
  const power = inputs.namedItem('power').valueAsNumber;
  const diameter = inputs.namedItem('diameter').valueAsNumber;
  const length = inputs.namedItem('length').valueAsNumber;
  if ([power, diameter, length].some(value => !Number.isFinite(value) || value <= 0)) {
    return 'Enter positive values for power, diameter and active heated length.';
  }
  const mmPerUnit = inputs.namedItem('lengthUnit').value === 'in' ? 25.4 : 1;
  const areaCm2 = Math.PI * diameter * length * (mmPerUnit / 10) ** 2;
  const wattsPerCm2 = power / areaCm2;
  const wattsPerIn2 = wattsPerCm2 * 2.54 ** 2;
  if (![areaCm2, wattsPerCm2, wattsPerIn2].every(value => Number.isFinite(value) && value > 0)) {
    return 'Check the scale and units of the entered values.';
  }
  return `Surface watt density: ${number.format(wattsPerCm2)} W/cm² or ${number.format(wattsPerIn2)} W/in². Active sheath area: ${number.format(areaCm2)} cm².`;
}

const waterSpecificHeat = 4.186;
const litersPerUsGallon = 3.785411784;

function waterHeating() {
  const volume = inputs.namedItem('volume').valueAsNumber;
  const amount = inputs.namedItem('amount').valueAsNumber;
  if (![volume, amount].every(value => Number.isFinite(value) && value > 0)) {
    return 'Enter a positive water volume and heat-up time or power.';
  }
  const start = inputs.namedItem('start').valueAsNumber;
  const target = inputs.namedItem('target').valueAsNumber;
  const fahrenheit = inputs.namedItem('temperatureUnit').value === 'f';
  const [freezing, boiling] = fahrenheit ? [32, 212] : [0, 100];
  if (!Number.isFinite(start) || !Number.isFinite(target) || start < freezing || target >= boiling || target <= start) {
    return fahrenheit
      ? 'Use a starting temperature of at least 32 °F and a higher target below 212 °F.'
      : 'Use a starting temperature of at least 0 °C and a higher target below 100 °C.';
  }
  const liters = volume * (inputs.namedItem('volumeUnit').value === 'gal' ? litersPerUsGallon : 1);
  const riseC = (target - start) * (fahrenheit ? 5 / 9 : 1);
  const energyKj = liters * waterSpecificHeat * riseC; // Approximate liquid water mass as 1 kg per liter.
  const powerMode = inputs.namedItem('mode').value === 'power';
  const result = energyKj / amount / 60;
  if (!Number.isFinite(result) || result <= 0 || (powerMode && !Number.isFinite(result * 1000))) {
    return 'Check the scale and units of the entered values.';
  }
  return powerMode
    ? `Ideal heat-up power: ${number.format(result)} kW (${number.format(result * 1000)} W).`
    : `Ideal heat-up time: ${number.format(result)} minutes.`;
}

const isWater = form.dataset.calculator === 'water-heating';
if (isWater) {
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

form.addEventListener('input', () => { output.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  output.textContent = isWater ? waterHeating() : wattDensity();
});
form.querySelector('fieldset').disabled = false;
