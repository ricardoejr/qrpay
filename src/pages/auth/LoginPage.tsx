import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { api } from '../../api'
import { Button, Input } from '../../components/ui'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ usuario: '', senha: '' })
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.usuario || !form.senha) { setError('Preencha todos os campos'); return }
    setLoading(true)
    setError('')
    try {
      const { user, access_token } = await api.auth.login(form.usuario, form.senha)
      login(user, access_token)
      navigate('/eventos')
    } catch {
      setError('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-brand-50/30 to-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" fill="white" />
              <rect x="3" y="13" width="8" height="8" rx="1" fill="white" fillOpacity=".6" />
              <rect x="13" y="3" width="8" height="8" rx="1" fill="white" fillOpacity=".6" />
              <rect x="13" y="13" width="8" height="8" rx="1" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            qr<span className="text-brand-500">pag</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Painel do organizador</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Usuário ou email"
              type="text"
              placeholder="seu.usuario"
              value={form.usuario}
              onChange={e => setForm(p => ({ ...p, usuario: e.target.value }))}
              autoComplete="username"
              autoFocus
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-600">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 pr-10 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-brand-500" />
                Continuar conectado
              </label>
              <button type="button" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Esqueci a senha
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" size="lg" loading={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Acesso restrito a organizadores cadastrados · <span className="text-brand-500">qrpag.com.br</span>
        </p>

        <div className="mt-4 p-3 bg-zinc-100 rounded-lg text-xs text-zinc-500 text-center">
          <strong>Demo:</strong> usuário <code className="font-mono">joaoadmin</code>, senha qualquer
        </div>
      </div>
    </div>
  )
}
