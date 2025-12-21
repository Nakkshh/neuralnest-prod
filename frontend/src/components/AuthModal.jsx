import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';      // <-- NEW
import { useNavigate } from 'react-router-dom';  // <-- NEW

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);         // optional UX
  const [error, setError] = useState(null);              // optional UX

  const { login } = useAuth();       // from AuthContext
  const navigate = useNavigate();    // for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(
        `http://localhost:8080/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );

      if (!response.ok) {
        setError('Invalid credentials or server error');
        setLoading(false);
        return;
      }

      const data = await response.json();

      // IMPORTANT: adapt these keys to whatever your backend returns
      // Example assumes backend returns: { token: '...', email: '...' }
      if (data.token) {
        login(data.token, data.user);
        
        // close modal and go to dashboard
        onClose();
        navigate('/dashboard');
      } else {
        setError('No token returned from server');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach backend. Is it running on localhost:8080?');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 py-3 text-white"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-12 py-3 text-white"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-black font-bold py-3 rounded-xl hover:from-sky-400 disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : isLogin
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-slate-400">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sky-400 hover:text-sky-300 font-semibold"
          >
            {isLogin
              ? "Don't have account? Sign Up"
              : 'Have account? Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
