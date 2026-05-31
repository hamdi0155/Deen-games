interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  color?: string;
}

export default function Slider({
  label, value, min = 0, max = 100, step = 1, onChange, leftLabel, rightLabel, color = '#5b6ef5',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">{label}</span>
        <span className="text-xs font-mono text-white/50">{value}</span>
      </div>
      {leftLabel && rightLabel && (
        <div className="flex justify-between text-[10px] text-white/40">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        {/* Thumb visual */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all duration-100"
          style={{ left: `calc(${pct}% - 8px)`, background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
    </div>
  );
}
