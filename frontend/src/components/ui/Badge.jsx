import React from 'react'

export default function Badge({ children, color = 'blue', className = '' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
  }
  return <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colors[color]} ${className}`}>{children}</span>
}


