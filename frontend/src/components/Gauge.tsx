interface GaugeProps {
    value: number;
    min: number;
    max: number;
    label?: string;
  }
  
  const Gauge: React.FC<GaugeProps> = ({ value, min, max, label }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const angle = (percentage / 100) * 180 - 90; // Map percentage to 180-degree arc (-90 to 90)
  
    return (
      <div className="relative w-40 h-20">
        {/* Background Arc */}
        <svg className="absolute w-full h-full" viewBox="0 0 100 50">
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Filled Arc */}
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="8"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 * (1 - percentage / 100)}
          />
        </svg>
        {/* Needle */}
        <div
          className="absolute w-1 h-16 bg-purple-600 origin-bottom"
          style={{
            left: "50%",
            bottom: "10%",
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
        {/* Labels */}
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-purple-700">
          <span>{min}</span>
          <span>{max}</span>
        </div>
        {/* Value */}
        <div className="absolute inset-x-0 top-8 text-center text-lg font-bold text-purple-800">
          {value}
        </div>
        {label && (
          <div className="absolute inset-x-0 top-14 text-center text-sm text-purple-700">
            {label}
          </div>
        )}
      </div>
    );
  };

  export default Gauge;