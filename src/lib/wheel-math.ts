interface Point {
  x: number;
  y: number;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): Point {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ');
}

export function calculateSegmentAngle(index: number, total: number): number {
  return (index / total) * 360;
}

export function calculateLabelPosition(
  index: number,
  total: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number; rotation: number } {
  const segmentAngle = 360 / total;
  const midAngle = (index + 0.5) * segmentAngle;
  const labelRadius = radius * 0.65;
  const position = polarToCartesian(cx, cy, labelRadius, midAngle);

  // Rotate text to be readable (pointing outward from center)
  let rotation = midAngle;
  // Flip text that would be upside down
  if (midAngle > 90 && midAngle < 270) {
    rotation += 180;
  }

  return {
    x: position.x,
    y: position.y,
    rotation,
  };
}

export function generateSpinRotation(
  currentRotation: number,
  targetIndex: number,
  totalItems: number
): number {
  const segmentAngle = 360 / totalItems;
  // To position segment center at top: rotation = 360 - segmentCenterAngle
  // Because clockwise rotation R shows what was at (360 - R) at the top
  const targetAngle = 360 - (targetIndex + 0.5) * segmentAngle;

  // Add 5-8 full rotations for drama (must be exact multiples of 360)
  const fullRotations = Math.floor(5 + Math.random() * 4) * 360;

  // Add small random offset within segment (for variation)
  const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.5;

  // Calculate final rotation
  const baseRotation = Math.floor(currentRotation / 360) * 360;
  return baseRotation + fullRotations + targetAngle + randomOffset;
}

export function getWinnerIndex(rotation: number, totalItems: number): number {
  const segmentAngle = 360 / totalItems;
  // Normalize rotation to 0-360
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  // The pointer is at the top (0 degrees), so we need to find which segment is there
  const adjustedRotation = (360 - normalizedRotation) % 360;
  return Math.floor(adjustedRotation / segmentAngle) % totalItems;
}

export function truncateLabel(label: string, maxLength: number = 15): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + '…';
}
