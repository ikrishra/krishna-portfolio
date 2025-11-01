import React from 'react';

type CardType = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  color?: "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan" | "white";
};

const Card = ({
  title,
  description,
  children,
  className = "",
  color = "white",
}: CardType) => {
  const colorClasses = {
    violet: "bg-violet-200",
    pink: "bg-pink-200",
    red: "bg-red-200",
    orange: "bg-orange-200",
    yellow: "bg-yellow-200",
    lime: "bg-lime-200",
    cyan: "bg-cyan-200",
    white: "bg-white",
  };

  return (
    <div className={`w-full border-black border-2 rounded-md hover:shadow-brutal ${colorClasses[color]} ${className}`}>
      <div className="p-6">
        {title && (
          <h2 className="text-2xl font-bold mb-4 hero-font">{title}</h2>
        )}
        {description && (
          <p className="text-base mb-4">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;