import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/auth'
import LoginPage from './pages/auth/LoginPage'
import EventosPage from './pages/eventos/EventosPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import QRCodesPage from './pages/qr/QRCodesPage'
import RelatoriosPage from './pages/relatorios/RelatoriosPage'
import { AppLayout, EventoTabs } from './components/layout/AppLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import { Button, Badge, Spinner } from './components/ui'
import { formatDateTime } from './lib/utils'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } }
})

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function VisaoGeralPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data } = useQuery({ queryKey: ['eventos'], queryFn: api.eventos.list })
  const evento = data?.data.find(e => e.id === id)

  const checklist = [
    { label: 'Pelo menos 1 ponto de venda criado', done: true, link: 'pdvs' },
    { label: 'Produtos no cardápio', done: true, link: 'cardapio' },
    { label: 'Operadores alocados', done: false, link: 'operadores' },
    { label: 'Lote de QR Codes gerado', done: true, link: 'qr-codes' },
  ]
  const allDone = checklist.every(c => c.done)

  return (
    <div>
      <EventoTabs eventoId={id!} activeTab="visao-geral" eventoNome={evento?.nome || 'Evento'} eventoStatus={evento?.status || 'rascunho'} />
      <div className="p-6 max-w-2xl mx-auto">
        {evento?.status === 'rascunho' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Configuração do evento</h2>
                <p className="text-sm text-zinc-500">{checklist.filter(c => c.done).length} de {checklist.length} etapas concluídas</p>
              </div>
              <Button variant="primary" disabled={!allDone}>Ativar evento</Button>
            </div>
            <div className="space-y-3">
              {checklist.map(item => (
                <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${item.done ? 'bg-brand-50 border-brand-200 hover:bg-brand-100' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => navigate(`/eventos/${id}/${item.link}`)}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-brand-500 text-white' : 'border-2 border-zinc-300'}`}>
                    {item.done && <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                  <span className={`text-sm font-medium ${item.done ? 'text-brand-700' : 'text-zinc-700'}`}>{item.label}</span>
                  <span className="ml-auto text-zinc-400 text-xs">Configurar →</span>
                </div>
              ))}
            </div>
          </>
        )}
        {evento?.status === 'ativo' && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Evento em andamento!</h2>
            <p className="text-sm text-zinc-500 mb-6">Acompanhe as operações em tempo real</p>
            <Button variant="primary" size="lg" onClick={() => navigate(`/eventos/${id}/dashboard`)}>Ver dashboard ao vivo</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function PlaceholderPage({ tab }: { tab: string }) {
  const { id } = useParams<{ id: string }>()
  const labels: Record<string, string> = { pdvs: 'Pontos de Venda', cardapio: 'Cardápio', operadores: 'Operadores' }
  return (
    <div>
      <EventoTabs eventoId={id!} activeTab={tab} eventoNome="Evento" eventoStatus="ativo" />
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
        <div className="text-5xl mb-4">🚧</div>
        <p className="text-base font-medium text-zinc-600">{labels[tab] || tab}</p>
        <p className="text-sm text-zinc-400 mt-1">Tela em desenvolvimento</p>
      </div>
    </div>
  )
}

function CatalogoPage() {
  const { data, isLoading } = useQuery({ queryKey: ['catalogo'], queryFn: api.catalogo.list })
  const produtos = data?.data || []
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Catálogo de produtos</h1>
          <Button variant="primary">+ Novo produto</Button>
        </div>
        {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map(p => (
              <div key={p.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🍺</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{p.nome}</h3>
                    {p.descricao && <p className="text-xs text-zinc-400 mt-0.5">{p.descricao}</p>}
                    {p.categoria && <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded-full">{p.categoria}</span>}
                  </div>
                </div>
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-base font-semibold text-brand-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.preco_padrao_centavos / 100)}</span>
                  <Button size="sm">Editar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function OperadoresListPage() {
  const { data, isLoading } = useQuery({ queryKey: ['operadores'], queryFn: api.operadores.list })
  const operadores = data?.data || []
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Operadores</h1>
          <Button variant="primary">+ Novo operador</Button>
        </div>
        {isLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>{['Nome', 'Usuário', 'Último acesso', 'Status', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody>
                {operadores.map(op => (
                  <tr key={op.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{op.nome}</td>
                    <td className="px-4 py-3 text-sm font-mono text-zinc-500">{op.usuario}</td>
                    <td className="px-4 py-3 text-sm text-zinc-500">{op.ultimo_acesso_app ? formatDateTime(op.ultimo_acesso_app) : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={op.ativo ? 'green' : 'gray'}>{op.ativo ? 'Ativo' : 'Inativo'}</Badge></td>
                    <td className="px-4 py-3 flex gap-1"><Button size="sm">Editar</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/eventos" replace />} />

          <Route path="/eventos" element={<ProtectedRoute><EventosPage /></ProtectedRoute>} />
          <Route path="/catalogo" element={<ProtectedRoute><CatalogoPage /></ProtectedRoute>} />
          <Route path="/operadores" element={<ProtectedRoute><OperadoresListPage /></ProtectedRoute>} />

          <Route path="/eventos/:id/visao-geral" element={<ProtectedRoute><AppLayout><VisaoGeralPage /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/pdvs" element={<ProtectedRoute><AppLayout><PlaceholderPage tab="pdvs" /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/cardapio" element={<ProtectedRoute><AppLayout><PlaceholderPage tab="cardapio" /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/operadores" element={<ProtectedRoute><AppLayout><PlaceholderPage tab="operadores" /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/qr-codes" element={<ProtectedRoute><AppLayout><QRCodesPage /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/eventos/:id/relatorios" element={<ProtectedRoute><AppLayout><RelatoriosPage /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/eventos" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
