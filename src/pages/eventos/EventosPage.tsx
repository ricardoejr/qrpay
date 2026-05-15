import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api'
import { AppLayout } from '../../components/layout/AppLayout'
import { Button, Badge, Spinner, EmptyState } from '../../components/ui'
import { formatDateTime, formatCurrency, EVENTO_STATUS_LABEL } from '../../lib/utils'
import type { Evento, EventoStatus } from '../../types'
import { Plus, Search, CalendarDays, MapPin, Zap } from 'lucide-react'

const STATUS_BADGE: Record<EventoStatus, 'green' | 'gray' | 'blue' | 'red'> = {
  rascunho: 'gray', ativo: 'green', encerrado: 'blue', cancelado: 'red',
}

export default function EventosPage() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['eventos'], queryFn: api.eventos.list })
  const eventos = data?.data || []

  const eventoAtivo = eventos.find(e => e.status === 'ativo')

  const filtered = eventos.filter(e => {
    const matchBusca = !busca || e.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = !status || e.status === status
    return matchBusca && matchStatus
  })

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Eventos</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{eventos.length} evento{eventos.length !== 1 ? 's' : ''} cadastrado{eventos.length !== 1 ? 's' : ''}</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/eventos/novo')}>
            <Plus size={16} /> Novo evento
          </Button>
        </div>

        {/* Banner evento ativo */}
        {eventoAtivo && (
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-4 mb-6 flex items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <span className="live-dot" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{eventoAtivo.nome} — em andamento agora</p>
              <p className="text-xs text-brand-100 mt-0.5">
                {eventoAtivo.local} · Encerra {formatDateTime(eventoAtivo.data_fim)}
              </p>
            </div>
            <Button size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate(`/eventos/${eventoAtivo.id}/dashboard`)}>
              <Zap size={14} /> Dashboard ao vivo
            </Button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="ativo">Ativo</option>
            <option value="encerrado">Encerrado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={48} />}
            title="Nenhum evento encontrado"
            description="Crie seu primeiro evento para começar a usar o Qrpag."
            action={<Button variant="primary" onClick={() => navigate('/eventos/novo')}><Plus size={16} /> Criar evento</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(evento => (
              <EventoCard key={evento.id} evento={evento} onClick={() => navigate(`/eventos/${evento.id}/visao-geral`)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function EventoCard({ evento, onClick }: { evento: Evento; onClick: () => void }) {
  const navigate = useNavigate()
  const isAtivo = evento.status === 'ativo'
  const isEncerrado = evento.status === 'encerrado'

  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-zinc-300 transition-all ${isAtivo ? 'border-brand-200 ring-1 ring-brand-200' : 'border-zinc-200'}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-900 truncate">{evento.nome}</h3>
          {evento.local && (
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <MapPin size={11} /> {evento.local}
            </p>
          )}
        </div>
        <Badge variant={STATUS_BADGE[evento.status]} className="ml-2 flex-shrink-0">
          {isAtivo && <span className="live-dot mr-1.5" style={{ width: 6, height: 6 }} />}
          {EVENTO_STATUS_LABEL[evento.status]}
        </Badge>
      </div>

      <div className="flex items-center gap-1 text-xs text-zinc-500 mb-4">
        <CalendarDays size={12} />
        <span>{formatDateTime(evento.data_inicio)} → {formatDateTime(evento.data_fim)}</span>
      </div>

      {(isAtivo || isEncerrado) && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-zinc-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900">R$ 45k</p>
            <p className="text-[10px] text-zinc-400">faturamento</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900">342</p>
            <p className="text-[10px] text-zinc-400">QRs ativos</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900">1.247</p>
            <p className="text-[10px] text-zinc-400">transações</p>
          </div>
        </div>
      )}

      {evento.status === 'rascunho' && (
        <div className="flex items-center gap-2 mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          Configure PDVs, cardápio e operadores antes de ativar
        </div>
      )}

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 justify-center" onClick={e => { e.stopPropagation(); onClick() }}>
          Ver detalhes
        </Button>
        {isAtivo && (
          <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); navigate(`/eventos/${evento.id}/dashboard`) }}>
            <Zap size={13} /> Live
          </Button>
        )}
        {evento.status === 'rascunho' && (
          <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); navigate(`/eventos/${evento.id}/visao-geral`) }}>
            Configurar
          </Button>
        )}
      </div>
    </div>
  )
}
