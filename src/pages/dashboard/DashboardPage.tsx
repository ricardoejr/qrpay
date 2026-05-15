import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, mockTransacoes, mockFaturamentoPDV } from '../../api'
import { EventoTabs } from '../../components/layout/AppLayout'
import { MetricCard, Badge, Spinner } from '../../components/ui'
import { formatCurrency, formatTime, TRANSACAO_TIPO_LABEL } from '../../lib/utils'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Zap, Users, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>()

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => api.dashboard.snapshot(id!),
    refetchInterval: 10000,
  })

  if (isLoading) return (
    <div>
      <EventoTabs eventoId={id!} activeTab="dashboard" eventoNome="Carregando..." eventoStatus="ativo" />
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </div>
  )

  const { metricas, faturamento_por_pdv } = dashData!
  const evento = dashData!.evento

  const tendenciaIcon = metricas.saldo_tendencia === 'subindo'
    ? <TrendingUp size={14} className="text-red-500" />
    : metricas.saldo_tendencia === 'caindo'
    ? <TrendingDown size={14} className="text-emerald-500" />
    : <Minus size={14} className="text-zinc-400" />

  const tendenciaLabel = metricas.saldo_tendencia === 'subindo' ? 'subindo' : metricas.saldo_tendencia === 'caindo' ? 'caindo (bom sinal)' : 'estável'
  const tendenciaTrend = metricas.saldo_tendencia === 'subindo' ? 'down' : metricas.saldo_tendencia === 'caindo' ? 'up' : 'neutral'

  const maxFat = Math.max(...faturamento_por_pdv.map(p => p.valor_centavos))

  const txColors: Record<string, string> = {
    recarga: 'bg-blue-500', venda: 'bg-emerald-500', reembolso: 'bg-amber-500',
    cortesia: 'bg-purple-500', estorno: 'bg-red-500',
  }

  return (
    <div>
      <EventoTabs eventoId={id!} activeTab="dashboard" eventoNome={evento?.nome || 'Evento'} eventoStatus="ativo" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Status bar */}
        <div className="flex items-center gap-4 mb-6 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="font-medium text-zinc-900">Ao vivo</span>
          </span>
          <span>·</span>
          <span>Iniciado há 4h 23min</span>
          <span>·</span>
          <span>Encerra em 7h 37min</span>
          <div className="ml-auto flex items-center gap-2">
            <Users size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">{metricas.operadores_online} operadores online</span>
            <span className="text-zinc-300">·</span>
            <Activity size={14} className="text-brand-500" />
            <span className="text-xs font-medium text-brand-600">{metricas.transacoes_por_minuto} tx/min</span>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Faturamento total"
            value={formatCurrency(metricas.faturamento_total_centavos)}
            sub={`▲ ${formatCurrency(metricas.faturamento_variacao_hora_centavos)} na última hora`}
            trend="up"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            label="Ticket médio"
            value={formatCurrency(metricas.ticket_medio_centavos)}
            sub="por transação de venda"
          />
          <MetricCard
            label="Saldo em circulação"
            value={formatCurrency(metricas.saldo_em_circulacao_centavos)}
            sub={`${tendenciaLabel}`}
            trend={tendenciaTrend as 'up' | 'down' | 'neutral'}
            icon={tendenciaIcon}
          />
          <MetricCard
            label="QRs ativados"
            value={`${metricas.qrs_ativos} / ${metricas.qrs_emitidos}`}
            sub={`${((metricas.qrs_ativos / metricas.qrs_emitidos) * 100).toFixed(1)}% do total emitido`}
          />
        </div>

        {/* Gráficos e feed */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Faturamento por PDV */}
          <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Faturamento por PDV</h3>
              <select className="text-xs px-2 py-1 border border-zinc-200 rounded-lg bg-white text-zinc-500">
                <option>Desde o início</option>
                <option>Última hora</option>
                <option>Últimas 3h</option>
              </select>
            </div>
            <div className="space-y-3">
              {faturamento_por_pdv.map(pdv => {
                const widthPct = (pdv.valor_centavos / maxFat) * 100
                const pdvColors: Record<string, string> = { caixa: 'bg-brand-500', venda: 'bg-blue-500', misto: 'bg-purple-500' }
                return (
                  <div key={pdv.pdv_id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-700">{pdv.nome}</span>
                        {pdv.inativo_minutos > 30 && (
                          <Badge variant="amber" className="text-[10px]">⚠ Inativo {pdv.inativo_minutos}min</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400">{pdv.qtd_transacoes} tx</span>
                        <span className="text-xs font-semibold text-zinc-900">{formatCurrency(pdv.valor_centavos)}</span>
                        <span className="text-xs text-zinc-400 w-10 text-right">{pdv.percentual.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pdvColors[pdv.tipo]}`} style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Feed de transações */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900">Últimas transações</h3>
              <div className="flex items-center gap-1.5">
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                <span className="text-xs text-brand-600 font-medium">ao vivo</span>
              </div>
            </div>
            <div className="divide-y divide-zinc-100 overflow-y-auto" style={{ maxHeight: 320 }}>
              {mockTransacoes.map(tx => {
                const isCredito = tx.valor_centavos > 0
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${txColors[tx.tipo] || 'bg-zinc-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-700">{TRANSACAO_TIPO_LABEL[tx.tipo]}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{tx.qr_codigo}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">{tx.pdv_nome}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-semibold ${isCredito ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isCredito ? '+' : ''}{formatCurrency(Math.abs(tx.valor_centavos))}
                      </p>
                      <p className="text-[10px] text-zinc-400">{formatTime(tx.criado_em)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
