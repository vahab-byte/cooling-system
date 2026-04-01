import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'standard',
  variant = 'default'
}) => {
  const paddings = {
    standard: "p-8 lg:p-12",
    small: "p-6",
    none: ""
  };

  const variants = {
    default: "bg-white border border-neutral-200 shadow-sm",
    flat: "bg-neutral-50 border-none",
    outline: "bg-transparent border border-black",
    black: "bg-black text-white border-none"
  };

  return (
    <div className={`relative transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
