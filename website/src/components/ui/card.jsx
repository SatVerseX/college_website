import React from "react";

// Card component
export const Card = ({ className, children }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className || ""}`}>
    {children}
  </div>
);

// CardContent component
export const CardContent = ({ children }) => <div>{children}</div>;

// New CardHeader component (if needed)
export const CardHeader = ({ children, className }) => (
  <div className={`text-2xl font-bold mb-4 ${className || ""}`}>
    {children}
  </div>
);
