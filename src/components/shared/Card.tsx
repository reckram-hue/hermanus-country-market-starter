import React from "react";

type CardProps = {
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, className = "", children, footer }) => {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {title !== undefined && (
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t border-slate-200 px-4 py-3">{footer}</div>}
    </div>
  );
};

export default Card;