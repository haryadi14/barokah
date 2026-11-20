import React from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'ivory';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  to?: string;
  href?: string;
  external?: boolean;
  className?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-charcoal text-ivory border border-charcoal hover:bg-earth hover:border-earth',
  secondary:
    'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory',
  subtle:
    'bg-sand text-charcoal border border-border hover:border-charcoal',
  ivory:
    'bg-ivory text-charcoal border border-ivory hover:bg-sand',
};

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  external = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-sans font-medium tracking-editorial uppercase whitespace-nowrap shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-earth';
  const combined = `${baseClasses} ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combined}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combined}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={combined} {...props}>
      {children}
    </button>
  );
}
