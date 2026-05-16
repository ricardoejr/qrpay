// ============================================================
// Qrpag Web — Cliente HTTP real
// Substitui os mocks da api/index.ts quando VITE_API_URL estiver definido
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'

// ---- Token storage ----
function getToken(): string | null {
  try {
    const auth = JSON.parse(localStorage.getItem('qrpag-auth') || '{}')
    return auth?.state?.token || null
  } catch {
    return null
  }
}

// ---- Fetch wrapper ----
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestInit
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })

  if (res.status === 204) return {} as T

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data?.error?.message || `Erro ${res.status}`) as any
    err.code = data?.error?.code
    err.status = res.status
    throw err
  }

  return data as T
}

const get = <T>(path: string) => request<T>('GET', path)
const post = <T>(path: string, body?: unknown) => request<T>('POST', path, body)
const patch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body)
const del = <T>(path: string) => request<T>('DELETE', path)

// ============================================================
// API REAL
// ============================================================

export const apiHttp = {
  auth: {
    login: (usuario: string, senha: string, origem = 'painel') =>
      post<any>('/auth/login', { usuario, senha, origem }),
    me: () => get<any>('/auth/me'),
    refresh: (refresh_token: string) => post<any>('/auth/refresh', { refresh_token }),
    logout: () => post('/auth/logout'),
    changePassword: (senha_atual: string, nova_senha: string) =>
      post('/auth/change-password', { senha_atual, nova_senha }),
  },

  organizadores: {
    list: (params?: any) => get<any>(`/admin/organizadores${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => get<any>(`/admin/organizadores/${id}`),
    create: (data: any) => post<any>('/admin/organizadores', data),
    update: (id: string, data: any) => patch<any>(`/admin/organizadores/${id}`, data),
    block: (id: string, motivo: string) => post(`/admin/organizadores/${id}/bloquear`, { motivo }),
    unblock: (id: string) => post(`/admin/organizadores/${id}/desbloquear`),
  },

  eventos: {
    list: (params?: any) => get<any>(`/eventos${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => get<any>(`/eventos/${id}`),
    create: (data: any) => post<any>('/eventos', data),
    update: (id: string, data: any) => patch<any>(`/eventos/${id}`, data),
    ativar: (id: string) => post(`/eventos/${id}/ativar`),
    encerrar: (id: string, data?: any) => post(`/eventos/${id}/encerrar`, data),
    cancelar: (id: string, motivo: string) => post(`/eventos/${id}/cancelar`, { motivo }),
    conciliar: (id: string) => post(`/eventos/${id}/conciliar`),
  },

  pdvs: {
    list: (eventoId: string) => get<any>(`/eventos/${eventoId}/pdvs`),
    create: (eventoId: string, data: any) => post<any>(`/eventos/${eventoId}/pdvs`, data),
    update: (id: string, data: any) => patch<any>(`/pdvs/${id}`, data),
    ativar: (id: string) => post(`/pdvs/${id}/ativar`),
    desativar: (id: string) => post(`/pdvs/${id}/desativar`),
    listProdutos: (id: string) => get<any>(`/pdvs/${id}/produtos`),
    updateProdutos: (id: string, produtos: any[]) => request<any>('PUT', `/pdvs/${id}/produtos`, { produtos }),
  },

  catalogo: {
    list: (params?: any) => get<any>(`/catalogo${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => get<any>(`/catalogo/${id}`),
    create: (data: any) => post<any>('/catalogo', data),
    update: (id: string, data: any) => patch<any>(`/catalogo/${id}`, data),
    delete: (id: string) => del(`/catalogo/${id}`),
    uploadUrl: (id: string, content_type: string) =>
      post<any>(`/catalogo/${id}/foto/upload-url`, { content_type }),
  },

  produtos: {
    list: (eventoId: string, params?: any) =>
      get<any>(`/eventos/${eventoId}/produtos${params ? '?' + new URLSearchParams(params) : ''}`),
    create: (eventoId: string, data: any) => post<any>(`/eventos/${eventoId}/produtos`, data),
    bulkAdd: (eventoId: string, produtos: any[]) => post<any>(`/eventos/${eventoId}/produtos/bulk`, { produtos }),
    get: (id: string) => get<any>(`/produtos-evento/${id}`),
    update: (id: string, data: any) => patch<any>(`/produtos-evento/${id}`, data),
    delete: (id: string) => del(`/produtos-evento/${id}`),
    bloquear: (id: string, motivo: string) => post(`/produtos-evento/${id}/bloquear`, { motivo }),
    desbloquear: (id: string) => post(`/produtos-evento/${id}/desbloquear`),
    reporEstoque: (id: string, operacao: string, quantidade: number, observacao?: string) =>
      post<any>(`/produtos-evento/${id}/repor-estoque`, { operacao, quantidade, observacao }),
    movimentos: (id: string) => get<any>(`/produtos-evento/${id}/movimentos`),
  },

  operadores: {
    list: (params?: any) => get<any>(`/operadores${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => get<any>(`/operadores/${id}`),
    create: (data: any) => post<any>('/operadores', data),
    update: (id: string, data: any) => patch<any>(`/operadores/${id}`, data),
    desativar: (id: string) => post(`/operadores/${id}/desativar`),
    reativar: (id: string) => post(`/operadores/${id}/reativar`),
    resetarSenha: (id: string) => post<any>(`/operadores/${id}/resetar-senha`),
    listAlocacoes: (eventoId: string) => get<any>(`/eventos/${eventoId}/operadores`),
    alocar: (eventoId: string, data: any) => post<any>(`/eventos/${eventoId}/operadores`, data),
    removeAlocacao: (id: string) => del(`/alocacoes/${id}`),
  },

  lotes: {
    list: (eventoId: string) => get<any>(`/eventos/${eventoId}/lotes`),
    create: (eventoId: string, data: any) => post<any>(`/eventos/${eventoId}/lotes`, data),
    pdf: (id: string) => get<any>(`/lotes/${id}/pdf`),
    regenerarPdf: (id: string, config?: any) => post(`/lotes/${id}/pdf/regenerar`, config),
  },

  qrCodes: {
    buscar: (codigo: string, eventoId?: string) =>
      get<any>(`/qr-codes/buscar?codigo=${codigo}${eventoId ? `&evento_id=${eventoId}` : ''}`),
    get: (id: string) => get<any>(`/qr-codes/${id}`),
    transacoes: (id: string, page = 1) => get<any>(`/qr-codes/${id}/transacoes?page=${page}`),
    bloquear: (id: string, motivo: string, detalhes?: any) =>
      post(`/qr-codes/${id}/bloquear`, { motivo, ...detalhes }),
    desbloquear: (id: string) => post(`/qr-codes/${id}/desbloquear`),
    substituir: (id: string, destino: any) => post<any>(`/qr-codes/${id}/substituir`, { qr_destino: destino }),
    list: (eventoId: string) => get<any>(`/eventos/${eventoId}/qr-codes`),
  },

  app: {
    lerQR: (codigo: string, eventoId?: string) =>
      get<any>(`/app/qr-codes/${codigo}${eventoId ? `?evento_id=${eventoId}` : ''}`),
    recarga: (data: any) => post<any>('/app/recargas', data),
    venda: (data: any) => post<any>('/app/vendas', data),
    reembolso: (data: any) => post<any>('/app/reembolsos', data),
    cortesia: (data: any) => post<any>('/app/cortesias', data),
    transferencia: (data: any) => post<any>('/app/transferencias', data),
  },

  dashboard: {
    snapshot: (eventoId: string) => get<any>(`/eventos/${eventoId}/dashboard`),
    stream: (eventoId: string) => new EventSource(`${API_BASE}/eventos/${eventoId}/dashboard/stream?token=${getToken()}`),
  },

  relatorios: {
    consolidado: (eventoId: string) => get<any>(`/eventos/${eventoId}/relatorios/consolidado`),
    saldoResidual: (eventoId: string, elegibilidade?: string) =>
      get<any>(`/eventos/${eventoId}/relatorios/saldo-residual${elegibilidade ? `?elegibilidade=${elegibilidade}` : ''}`),
    reconciliacao: (eventoId: string) => get<any>(`/eventos/${eventoId}/relatorios/reconciliacao`),
    transacoes: (eventoId: string, params?: any) =>
      get<any>(`/eventos/${eventoId}/transacoes${params ? '?' + new URLSearchParams(params) : ''}`),
  },

  export: {
    iniciar: (data: any) => post<any>('/export', data),
    status: (jobId: string) => get<any>(`/export/${jobId}`),
  },

  auditoria: {
    list: (params?: any) => get<any>(`/auditoria${params ? '?' + new URLSearchParams(params) : ''}`),
    get: (id: string) => get<any>(`/auditoria/${id}`),
  },
}
