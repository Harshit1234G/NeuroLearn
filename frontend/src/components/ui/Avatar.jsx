import React from 'react'

export default function Avatar({ name = 'Student', size = 40 }) {
  const initials = name.trim().split(' ').slice(0,2).map(n=>n[0]?.toUpperCase()).join('') || 'S'
  const colors = ['from-fuchsia-500 to-cyan-500','from-emerald-500 to-lime-500','from-blue-500 to-indigo-500','from-orange-500 to-pink-500']
  const pick = colors[(name.length + initials.length) % colors.length]
  return (
    <div className={`rounded-full bg-gradient-to-br ${pick} text-white grid place-items-center`} style={{ width: size, height: size }}>
      <span className="font-semibold" style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  )
}



