import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  subtitle?: string;
}

const SummaryCard = ({
  title,
  value,
  icon,
  subtitle,
}: SummaryCardProps) => {
  return (
    <div className="summary-card">
      <div className="summary-card-icon">
        {icon}
      </div>

      <div className="summary-card-content">
        <p className="summary-card-title">
          {title}
        </p>

        <h2 className="summary-card-value">
          {value}
        </h2>

        {subtitle && (
          <span className="summary-card-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
