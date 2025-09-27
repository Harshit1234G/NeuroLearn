import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const itemsByRole = {
  student: [
    { to: '/student', label: 'Dashboard', icon: '🏠' },
    { to: '/student/assessment', label: 'Assessment', icon: '🧠' },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard', icon: '📊' },
  ],
  parent: [
    { to: '/parent', label: 'Dashboard', icon: '👨‍👩‍👧' },
  ],
}

export default function Sidebar({ role = 'student' }) {
  const location = useLocation()
  const items = itemsByRole[role] || []
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div className="sticky top-4 space-y-2">
        {items.map(item => {
          const active = location.pathname.startsWith(item.to)
          return (
            <Link key={item.to} to={item.to} className={`group flex items-center gap-3 px-3 py-2 rounded-xl border backdrop-blur ${active ? 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border-fuchsia-300/50' : 'hover:bg-gray-50'}`} title={item.label}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}



