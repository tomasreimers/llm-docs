export const initRandom = (
  min: number,
  max: number
): (() => [number, number, number, number]) => {
  const range = max - min;
  return () => [
    min + Math.random() * range,
    min + Math.random() * range,
    min + Math.random() * range,
    min + Math.random() * range,
  ];
};
