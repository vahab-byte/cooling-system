import React from 'react';

const Section = ({ 
  children, 
  className = '', 
  id = '', 
  padding = 'standard' 
}) => {
  const paddings = {
    standard: "py-24 lg:py-32",
    small: "py-16 lg:py-20",
    large: "py-32 lg:py-48",
    none: ""
  };

  return (
    <section id={id} className={`${paddings[padding]} ${className}`}>
      {children}
    </section>
  );
};

export default Section;
