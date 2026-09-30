/**
 * These are not actually radians, they are radians over pi
 */
export const initRandomRotation = (
  minRadians: number,
  maxRadians: number
): (() => [number, number, number, number]) => {
  const rangeRadians = maxRadians - minRadians;

  return () => {
    // https://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    const axisX = Math.random() * 2 - 1;
    const axisY = Math.random() * 2 - 1;
    const axisZ = Math.random() * 2 - 1;
    const axisLength = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);

    const normalizedAxisX = axisX / axisLength;
    const normalizedAxisY = axisY / axisLength;
    const normalizedAxisZ = axisZ / axisLength;

    const rotation =
      Math.PI * minRadians + Math.random() * rangeRadians * Math.PI;

    const sineOfAngle = Math.sin(rotation / 2);

    const w = Math.cos(rotation / 2);
    const x = normalizedAxisX * sineOfAngle;
    const y = normalizedAxisY * sineOfAngle;
    const z = normalizedAxisZ * sineOfAngle;

    return [x, y, z, w];
  };
};
