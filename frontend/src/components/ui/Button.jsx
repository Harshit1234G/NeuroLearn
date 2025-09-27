import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-gray-900 text-white hover:brightness-110 focus:ring-gray-300',
    outline: 'border bg-white hover:bg-gray-50 focus:ring-gray-200',
    fun: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-soft hover:brightness-110 focus:ring-fuchsia-200',
    success: 'bg-green-600 text-white hover:brightness-110 focus:ring-green-200',
    danger: 'bg-rose-600 text-white hover:brightness-110 focus:ring-rose-200',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}



