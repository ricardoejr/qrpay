import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'
import { EventoTabs } from '../../components/layout/AppLayout'
import { Button, Badge, Spinner, Card } from '../../components/ui'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { CheckCircle, Download, AlertTriangle, TrendingUp, Users, QrCode, BarChart3 } from 'lucide-react'

type ReportTab = 'consolidado' | 'saldo-residual' | 'reconciliacao'

export default function RelatoriosPage() {
  const { id: eventoId } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<ReportTab>('consolidado')

  const tabs: { id: ReportTab; label: string }[] = [
    { id: 'consolidado', label: 'Consolidado' },
    { id: 'saldo-residual', label: 'Saldo residual' },
    { id: 'reconciliacao', label: 'Reconciliação' },
  ]

  return (
    <div>
      <EventoTabs eventoId={eventoId!} activeTab="relatorios" eventoNome="Festival de Verão 2026" eventoStatus="encerrado" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Relatórios</h1>
            <p className="text-sm text-zinc-500">Festival de Verão 2026 · 15 a 16 de Dez 2026</p>
          </div>
          <Button size="sm">
            <Download size={14} /> Exportar CSV
          </Button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'consolidado' && <RelatorioConsolidado eventoId={eventoId!} />}
        {activeTab === 'saldo-residual' && <SaldoResidual eventoId={eventoId!} />}
        {activeTab === 'reconciliacao' && <Reconciliacao eventoId={eventoId!} />}
      </div>
    </div>
  )
}

function RelatorioConsolidado({ eventoId }: { eventoId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['relatorio-consolidado', eventoId],
    queryFn: () => api.relatorios.consolidado(eventoId),
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (!data) return null

  const { financeiro, recargas, vendas, qr_codes, operacional } = data

  return (
    <div className="space-y-6">
      {/* Financeiro */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Resumo financeiro</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
            <p className="text-xs text-brand-600 font-medium mb-1">Faturamento líquido</p>
            <p className="text-2xl font-semibold text-brand-700">{formatCurrency(financeiro.faturamento_liquido_centavos)}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 mb-1">Total recargas</p>
            <p className="text-xl font-semibold text-zinc-900">{formatCurrency(financeiro.total_recargas_reais_centavos)}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 mb-1">Reembolsos</p>
            <p className="text-xl font-semibold text-red-600">{formatCurrency(financeiro.total_reembolsos_centavos)}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 mb-1">Saldo residual</p>
            <p className="text-xl font-semibold text-amber-600">{formatCurrency(financeiro.saldo_residual_centavos)}</p>
          </div>
        </div>
        <div className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-500">
          Cortesias concedidas: <strong className="text-zinc-700">{formatCurrency(financeiro.total_cortesias_centavos)}</strong> (não impactam o faturamento)
        </div>
      </div>

      {/* Recargas por forma de pagamento */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recargas — {recargas.qtd_total} operações</h2>
        <Card>
          <div className="space-y-3">
            {recargas.por_forma_pagamento.map(fp => (
              <div key={fp.forma}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-700 capitalize">{fp.forma.replace('_', ' ')}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-400">{fp.percentual.toFixed(1)}%</span>
                    <span className="text-sm font-semibold text-zinc-900">{formatCurrency(fp.valor_centavos)}</span>
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${fp.percentual}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 mt-4 pt-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Ticket médio por recarga</span>
            <span className="text-sm font-semibold">{formatCurrency(recargas.ticket_medio_centavos)}</span>
          </div>
        </Card>
      </div>

      {/* Vendas e Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Vendas</h2>
          <Card className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Total vendido</span><span className="font-semibold">{formatCurrency(vendas.valor_total_centavos)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Nº de transações</span><span className="font-semibold">{vendas.qtd_total.toLocaleString('pt-BR')}</span></div>
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Ticket médio</span><span className="font-semibold">{formatCurrency(vendas.ticket_medio_centavos)}</span></div>
          </Card>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">QR Codes</h2>
          <Card className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Emitidos</span><span className="font-semibold">{qr_codes.emitidos}</span></div>
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Ativados</span><span className="font-semibold">{qr_codes.ativados}</span></div>
            <div className="flex justify-between"><span className="text-sm text-zinc-600">Com saldo residual</span><span className="font-semibold text-amber-600">{qr_codes.com_saldo_residual}</span></div>
          </Card>
        </div>
      </div>

      {/* Estimativa de repasse */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-brand-800 mb-3">Estimativa de repasse</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-brand-700">Faturamento líquido</span><span className="font-medium text-brand-900">{formatCurrency(financeiro.faturamento_liquido_centavos)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-brand-700">Taxa Qrpag (2,5%)</span><span className="font-medium text-red-600">-{formatCurrency(financeiro.faturamento_liquido_centavos * 0.025)}</span></div>
          <div className="border-t border-brand-200 pt-2 flex justify-between"><span className="font-semibold text-brand-900">Valor a receber</span><span className="text-xl font-bold text-brand-700">{formatCurrency(financeiro.faturamento_liquido_centavos * 0.975)}</span></div>
        </div>
      </div>
    </div>
  )
}

function SaldoResidual({ eventoId }: { eventoId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['saldo-residual', eventoId],
    queryFn: () => api.relatorios.saldoResidual(eventoId),
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (!data) return null

  const elegibiilidade: Record<string, 'green' | 'amber' | 'red'> = {
    elegivel: 'green', urgente: 'amber', expirado: 'red',
  }
  const elegibilidadeLabel: Record<string, string> = {
    elegivel: 'Elegível', urgente: 'Urgente (<24h)', expirado: 'Prazo expirado',
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-700 mb-1">Total residual</p>
          <p className="text-2xl font-semibold text-amber-800">{formatCurrency(data.resumo.total_residual_centavos)}</p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-zinc-500 mb-1">QRs com saldo</p>
          <p className="text-xl font-semibold">{data.resumo.qtd_qrs}</p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-zinc-500 mb-1">Saldo médio</p>
          <p className="text-xl font-semibold">{formatCurrency(data.resumo.saldo_medio_centavos)}</p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-zinc-500 mb-1">Maior saldo</p>
          <p className="text-xl font-semibold">{formatCurrency(data.resumo.maior_saldo_centavos)}</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">QR Codes com saldo</h2>
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                {['Código', 'Saldo total', 'Reembolsável', 'Prazo limite', 'Situação'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.data.map((item: any) => (
                <tr key={item.qr_id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-700">{item.qr_codigo}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(item.saldo_centavos)}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600">{formatCurrency(item.saldo_reembolsavel_centavos)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-500">{item.prazo_limite ? formatDateTime(item.prazo_limite) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={elegibiilidade[item.elegibilidade]}>{elegibilidadeLabel[item.elegibilidade]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Reconciliacao({ eventoId }: { eventoId: string }) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['reconciliacao', eventoId],
    queryFn: () => api.relatorios.reconciliacao(eventoId),
  })

  const conciliarMutation = useMutation({
    mutationFn: () => api.eventos.update(eventoId, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reconciliacao'] }),
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Equação visual */}
      <div className="grid grid-cols-5 gap-3 items-center">
        <div className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-center">
          <p className="text-xs text-zinc-500 mb-2">Total recarregado</p>
          <p className="text-3xl font-semibold text-zinc-900">{formatCurrency(data.total_recargas_centavos)}</p>
        </div>
        <div className="text-center text-2xl font-bold text-zinc-400">=</div>
        <div className="col-span-2 bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-center">
          <p className="text-xs text-zinc-500 mb-2">Consumido + residual</p>
          <p className="text-3xl font-semibold text-zinc-900">{formatCurrency(data.total_recargas_centavos)}</p>
        </div>
      </div>

      {/* Status */}
      {data.balanceado ? (
        <div className="flex items-center gap-3 p-4 bg-brand-50 border border-brand-200 rounded-xl text-brand-700">
          <CheckCircle size={20} />
          <p className="font-medium">As contas batem — nenhuma divergência encontrada</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertTriangle size={20} />
          <p className="font-medium">Divergência de {formatCurrency(data.divergencia_centavos)} — investigar transações</p>
        </div>
      )}

      {/* Detalhamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-zinc-700 mb-4">Entradas</h3>
          <div className="space-y-2">
            {[
              { label: 'Recargas reais (Pix + cartão + dinheiro)', value: data.total_recargas_centavos, color: '' },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-zinc-100 last:border-0">
                <span className="text-sm text-zinc-600">{item.label}</span>
                <span className="text-sm font-semibold text-zinc-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">{formatCurrency(data.total_recargas_centavos)}</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-zinc-700 mb-4">Saídas + saldo</h3>
          <div className="space-y-2">
            {[
              { label: 'Vendas', value: data.total_vendas_centavos, color: '' },
              { label: 'Reembolsos', value: data.total_reembolsos_centavos, color: 'text-red-600' },
              { label: 'Saldo residual', value: data.saldo_residual_centavos, color: 'text-amber-600' },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-zinc-100 last:border-0">
                <span className="text-sm text-zinc-600">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color || 'text-zinc-900'}`}>{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">{formatCurrency(data.total_recargas_centavos)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Repasse */}
      <Card className="bg-brand-50 border-brand-200">
        <h3 className="text-sm font-semibold text-brand-800 mb-4">Repasse ao organizador</h3>
        <div className="space-y-2">
          {[
            { label: 'Faturamento líquido', value: data.total_recargas_centavos - data.total_reembolsos_centavos, color: '' },
            { label: 'Taxa Qrpag (2,5%)', value: -(data.total_recargas_centavos - data.total_reembolsos_centavos) * 0.025, color: 'text-red-600' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2">
              <span className="text-sm text-brand-700">{item.label}</span>
              <span className={`text-sm font-semibold ${item.color || 'text-brand-900'}`}>{formatCurrency(Math.abs(item.value))}{item.value < 0 ? ' (débito)' : ''}</span>
            </div>
          ))}
          <div className="border-t border-brand-200 pt-3 flex justify-between">
            <span className="font-semibold text-brand-900">Valor a receber</span>
            <span className="text-2xl font-bold text-brand-700">{formatCurrency((data.total_recargas_centavos - data.total_reembolsos_centavos) * 0.975)}</span>
          </div>
        </div>
      </Card>

      {!data.conciliado_em && (
        <div className="flex justify-end">
          <Button variant="primary" loading={conciliarMutation.isPending} onClick={() => conciliarMutation.mutate()}>
            <CheckCircle size={16} /> Marcar como conciliado
          </Button>
        </div>
      )}
    </div>
  )
}
