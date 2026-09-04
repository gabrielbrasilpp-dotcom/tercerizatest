import React, { useState } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const endpoint = isLogin ? 'http://localhost:3000/auth/login' : 'http://localhost:3000/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Sucesso!');
      } else {
        setMessage(data.error || 'Ocorreu um erro.');
      }
    } catch (err) {
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        
        {message && (
          <div className="mb-4 p-3 rounded bg-black/40 border border-white/10 text-center text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-purple-400"
                placeholder="Seu nome completo"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-purple-400"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-purple-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-semibold shadow-lg shadow-purple-600/30"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:underline font-medium ml-1"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
}
