import type { Evento, Operador, Organizador, PontoVenda, ProdutoCatalogo, ProdutoEvento, LoteQR, QRCode, Transacao, DashboardMetricas, PDVFaturamento } from '../types'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================================
// MOCK DATA
// ============================================================

export const mockUser = {
  id: '1',
  nome: 'João Admin',
  usuario: 'joaoadmin',
  perfil: 'admin_organizador' as const,
  papel_painel: 'admin_principal' as const,
  organizador_id: 'org-1',
  organizador_nome: 'Eventos Brasil Ltda',
}

export const mockOrganizadores: Organizador[] = [
  { id: 'org-1', nome: 'Eventos Brasil Ltda', nome_fantasia: 'Eventos Brasil', cnpj_cpf: '12.345.678/0001-90', email: 'contato@eventosbrasil.com', telefone: '(11) 99999-9999', ativo: true, taxa_servico_percentual: 2.5, criado_em: '2026-01-15T10:00:00Z' },
  { id: 'org-2', nome: 'Festas & Cia EIRELI', nome_fantasia: 'Festas & Cia', cnpj_cpf: '98.765.432/0001-10', email: 'festa@festasecia.com', telefone: '(21) 88888-8888', ativo: true, taxa_servico_percentual: 2.0, criado_em: '2026-02-01T10:00:00Z' },
  { id: 'org-3', nome: 'Cultura SP ME', cnpj_cpf: '11.222.333/0001-44', email: 'contato@culturasp.com', ativo: false, motivo_bloqueio: 'Inadimplência', taxa_servico_percentual: 3.0, criado_em: '2026-03-10T10:00:00Z' },
]

export const mockEventos: Evento[] = [
  {
    id: 'evt-1', organizador_id: 'org-1', nome: 'Festival de Verão 2026',
    descricao: 'O maior festival de verão do interior paulista',
    local: 'Espaço das Américas, SP',
    data_inicio: '2026-12-15T18:00:00-03:00',
    data_fim: '2026-12-16T04:00:00-03:00',
    status: 'ativo', permite_reembolso: true, prazo_reembolso_horas: 48,
    permite_cortesia: true, limite_cortesia_centavos: 10000,
    permite_transferencia: false, controla_estoque: true,
    taxa_servico_percentual: 2.5, criado_em: '2026-11-01T10:00:00Z',
  },
  {
    id: 'evt-2', organizador_id: 'org-1', nome: 'Réveillon Premium 2027',
    local: 'Hotel Grand Hyatt, SP',
    data_inicio: '2026-12-31T20:00:00-03:00',
    data_fim: '2027-01-01T06:00:00-03:00',
    status: 'rascunho', permite_reembolso: true, prazo_reembolso_horas: 24,
    permite_cortesia: false, permite_transferencia: true,
    controla_estoque: false, taxa_servico_percentual: 2.5,
    criado_em: '2026-11-15T10:00:00Z',
  },
  {
    id: 'evt-3', organizador_id: 'org-1', nome: 'Festa Junina 2026',
    local: 'Parque Estadual, SP',
    data_inicio: '2026-06-24T16:00:00-03:00',
    data_fim: '2026-06-25T00:00:00-03:00',
    status: 'encerrado', permite_reembolso: false,
    permite_cortesia: false, permite_transferencia: false,
    controla_estoque: false, taxa_servico_percentual: 2.5,
    criado_em: '2026-05-01T10:00:00Z',
  },
]

export const mockOperadores: Operador[] = [
  { id: 'op-1', organizador_id: 'org-1', nome: 'Maria Operadora', cpf: '111.222.333-44', usuario: 'maria_op', perfil: 'operador', ativo: true, ultimo_acesso_app: '2026-12-15T21:30:00Z', criado_em: '2026-10-01T10:00:00Z' },
  { id: 'op-2', organizador_id: 'org-1', nome: 'Carlos Vendedor', cpf: '222.333.444-55', usuario: 'carlos_v', perfil: 'operador', ativo: true, ultimo_acesso_app: '2026-12-15T22:15:00Z', criado_em: '2026-10-01T10:00:00Z' },
  { id: 'op-3', organizador_id: 'org-1', nome: 'Ana Caixa', cpf: '333.444.555-66', usuario: 'ana_cx', perfil: 'operador', ativo: true, ultimo_acesso_app: '2026-12-15T20:45:00Z', criado_em: '2026-10-01T10:00:00Z' },
  { id: 'op-4', organizador_id: 'org-1', nome: 'Pedro Inativo', cpf: '444.555.666-77', usuario: 'pedro_i', perfil: 'operador', ativo: false, criado_em: '2026-10-01T10:00:00Z' },
]

export const mockPDVs: PontoVenda[] = [
  { id: 'pdv-1', evento_id: 'evt-1', nome: 'Caixa Entrada', tipo: 'caixa', localizacao_interna: 'Portão principal', ativo: true, criado_em: '2026-11-10T10:00:00Z' },
  { id: 'pdv-2', evento_id: 'evt-1', nome: 'Bar Central', tipo: 'venda', localizacao_interna: 'Área central', ativo: true, criado_em: '2026-11-10T10:00:00Z' },
  { id: 'pdv-3', evento_id: 'evt-1', nome: 'Bar Lateral', tipo: 'venda', localizacao_interna: 'Lado esquerdo', ativo: true, criado_em: '2026-11-10T10:00:00Z' },
  { id: 'pdv-4', evento_id: 'evt-1', nome: 'Caixa VIP', tipo: 'misto', localizacao_interna: 'Área VIP', ativo: true, criado_em: '2026-11-10T10:00:00Z' },
  { id: 'pdv-5', evento_id: 'evt-1', nome: 'Bar Fundo', tipo: 'venda', localizacao_interna: 'Fundo do palco', ativo: false, criado_em: '2026-11-10T10:00:00Z' },
]

export const mockCatalogo: ProdutoCatalogo[] = [
  { id: 'cat-1', organizador_id: 'org-1', nome: 'Cerveja Lata 350ml', descricao: 'Cerveja gelada em lata', preco_padrao_centavos: 1500, categoria: 'Bebida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
  { id: 'cat-2', organizador_id: 'org-1', nome: 'Cerveja Long Neck', descricao: 'Long neck 355ml', preco_padrao_centavos: 1800, categoria: 'Bebida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
  { id: 'cat-3', organizador_id: 'org-1', nome: 'Água Mineral 500ml', preco_padrao_centavos: 500, categoria: 'Bebida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
  { id: 'cat-4', organizador_id: 'org-1', nome: 'Refrigerante Lata', preco_padrao_centavos: 900, categoria: 'Bebida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
  { id: 'cat-5', organizador_id: 'org-1', nome: 'Hambúrguer Artesanal', descricao: '180g, pão brioche, blend especial', preco_padrao_centavos: 3200, categoria: 'Comida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
  { id: 'cat-6', organizador_id: 'org-1', nome: 'Porção Batata Frita', descricao: '300g com molhos', preco_padrao_centavos: 2800, categoria: 'Comida', ativo: true, criado_em: '2026-01-01T10:00:00Z' },
]

export const mockProdutos: ProdutoEvento[] = [
  { id: 'pe-1', evento_id: 'evt-1', produto_catalogo_id: 'cat-1', nome: 'Cerveja Lata 350ml', preco_centavos: 1500, categoria: 'Bebida', ordem_exibicao: 1, controla_estoque: true, estoque_atual: 42, estoque_inicial: 500, estoque_baixo: false, bloqueado: false, ativo: true },
  { id: 'pe-2', evento_id: 'evt-1', produto_catalogo_id: 'cat-2', nome: 'Cerveja Long Neck', preco_centavos: 1800, categoria: 'Bebida', ordem_exibicao: 2, controla_estoque: true, estoque_atual: 8, estoque_inicial: 200, estoque_baixo: true, bloqueado: false, ativo: true },
  { id: 'pe-3', evento_id: 'evt-1', produto_catalogo_id: 'cat-3', nome: 'Água Mineral 500ml', preco_centavos: 500, categoria: 'Bebida', ordem_exibicao: 3, controla_estoque: false, estoque_baixo: false, bloqueado: false, ativo: true },
  { id: 'pe-4', evento_id: 'evt-1', produto_catalogo_id: 'cat-5', nome: 'Hambúrguer Artesanal', preco_centavos: 3200, categoria: 'Comida', ordem_exibicao: 4, controla_estoque: true, estoque_atual: 0, estoque_inicial: 80, estoque_baixo: false, bloqueado: true, motivo_bloqueio: 'Estoque zerado', ativo: true },
  { id: 'pe-5', evento_id: 'evt-1', produto_catalogo_id: 'cat-6', nome: 'Porção Batata Frita', preco_centavos: 2800, categoria: 'Comida', ordem_exibicao: 5, controla_estoque: false, estoque_baixo: false, bloqueado: false, ativo: true },
]

export const mockLotes: LoteQR[] = [
  { id: 'lote-1', evento_id: 'evt-1', nome: 'Lote Principal', quantidade: 1000, padrao_codigo: 'aleatorio', pdf_disponivel: true, arquivo_pdf_url: '#', qrs_ativados: 342, percentual_ativado: 34.2, criado_em: '2026-12-01T10:00:00Z' },
  { id: 'lote-2', evento_id: 'evt-1', nome: 'Lote VIP', quantidade: 200, padrao_codigo: 'aleatorio', pdf_disponivel: true, arquivo_pdf_url: '#', qrs_ativados: 87, percentual_ativado: 43.5, criado_em: '2026-12-05T10:00:00Z' },
]

export const mockQRs: QRCode[] = [
  { id: 'qr-1', evento_id: 'evt-1', lote_id: 'lote-1', codigo: 'QRPAG-A7K2-9XQ4-LM31', saldo_centavos: 5500, cortesia_acumulada_centavos: 0, status: 'ativo', ativado_em: '2026-12-15T18:42:00Z', criado_em: '2026-12-01T10:00:00Z', total_recarregado_centavos: 15000, total_gasto_centavos: 9500, total_reembolsado_centavos: 0, saldo_reembolsavel_centavos: 5500 },
  { id: 'qr-2', evento_id: 'evt-1', lote_id: 'lote-1', codigo: 'QRPAG-B3K9-QR7M-NP82', saldo_centavos: 0, cortesia_acumulada_centavos: 0, status: 'disponivel', criado_em: '2026-12-01T10:00:00Z' },
  { id: 'qr-3', evento_id: 'evt-1', lote_id: 'lote-1', codigo: 'QRPAG-C5R2-XT4L-WZ19', saldo_centavos: 2000, cortesia_acumulada_centavos: 2000, status: 'bloqueado', motivo_bloqueio: 'Perda relatada pelo cliente', ativado_em: '2026-12-15T19:00:00Z', criado_em: '2026-12-01T10:00:00Z' },
]

export const mockTransacoes: Transacao[] = [
  { id: 'tx-1', evento_id: 'evt-1', qr_code_id: 'qr-1', qr_codigo: 'QRPAG-A7K2', ponto_venda_id: 'pdv-2', pdv_nome: 'Bar Central', operador_id: 'op-2', operador_nome: 'Carlos V.', tipo: 'venda', modo_lancamento: 'itens', valor_centavos: -4500, saldo_anterior_centavos: 10000, saldo_posterior_centavos: 5500, criado_em: '2026-12-15T21:32:00Z' },
  { id: 'tx-2', evento_id: 'evt-1', qr_code_id: 'qr-1', qr_codigo: 'QRPAG-A7K2', ponto_venda_id: 'pdv-1', pdv_nome: 'Caixa Entrada', operador_id: 'op-3', operador_nome: 'Ana Cx.', tipo: 'recarga', modo_lancamento: 'valor', valor_centavos: 10000, saldo_anterior_centavos: 0, saldo_posterior_centavos: 10000, forma_pagamento: 'pix', criado_em: '2026-12-15T20:01:00Z' },
  { id: 'tx-3', evento_id: 'evt-1', qr_code_id: 'qr-3', qr_codigo: 'QRPAG-C5R2', ponto_venda_id: 'pdv-4', pdv_nome: 'Caixa VIP', operador_id: 'op-3', operador_nome: 'Ana Cx.', tipo: 'cortesia', valor_centavos: 2000, saldo_anterior_centavos: 0, saldo_posterior_centavos: 2000, criado_em: '2026-12-15T19:00:00Z' },
  { id: 'tx-4', evento_id: 'evt-1', qr_code_id: 'qr-1', qr_codigo: 'QRPAG-9XQ4', ponto_venda_id: 'pdv-2', pdv_nome: 'Bar Lateral', operador_id: 'op-2', operador_nome: 'Carlos V.', tipo: 'venda', modo_lancamento: 'valor', valor_centavos: -5000, saldo_anterior_centavos: 5000, saldo_posterior_centavos: 0, criado_em: '2026-12-15T18:55:00Z' },
  { id: 'tx-5', evento_id: 'evt-1', qr_code_id: 'qr-1', qr_codigo: 'QRPAG-B3K9', ponto_venda_id: 'pdv-1', pdv_nome: 'Caixa Entrada', operador_id: 'op-3', operador_nome: 'Ana Cx.', tipo: 'recarga', modo_lancamento: 'valor', valor_centavos: 5000, saldo_anterior_centavos: 0, saldo_posterior_centavos: 5000, forma_pagamento: 'dinheiro', criado_em: '2026-12-15T18:42:00Z' },
]

export const mockDashboard: DashboardMetricas = {
  faturamento_total_centavos: 4523000,
  faturamento_variacao_hora_centavos: 123400,
  ticket_medio_centavos: 3620,
  saldo_em_circulacao_centavos: 1284000,
  saldo_tendencia: 'caindo',
  qrs_ativos: 342,
  qrs_emitidos: 1200,
  operadores_online: 12,
  transacoes_por_minuto: 47,
}

export const mockFaturamentoPDV: PDVFaturamento[] = [
  { pdv_id: 'pdv-1', nome: 'Caixa Entrada', tipo: 'caixa', valor_centavos: 1423000, percentual: 31.5, qtd_transacoes: 234, inativo_minutos: 0 },
  { pdv_id: 'pdv-2', nome: 'Bar Central', tipo: 'venda', valor_centavos: 1082000, percentual: 23.9, qtd_transacoes: 312, inativo_minutos: 0 },
  { pdv_id: 'pdv-3', nome: 'Bar Lateral', tipo: 'venda', valor_centavos: 814000, percentual: 18.0, qtd_transacoes: 198, inativo_minutos: 0 },
  { pdv_id: 'pdv-5', nome: 'Bar Fundo', tipo: 'venda', valor_centavos: 603000, percentual: 13.3, qtd_transacoes: 142, inativo_minutos: 35 },
  { pdv_id: 'pdv-4', nome: 'Caixa VIP', tipo: 'misto', valor_centavos: 601000, percentual: 13.3, qtd_transacoes: 89, inativo_minutos: 0 },
]

// ============================================================
// API SIMULADA
// ============================================================

export const api = {
  auth: {
    login: async (usuario: string, _senha: string) => {
      await delay(600)
      if (usuario === 'admin' || usuario === 'joaoadmin') {
        return { access_token: 'mock-token', user: mockUser }
      }
      throw new Error('Usuário ou senha incorretos')
    },
    me: async () => { await delay(200); return mockUser },
  },

  organizadores: {
    list: async () => { await delay(400); return { data: mockOrganizadores, pagination: { page: 1, per_page: 25, total_items: 3, total_pages: 1 } } },
    get: async (id: string) => { await delay(300); return mockOrganizadores.find(o => o.id === id) },
    create: async (data: Partial<Organizador>) => { await delay(800); return { ...data, id: `org-${Date.now()}`, ativo: true, taxa_servico_percentual: 2.5, criado_em: new Date().toISOString() } },
    update: async (id: string, data: Partial<Organizador>) => { await delay(600); return { ...mockOrganizadores.find(o => o.id === id), ...data } },
    block: async (_id: string, _motivo: string) => { await delay(400); return { success: true } },
    unblock: async (_id: string) => { await delay(400); return { success: true } },
  },

  eventos: {
    list: async () => { await delay(400); return { data: mockEventos } },
    get: async (id: string) => { await delay(300); return mockEventos.find(e => e.id === id) },
    create: async (data: Partial<Evento>) => { await delay(800); return { ...data, id: `evt-${Date.now()}`, status: 'rascunho', criado_em: new Date().toISOString() } },
    update: async (id: string, data: Partial<Evento>) => { await delay(600); return { ...mockEventos.find(e => e.id === id), ...data } },
    ativar: async (_id: string) => { await delay(500); return { success: true } },
    encerrar: async (_id: string) => { await delay(500); return { success: true } },
  },

  pdvs: {
    list: async (_eventoId: string) => { await delay(300); return { data: mockPDVs } },
    create: async (data: Partial<PontoVenda>) => { await delay(600); return { ...data, id: `pdv-${Date.now()}`, ativo: true, criado_em: new Date().toISOString() } },
    update: async (id: string, data: Partial<PontoVenda>) => { await delay(500); return { ...mockPDVs.find(p => p.id === id), ...data } },
    ativar: async (_id: string) => { await delay(400); return { success: true } },
    desativar: async (_id: string) => { await delay(400); return { success: true } },
  },

  catalogo: {
    list: async () => { await delay(350); return { data: mockCatalogo } },
    create: async (data: Partial<ProdutoCatalogo>) => { await delay(700); return { ...data, id: `cat-${Date.now()}`, ativo: true, criado_em: new Date().toISOString() } },
    update: async (id: string, data: Partial<ProdutoCatalogo>) => { await delay(500); return { ...mockCatalogo.find(p => p.id === id), ...data } },
  },

  produtos: {
    list: async (_eventoId: string) => { await delay(350); return { data: mockProdutos } },
    create: async (data: Partial<ProdutoEvento>) => { await delay(700); return { ...data, id: `pe-${Date.now()}`, ordem_exibicao: 10, estoque_baixo: false, bloqueado: false, ativo: true } },
    update: async (id: string, data: Partial<ProdutoEvento>) => { await delay(500); return { ...mockProdutos.find(p => p.id === id), ...data } },
    bloquear: async (_id: string, _motivo: string) => { await delay(400); return { success: true } },
    desbloquear: async (_id: string) => { await delay(400); return { success: true } },
    reporEstoque: async (_id: string, _op: string, _qty: number) => { await delay(500); return { estoque_anterior: 8, estoque_posterior: 58 } },
  },

  operadores: {
    list: async () => { await delay(350); return { data: mockOperadores } },
    create: async (data: Partial<Operador>) => { await delay(700); return { ...data, id: `op-${Date.now()}`, perfil: 'operador' as const, ativo: true, criado_em: new Date().toISOString() } },
    update: async (id: string, data: Partial<Operador>) => { await delay(500); return { ...mockOperadores.find(o => o.id === id), ...data } },
    desativar: async (_id: string) => { await delay(400); return { success: true } },
    reativar: async (_id: string) => { await delay(400); return { success: true } },
  },

  lotes: {
    list: async (_eventoId: string) => { await delay(350); return { data: mockLotes } },
    create: async (data: { nome?: string; quantidade: number }) => { await delay(1000); return { ...data, id: `lote-${Date.now()}`, padrao_codigo: 'aleatorio', pdf_disponivel: false, qrs_ativados: 0, percentual_ativado: 0, criado_em: new Date().toISOString() } },
  },

  qrCodes: {
    list: async (_eventoId: string) => { await delay(350); return { data: mockQRs } },
    buscar: async (_codigo: string) => { await delay(400); return mockQRs[0] },
    get: async (id: string) => { await delay(300); return mockQRs.find(q => q.id === id) || mockQRs[0] },
    transacoes: async (_id: string) => { await delay(400); return { data: mockTransacoes } },
    bloquear: async (_id: string, _motivo: string) => { await delay(500); return { success: true } },
    desbloquear: async (_id: string) => { await delay(400); return { success: true } },
    substituir: async (_id: string, _destino: string) => { await delay(800); return { success: true } },
  },

  dashboard: {
    snapshot: async (_eventoId: string) => {
      await delay(400)
      return {
        evento: mockEventos[0],
        metricas: mockDashboard,
        faturamento_por_pdv: mockFaturamentoPDV,
        ultimas_transacoes: mockTransacoes,
        atualizado_em: new Date().toISOString(),
      }
    },
  },

  relatorios: {
    consolidado: async (_eventoId: string) => {
      await delay(500)
      return {
        financeiro: {
          total_recargas_reais_centavos: 14523000,
          total_reembolsos_centavos: 423000,
          faturamento_liquido_centavos: 14100000,
          total_cortesias_centavos: 345000,
          saldo_residual_centavos: 1284000,
        },
        recargas: { qtd_total: 412, valor_total_centavos: 14523000, ticket_medio_centavos: 35250, por_forma_pagamento: [{ forma: 'pix', valor_centavos: 7845000, percentual: 54.0 }, { forma: 'cartao_credito', valor_centavos: 3218000, percentual: 22.2 }, { forma: 'cartao_debito', valor_centavos: 2214000, percentual: 15.2 }, { forma: 'dinheiro', valor_centavos: 1246000, percentual: 8.6 }] },
        vendas: { qtd_total: 1247, valor_total_centavos: 12855000, ticket_medio_centavos: 10309 },
        qr_codes: { emitidos: 1200, ativados: 429, bloqueados: 3, substituidos: 1, com_saldo_residual: 214 },
        operacional: { operadores_ativos: 8, pdvs_ativos: 4, transacoes_por_hora_media: 156, pico_transacoes_por_minuto: 73, pico_em: '2026-12-15T22:30:00Z' },
      }
    },
    saldoResidual: async (_eventoId: string) => {
      await delay(400)
      return {
        resumo: { total_residual_centavos: 1284000, qtd_qrs: 214, saldo_medio_centavos: 6000, maior_saldo_centavos: 15000 },
        data: [{ qr_id: 'qr-1', qr_codigo: 'QRPAG-A7K2', saldo_centavos: 5500, saldo_reembolsavel_centavos: 5500, prazo_limite: '2026-12-18T20:01:00Z', elegibilidade: 'elegivel' }, { qr_id: 'qr-4', qr_codigo: 'QRPAG-D4L5', saldo_centavos: 3200, saldo_reembolsavel_centavos: 0, prazo_limite: '2026-12-15T20:30:00Z', elegibilidade: 'expirado' }],
      }
    },
    reconciliacao: async (_eventoId: string) => {
      await delay(400)
      return {
        total_recargas_centavos: 14523000,
        total_vendas_centavos: 12855000,
        total_reembolsos_centavos: 423000,
        saldo_residual_centavos: 1284000,
        divergencia_centavos: 0,
        balanceado: true,
        conciliado_em: null,
        conciliado_por_nome: null,
      }
    },
  },
}
