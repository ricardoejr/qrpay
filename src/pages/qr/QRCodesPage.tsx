import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'
import { EventoTabs } from '../../components/layout/AppLayout'
import { Button, Badge, Modal, Table, TR, TD, Spinner, EmptyState, Input, PageHeader } from '../../components/ui'
import { formatDateTime, formatCurrency, TRANSACAO_TIPO_LABEL, FORMA_PAGAMENTO_LABEL } from '../../lib/utils'
import type { QRCode } from '../../types'
import { QrCode, Search, Plus, Download, Lock, RefreshCw, Eye } from 'lucide-react'

const QR_STATUS_BADGE: Record<string, 'green' | 'gray' | 'red' | 'blue' | 'amber'> = {
  disponivel: 'gray', ativo: 'green', bloqueado: 'red', substituido: 'blue', encerrado: 'gray',
}

export default function QRCodesPage() {
  const { id: eventoId } = useParams<{ id: string }>()
  const [viewQR, setViewQR] = useState<QRCode | null>(null)
  const [showGerarModal, setShowGerarModal] = useState(false)
  const [showBloquearModal, setShowBloquearModal] = useState<QRCode | null>(null)
  const [busca, setBusca] = useState('')
  const [motivoBloqueio, setMotivoBloqueio] = useState('perda')
  const queryClient = useQueryClient()

  const { data: lotesData, isLoading: isLoadingLotes } = useQuery({
    queryKey: ['lotes', eventoId],
    queryFn: () => api.lotes.list(eventoId!),
  })

  const { data: qrsData } = useQuery({
    queryKey: ['qr-codes', eventoId],
    queryFn: () => api.qrCodes.list(eventoId!),
  })

  const { data: txData } = useQuery({
    queryKey: ['qr-transacoes', viewQR?.id],
    queryFn: () => api.qrCodes.transacoes(viewQR!.id),
    enabled: !!viewQR,
  })

  const bloquearMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => api.qrCodes.bloquear(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] })
      setShowBloquearModal(null)
    },
  })

  const lotes = lotesData?.data || []
  const qrs = qrsData?.data || []
  const filteredQRs = qrs.filter(q => !busca || q.codigo.includes(busca.toUpperCase()))

  const eventoData = api.eventos.get(eventoId!)

  return (
    <div>
      <EventoTabs eventoId={eventoId!} activeTab="qr-codes" eventoNome="Festival de Verão 2026" eventoStatus="ativo" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Lotes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Lotes de QR Codes</h2>
              <p className="text-sm text-zinc-500">{lotes.length} lote{lotes.length !== 1 ? 's' : ''} gerado{lotes.length !== 1 ? 's' : ''}</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowGerarModal(true)}>
              <Plus size={14} /> Gerar novo lote
            </Button>
          </div>

          {isLoadingLotes ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lotes.map(lote => (
                <div key={lote.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">{lote.nome || `Lote #${lote.id.slice(-4)}`}</h3>
                      <p className="text-xs text-zinc-400">{formatDateTime(lote.criado_em)}</p>
                    </div>
                    <Badge variant="gray">{lote.padrao_codigo}</Badge>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500">Ativados</span>
                      <span className="font-medium">{lote.qrs_ativados} / {lote.quantidade}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${lote.percentual_ativado}%` }} />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">{lote.percentual_ativado.toFixed(1)}% ativado</p>
                  </div>
                  <div className="flex gap-2">
                    {lote.pdf_disponivel && (
                      <Button size="sm" className="gap-1">
                        <Download size={13} /> Baixar PDF
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">Ver QR Codes</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consulta de QRs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Consultar QR Code</h2>
          </div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por código (ex: QRPAG-A7K2)"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono"
            />
          </div>

          <Table headers={['Código', 'Status', 'Saldo', 'Ativado em', 'Ações']}>
            {filteredQRs.map(qr => (
              <TR key={qr.id}>
                <TD><span className="font-mono text-xs">{qr.codigo}</span></TD>
                <TD>
                  <Badge variant={QR_STATUS_BADGE[qr.status]}>
                    {qr.status === 'ativo' && <span className="live-dot mr-1" style={{ width: 6, height: 6 }} />}
                    {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                  </Badge>
                  {qr.motivo_bloqueio && <p className="text-[10px] text-zinc-400 mt-0.5">{qr.motivo_bloqueio}</p>}
                </TD>
                <TD><span className="font-semibold text-brand-600">{formatCurrency(qr.saldo_centavos)}</span></TD>
                <TD className="text-zinc-500">{qr.ativado_em ? formatDateTime(qr.ativado_em) : <span className="text-zinc-300">—</span>}</TD>
                <TD>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => setViewQR(qr)}><Eye size={13} /> Detalhes</Button>
                    {qr.status === 'ativo' && <Button size="sm" variant="danger" onClick={() => setShowBloquearModal(qr)}><Lock size={13} /></Button>}
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        </div>
      </div>

      {/* Modal: Detalhes do QR */}
      <Modal open={!!viewQR} onClose={() => setViewQR(null)} title={`QR Code — ${viewQR?.codigo}`} className="max-w-2xl mx-4">
        {viewQR && (
          <div className="space-y-5">
            {/* Status e saldo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Status</p>
                <Badge variant={QR_STATUS_BADGE[viewQR.status]}>
                  {viewQR.status.charAt(0).toUpperCase() + viewQR.status.slice(1)}
                </Badge>
              </div>
              <div className="bg-brand-50 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Saldo atual</p>
                <p className="text-2xl font-semibold text-brand-700">{formatCurrency(viewQR.saldo_centavos)}</p>
              </div>
            </div>

            {/* Resumo financeiro */}
            {viewQR.total_recarregado_centavos !== undefined && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-zinc-50 rounded-lg">
                  <p className="text-lg font-semibold text-zinc-900">{formatCurrency(viewQR.total_recarregado_centavos)}</p>
                  <p className="text-xs text-zinc-500">Total recarregado</p>
                </div>
                <div className="text-center p-3 bg-zinc-50 rounded-lg">
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(viewQR.total_gasto_centavos || 0)}</p>
                  <p className="text-xs text-zinc-500">Total gasto</p>
                </div>
                <div className="text-center p-3 bg-zinc-50 rounded-lg">
                  <p className="text-lg font-semibold text-emerald-600">{formatCurrency(viewQR.saldo_reembolsavel_centavos || 0)}</p>
                  <p className="text-xs text-zinc-500">Reembolsável</p>
                </div>
              </div>
            )}

            {/* Histórico */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">Histórico de transações</h3>
              <div className="space-y-2">
                {(txData?.data || []).map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.valor_centavos > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{TRANSACAO_TIPO_LABEL[tx.tipo]}</span>
                        {tx.forma_pagamento && <Badge variant="gray" className="text-[10px]">{FORMA_PAGAMENTO_LABEL[tx.forma_pagamento]}</Badge>}
                      </div>
                      <p className="text-[10px] text-zinc-400">{tx.pdv_nome} · {formatDateTime(tx.criado_em)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${tx.valor_centavos > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.valor_centavos > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.valor_centavos))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-100">
              {viewQR.status === 'ativo' && (
                <Button variant="danger" size="sm" onClick={() => { setShowBloquearModal(viewQR); setViewQR(null) }}>
                  <Lock size={14} /> Bloquear
                </Button>
              )}
              <Button size="sm" className="flex items-center gap-1">
                <RefreshCw size={13} /> Substituir QR
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setViewQR(null)} className="ml-auto">Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Bloquear QR */}
      <Modal open={!!showBloquearModal} onClose={() => setShowBloquearModal(null)} title={`Bloquear QR — ${showBloquearModal?.codigo}`}>
        {showBloquearModal && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              O saldo de <strong>{formatCurrency(showBloquearModal.saldo_centavos)}</strong> será preservado. O QR não poderá ser usado para novas operações.
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-600 block mb-1">Motivo do bloqueio</label>
              <select
                value={motivoBloqueio}
                onChange={e => setMotivoBloqueio(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="perda">Perda relatada pelo cliente</option>
                <option value="clonagem">Suspeita de clonagem/fraude</option>
                <option value="solicitacao_cliente">Solicitação do cliente</option>
                <option value="administrativo">Decisão administrativa</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowBloquearModal(null)}>Cancelar</Button>
              <Button
                variant="danger"
                loading={bloquearMutation.isPending}
                onClick={() => bloquearMutation.mutate({ id: showBloquearModal.id, motivo: motivoBloqueio })}
              >
                <Lock size={14} /> Confirmar bloqueio
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Gerar Lote */}
      <GerarLoteModal
        open={showGerarModal}
        onClose={() => setShowGerarModal(false)}
        eventoId={eventoId!}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['lotes'] })
          setShowGerarModal(false)
        }}
      />
    </div>
  )
}

function GerarLoteModal({ open, onClose, eventoId, onSuccess }: { open: boolean; onClose: () => void; eventoId: string; onSuccess: () => void }) {
  const [form, setForm] = useState({ nome: '', quantidade: 500 })
  const QTDS = [100, 500, 1000, 5000]

  const mutation = useMutation({
    mutationFn: () => api.lotes.create({ nome: form.nome, quantidade: form.quantidade }),
    onSuccess,
  })

  return (
    <Modal open={open} onClose={onClose} title="Gerar novo lote de QR Codes">
      <div className="space-y-4">
        <Input
          label="Nome do lote (opcional)"
          placeholder="Ex: Lote VIP, Lote sábado..."
          value={form.nome}
          onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
        />
        <div>
          <label className="text-xs font-medium text-zinc-600 block mb-2">Quantidade</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {QTDS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setForm(p => ({ ...p, quantidade: q }))}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${form.quantidade === q ? 'bg-brand-500 text-white border-brand-600' : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'}`}
              >
                {q.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={50000}
            value={form.quantidade}
            onChange={e => setForm(p => ({ ...p, quantidade: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-500">
          Estimativa: ~{Math.round(form.quantidade / 33)}s para gerar e criar o PDF.
          O PDF ficará disponível para download após a geração.
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" loading={mutation.isPending} onClick={() => mutation.mutate()}>
            <QrCode size={14} /> Gerar lote
          </Button>
        </div>
      </div>
    </Modal>
  )
}
