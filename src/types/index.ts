export type EventoStatus = 'rascunho' | 'ativo' | 'encerrado' | 'cancelado'
export type OperadorPerfil = 'super_admin' | 'admin_organizador' | 'operador'
export type PapelPainel = 'admin_principal' | 'admin' | 'operacional' | 'leitura'
export type OperadorFuncao = 'caixa' | 'vendas' | 'ambas'
export type PDVTipo = 'caixa' | 'venda' | 'misto'
export type QRStatus = 'disponivel' | 'ativo' | 'bloqueado' | 'substituido' | 'encerrado'
export type TransacaoTipo = 'recarga' | 'venda' | 'reembolso' | 'cortesia' | 'ajuste' | 'transferencia_saida' | 'transferencia_entrada' | 'estorno'
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'cortesia'
export type ModoLancamento = 'valor' | 'itens'

export interface Organizador {
  id: string
  nome: string
  nome_fantasia?: string
  cnpj_cpf: string
  email: string
  telefone?: string
  ativo: boolean
  motivo_bloqueio?: string
  taxa_servico_percentual: number
  criado_em: string
}

export interface Operador {
  id: string
  organizador_id?: string
  nome: string
  cpf?: string
  usuario: string
  email?: string
  perfil: OperadorPerfil
  papel_painel?: PapelPainel
  ativo: boolean
  ultimo_login?: string
  ultimo_acesso_app?: string
  criado_em: string
}

export interface Evento {
  id: string
  organizador_id: string
  nome: string
  descricao?: string
  local?: string
  imagem_capa_url?: string
  data_inicio: string
  data_fim: string
  status: EventoStatus
  permite_reembolso: boolean
  prazo_reembolso_horas?: number
  permite_cortesia: boolean
  limite_cortesia_centavos?: number
  permite_transferencia: boolean
  controla_estoque: boolean
  taxa_servico_percentual: number
  criado_em: string
}

export interface PontoVenda {
  id: string
  evento_id: string
  nome: string
  tipo: PDVTipo
  localizacao_interna?: string
  ativo: boolean
  criado_em: string
}

export interface ProdutoCatalogo {
  id: string
  organizador_id: string
  nome: string
  descricao?: string
  foto_url?: string
  preco_padrao_centavos: number
  categoria?: string
  ativo: boolean
  criado_em: string
}

export interface ProdutoEvento {
  id: string
  evento_id: string
  produto_catalogo_id?: string
  nome: string
  descricao?: string
  foto_url?: string
  preco_centavos: number
  categoria?: string
  ordem_exibicao: number
  controla_estoque: boolean
  estoque_atual?: number
  estoque_inicial?: number
  estoque_baixo: boolean
  bloqueado: boolean
  motivo_bloqueio?: string
  ativo: boolean
}

export interface Alocacao {
  id: string
  operador_id: string
  operador_nome: string
  evento_id: string
  ponto_venda_id: string
  pdv_nome: string
  funcao: OperadorFuncao
  ativo: boolean
}

export interface LoteQR {
  id: string
  evento_id: string
  nome?: string
  quantidade: number
  padrao_codigo: string
  arquivo_pdf_url?: string
  pdf_disponivel: boolean
  qrs_ativados: number
  percentual_ativado: number
  criado_em: string
}

export interface QRCode {
  id: string
  evento_id: string
  lote_id?: string
  codigo: string
  saldo_centavos: number
  cortesia_acumulada_centavos: number
  status: QRStatus
  qr_substituto_id?: string
  motivo_bloqueio?: string
  ativado_em?: string
  criado_em: string
  total_recarregado_centavos?: number
  total_gasto_centavos?: number
  total_reembolsado_centavos?: number
  saldo_reembolsavel_centavos?: number
}

export interface Transacao {
  id: string
  evento_id: string
  qr_code_id: string
  qr_codigo: string
  ponto_venda_id?: string
  pdv_nome?: string
  operador_id?: string
  operador_nome?: string
  tipo: TransacaoTipo
  modo_lancamento?: ModoLancamento
  valor_centavos: number
  saldo_anterior_centavos: number
  saldo_posterior_centavos: number
  forma_pagamento?: FormaPagamento
  observacao?: string
  criado_em: string
}

export interface DashboardMetricas {
  faturamento_total_centavos: number
  faturamento_variacao_hora_centavos: number
  ticket_medio_centavos: number
  saldo_em_circulacao_centavos: number
  saldo_tendencia: 'subindo' | 'caindo' | 'estavel'
  qrs_ativos: number
  qrs_emitidos: number
  operadores_online: number
  transacoes_por_minuto: number
}

export interface PDVFaturamento {
  pdv_id: string
  nome: string
  tipo: PDVTipo
  valor_centavos: number
  percentual: number
  qtd_transacoes: number
  inativo_minutos: number
}

export interface User {
  id: string
  nome: string
  usuario: string
  perfil: OperadorPerfil
  papel_painel?: PapelPainel
  organizador_id?: string
  organizador_nome?: string
}

export interface Pagination {
  page: number
  per_page: number
  total_items: number
  total_pages: number
}

export interface ApiResponse<T> {
  data: T
  pagination?: Pagination
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}
