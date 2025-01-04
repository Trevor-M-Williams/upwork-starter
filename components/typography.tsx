import React from "react";
interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: HeadingProps) {
  return (
    <h1
      className={`font-heading text-4xl capitalize leading-[1.5] tracking-tight text-brand-heading ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: HeadingProps) {
  return (
    <h2
      className={`font-heading text-2xl tracking-tight text-brand-heading ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: HeadingProps) {
  return (
    <h3
      className={`text-base font-medium text-black text-brand-black ${className}`}
    >
      {children}
    </h3>
  );
}

export function P({ children, className = "" }: HeadingProps) {
  return <p className={`text-sm text-brand-text ${className}`}>{children}</p>;
}

export function Detail({ children, className = "" }: HeadingProps) {
  return <p className={`text-xs ${className}`}>{children}</p>;
}
