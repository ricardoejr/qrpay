export function formatCurrency(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatTime(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin}min`
  if (diffHour < 24) return `há ${diffHour}h`
  if (diffDay < 7) return `há ${diffDay}d`
  return formatDate(dateStr)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function getInitials(nome: string): string {
  return nome
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const EVENTO_STATUS_LABEL: Record<string, string> = {
  rascunho: 'Rascunho',
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  cancelado: 'Cancelado',
}

export const PDV_TIPO_LABEL: Record<string, string> = {
  caixa: 'Caixa',
  venda: 'Venda',
  misto: 'Misto',
}

export const FUNCAO_LABEL: Record<string, string> = {
  caixa: 'Caixa',
  vendas: 'Vendas',
  ambas: 'Ambas',
}

export const TRANSACAO_TIPO_LABEL: Record<string, string> = {
  recarga: 'Recarga',
  venda: 'Venda',
  reembolso: 'Reembolso',
  cortesia: 'Cortesia',
  ajuste: 'Ajuste',
  transferencia_saida: 'Transf. Saída',
  transferencia_entrada: 'Transf. Entrada',
  estorno: 'Estorno',
}

export const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  cortesia: 'Cortesia',
}

export const QR_STATUS_LABEL: Record<string, string> = {
  disponivel: 'Disponível',
  ativo: 'Ativo',
  bloqueado: 'Bloqueado',
  substituido: 'Substituído',
  encerrado: 'Encerrado',
}

export const PAPEL_LABEL: Record<string, string> = {
  admin_principal: 'Admin Principal',
  admin: 'Admin',
  operacional: 'Operacional',
  leitura: 'Leitura',
}
