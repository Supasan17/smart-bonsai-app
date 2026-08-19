export type TempUnit = 'C' | 'F';

export const toDisplayTemp = (celsius: number, unit: TempUnit): number =>
  unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;

export const formatTemp = (celsius: number, unit: TempUnit, decimals = 1): string =>
  `${toDisplayTemp(celsius, unit).toFixed(decimals)}°${unit}`;

export const convertRange = (range: [number, number], unit: TempUnit): [number, number] =>
  unit === 'F'
    ? [(range[0] * 9) / 5 + 32, (range[1] * 9) / 5 + 32]
    : range;
