type ChipProps = {
  label: string;
  color: string;
  className?: string;
};

export function Chip({ label, color, className = '' }: ChipProps) {
  return (
    <span
      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
