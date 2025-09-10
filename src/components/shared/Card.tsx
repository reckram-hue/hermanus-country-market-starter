import React from "react";

type CardProps = {
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, className = "", children }) => (
  <div className={`bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden ${className}`}>
    {title !== undefined && title !== null && (
      <div className="px-6 py-4 border-b border-slate-200/80">
        {typeof title === "string" ? (
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        ) : (
          title
        )}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;