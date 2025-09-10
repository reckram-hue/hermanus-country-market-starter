import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition inline-flex items-center justify-center'
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-sky-700 focus:ring-sky-500',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-sky-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-sky-500'
  } as const
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

export default Button
