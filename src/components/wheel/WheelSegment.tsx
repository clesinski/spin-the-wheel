'use client';

import { describeArc, calculateLabelPosition, truncateLabel } from '@/lib/wheel-math';

interface WheelSegmentProps {
  label: string;
  index: number;
  total: number;
  color: string;
  textColor: string;
  cx: number;
  cy: number;
  radius: number;
}

export function WheelSegment({
  label,
  index,
  total,
  color,
  textColor,
  cx,
  cy,
  radius,
}: WheelSegmentProps) {
  const segmentAngle = 360 / total;
  const startAngle = index * segmentAngle;
  const endAngle = startAngle + segmentAngle;
  const path = describeArc(cx, cy, radius, startAngle, endAngle);
  const labelPos = calculateLabelPosition(index, total, cx, cy, radius);

  // Adjust font size based on number of segments
  const fontSize = total <= 6 ? 14 : total <= 10 ? 12 : 10;
  const maxLabelLength = total <= 6 ? 15 : total <= 10 ? 12 : 8;

  return (
    <g>
      <path
        d={path}
        fill={color}
        stroke="#fff"
        strokeWidth="2"
      />
      <text
        x={labelPos.x}
        y={labelPos.y}
        fill={textColor}
        fontSize={fontSize}
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${labelPos.rotation}, ${labelPos.x}, ${labelPos.y})`}
        style={{ pointerEvents: 'none' }}
      >
        {truncateLabel(label, maxLabelLength)}
      </text>
    </g>
  );
}
