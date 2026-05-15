import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { Avatar } from '../ui'
import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'
import {
  LayoutDashboard, CalendarDays, Tag, Users, Settings,
  LogOut, QrCode, BarChart2, Shield, Building2, ChevronDown
} from 'lucide-react'

interface NavItem { label: string; path: string; icon: ReactNode; roles?: string[] }

const NAV_ITEMS: NavItem[] = [
  { label: 'Eventos', path: '/eventos', icon: <CalendarDays size={17} /> },
  { label: 'Catálogo', path: '/catalogo', icon: <Tag size={17} /> },
  { label: 'Operadores', path: '/operadores', icon: <Users size={17} /> },
  { label: 'Usuários', path: '/usuarios', icon: <Shield size={17} /> },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Organizadores', path: '/admin/organizadores', icon: <Building2 size={17} /> },
]

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-zinc-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-zinc-100">
          <Link to="/eventos" className="text-xl font-semibold tracking-tight">
            qr<span className="text-brand-500">pag</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {user?.perfil === 'super_admin' && (
            <>
              <p className="px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Plataforma</p>
              {ADMIN_NAV.map(item => (
                <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors', isActive(item.path) ? 'bg-brand-50 text-brand-700 font-medium' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')}>
                  {item.icon} {item.label}
                </Link>
              ))}
              <div className="border-t border-zinc-100 my-2" />
            </>
          )}

          <p className="px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Menu</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors', isActive(item.path) ? 'bg-brand-50 text-brand-700 font-medium' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-zinc-100">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer group">
            <Avatar nome={user?.nome || 'U'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-900 truncate">{user?.nome}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user?.organizador_nome || 'Super Admin'}</p>
            </div>
            <button onClick={handleLogout} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

// ============================================================
// TOPBAR para sub-páginas de evento
// ============================================================
interface EventoTabsProps {
  eventoId: string
  activeTab: string
  eventoNome: string
  eventoStatus: string
}

export function EventoTabs({ eventoId, activeTab, eventoNome, eventoStatus }: EventoTabsProps) {
  const navigate = useNavigate()
  const tabs = [
    { id: 'visao-geral', label: 'Visão geral', icon: <LayoutDashboard size={14} /> },
    { id: 'pdvs', label: 'PDVs', icon: <Building2 size={14} /> },
    { id: 'cardapio', label: 'Cardápio', icon: <Tag size={14} /> },
    { id: 'operadores', label: 'Operadores', icon: <Users size={14} /> },
    { id: 'qr-codes', label: 'QR Codes', icon: <QrCode size={14} /> },
    { id: 'dashboard', label: 'Dashboard ao vivo', icon: <BarChart2 size={14} />, onlyActive: true },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart2 size={14} />, onlyEncerrado: false },
  ]

  const statusColor: Record<string, string> = {
    rascunho: 'bg-zinc-100 text-zinc-600',
    ativo: 'bg-emerald-100 text-emerald-700',
    encerrado: 'bg-blue-100 text-blue-700',
    cancelado: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
      <div className="px-6 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/eventos')} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-base font-semibold text-zinc-900">{eventoNome}</h1>
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusColor[eventoStatus] || 'bg-zinc-100 text-zinc-600')}>
            {eventoStatus === 'ativo' && <span className="live-dot mr-1.5" style={{ width: 6, height: 6 }} />}
            {eventoStatus.charAt(0).toUpperCase() + eventoStatus.slice(1)}
          </span>
        </div>
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.filter(t => !t.onlyActive || eventoStatus === 'ativo').map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(`/eventos/${eventoId}/${tab.id}`)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-700 font-medium'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
