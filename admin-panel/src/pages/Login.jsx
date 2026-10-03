import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LockKeyhole, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [splash, setSplash] = useState(false);
  const [splashSuccess, setSplashSuccess] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setSplash(true);
    setSplashSuccess(false);

    // Safety timeout - if login takes more than 15s, fail
    const timeoutId = setTimeout(() => {
      setError("Request timed out. Please check your connection and try again.");
      setLoading(false);
      setSplash(false);
    }, 15000);

    try {
      console.log("🔵 Attempting login...");
      const response = await api.post("/auth/login", form);
      console.log("✅ Login response:", response.data);

      const { access_token, refresh_token, user: userFromLogin } = response.data;

      if (!access_token) {
        throw new Error("No access token received from server");
      }

      // Try to get user data - first from login response, then from /auth/me
      let user = userFromLogin;

      if (!user) {
        console.log("🔵 Fetching user data from /auth/me...");
        const userResponse = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        user = userResponse.data;
        console.log("✅ User data:", user);
      }

      // Check admin status (handle both is_admin and isAdmin)
      const isAdmin = user?.is_admin === true || user?.isAdmin === true;
      
      if (!isAdmin) {
        clearTimeout(timeoutId);
        setError("Admin access is required.");
        setLoading(false);
        setSplash(false);
        return;
      }

      login(access_token, refresh_token, user);
      setSplashSuccess(true);

      clearTimeout(timeoutId);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1400);

    } catch (err) {
      clearTimeout(timeoutId);
      console.error("❌ Login error:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error message:", err.message);

      let errorMsg = "Invalid email or password.";
      
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        errorMsg = "Request timed out. Please try again.";
      } else if (err.message === "Network Error" || !err.response) {
        errorMsg = "Cannot connect to server. Check your internet or backend URL.";
      } else if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === "string" 
          ? err.response.data.detail 
          : "Invalid credentials.";
      } else if (err.response?.status === 401) {
        errorMsg = "Invalid email or password.";
      } else if (err.response?.status === 403) {
        errorMsg = "Access forbidden. Admin only.";
      } else if (err.response?.status >= 500) {
        errorMsg = "Server error. Please try again later.";
      }

      setError(errorMsg);
      setLoading(false);
      setSplash(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden bg-[#050510]">

      {/* ==================== MOVING COLOR BACKGROUND ==================== */}
      <style>{`
        @keyframes flow1 {
          0%   { transform: translate(-20%, -20%) scale(1); }
          25%  { transform: translate(60%, -10%) scale(1.2); }
          50%  { transform: translate(40%, 60%) scale(0.9); }
          75%  { transform: translate(-10%, 50%) scale(1.1); }
          100% { transform: translate(-20%, -20%) scale(1); }
        }
        @keyframes flow2 {
          0%   { transform: translate(80%, 80%) scale(1); }
          25%  { transform: translate(10%, 60%) scale(1.15); }
          50%  { transform: translate(-20%, 20%) scale(0.95); }
          75%  { transform: translate(40%, -10%) scale(1.1); }
          100% { transform: translate(80%, 80%) scale(1); }
        }
        @keyframes flow3 {
          0%   { transform: translate(50%, -30%) scale(1); }
          33%  { transform: translate(-20%, 30%) scale(1.25); }
          66%  { transform: translate(70%, 20%) scale(0.85); }
          100% { transform: translate(50%, -30%) scale(1); }
        }
        @keyframes flow4 {
          0%   { transform: translate(-30%, 70%) scale(1); }
          33%  { transform: translate(50%, 40%) scale(1.1); }
          66%  { transform: translate(20%, -20%) scale(0.9); }
          100% { transform: translate(-30%, 70%) scale(1); }
        }
        @keyframes flow5 {
          0%   { transform: translate(30%, 30%) scale(1); }
          50%  { transform: translate(-40%, -30%) scale(1.3); }
          100% { transform: translate(30%, 30%) scale(1); }
        }
        @keyframes hueShift {
          0%   { filter: blur(140px) hue-rotate(0deg); }
          50%  { filter: blur(140px) hue-rotate(180deg); }
          100% { filter: blur(140px) hue-rotate(360deg); }
        }
        @keyframes hueShiftReverse {
          0%   { filter: blur(140px) hue-rotate(360deg); }
          50%  { filter: blur(140px) hue-rotate(180deg); }
          100% { filter: blur(140px) hue-rotate(0deg); }
        }
        @keyframes hueShiftSlow {
          0%   { filter: blur(150px) hue-rotate(0deg); }
          100% { filter: blur(150px) hue-rotate(360deg); }
        }
        .orb-1 { animation: flow1 18s ease-in-out infinite, hueShift 12s linear infinite; }
        .orb-2 { animation: flow2 22s ease-in-out infinite, hueShiftReverse 15s linear infinite; }
        .orb-3 { animation: flow3 20s ease-in-out infinite, hueShift 18s linear infinite; }
        .orb-4 { animation: flow4 25s ease-in-out infinite, hueShiftReverse 20s linear infinite; }
        .orb-5 { animation: flow5 16s ease-in-out infinite, hueShiftSlow 25s linear infinite; }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .grain-overlay { animation: grain 8s steps(10) infinite; }
        @keyframes splashRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .splash-ring { animation: splashRing 1s linear infinite; }
        @keyframes splashCheck {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-45deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .splash-check { animation: splashCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes splashFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(40px); }
        }
        .splash-enter { animation: splashFadeIn 0.5s ease-out forwards; }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full bg-blue-600/50 orb-1" />
        <div className="absolute bottom-0 right-0 w-[65%] h-[65%] rounded-full bg-indigo-600/45 orb-2" />
        <div className="absolute top-[20%] right-0 w-[55%] h-[55%] rounded-full bg-purple-600/40 orb-3" />
        <div className="absolute bottom-[10%] left-0 w-[55%] h-[55%] rounded-full bg-cyan-500/35 orb-4" />
        <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full bg-pink-500/25 orb-5" />
      </div>

      <div 
        className="absolute inset-0 opacity-[0.04] grain-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

      {/* ==================== LOGIN FORM ==================== */}
      <div className={`w-full max-w-[420px] relative z-10 transition-all duration-700 ${
        splash ? 'opacity-0 scale-95 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'
      }`}>
        
        <div className="bg-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_60px_rgb(0,0,0,0.5)] border border-white/10 overflow-hidden">
          
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-lg mb-5">
              <ShieldCheck size={30} className="text-white" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Admin Panel
            </h1>
            <p className="mt-2 text-sm text-white/50 font-medium tracking-tight">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300 font-medium flex items-center gap-2 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.1] focus:border-white/30 focus:ring-4 focus:ring-white/5 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-[15px] text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.1] focus:border-white/30 focus:ring-4 focus:ring-white/5 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-white text-slate-900 px-4 py-4 text-[15px] font-semibold shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/90 hover:shadow-white/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2 mt-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-slate-900/10 to-transparent" />
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] font-medium text-white/30 mt-6 tracking-wide uppercase">
          Secure Portfolio CMS Administration
        </p>
      </div>

      {/* ==================== FULL-PAGE SPLASH SCREEN ==================== */}
      {splash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center splash-enter bg-[#050510]/80 backdrop-blur-3xl">
          
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${
            splashSuccess ? 'bg-green-500/30' : 'bg-blue-500/30'
          } pulse-glow`} />

          <div className="relative z-10 flex flex-col items-center">
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              {!splashSuccess ? (
                <>
                  <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-white splash-ring" />
                  <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-t-white/40 splash-ring" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                  
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <ShieldCheck size={26} className="text-white" strokeWidth={1.5} />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-[3px] border-green-400/30" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-green-400" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle2 size={28} className="text-white splash-check" strokeWidth={2.5} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 text-center">
              <h2 className={`text-xl font-semibold tracking-tight transition-colors duration-500 ${
                splashSuccess ? 'text-green-400' : 'text-white'
              }`}>
                {splashSuccess ? 'Welcome back!' : 'Signing in...'}
              </h2>
              <p className="mt-2 text-sm text-white/40 font-medium">
                {splashSuccess ? 'Redirecting to dashboard' : 'Verifying your credentials'}
              </p>

              {!splashSuccess && (
                <div className="flex items-center justify-center gap-1.5 mt-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              <div className="mt-6 w-48 h-1 rounded-full bg-white/10 overflow-hidden mx-auto">
                <div 
                  className={`h-full rounded-full transition-all duration-[1400ms] ease-out ${
                    splashSuccess ? 'bg-green-400' : 'bg-white/60'
                  }`}
                  style={{
                    width: splashSuccess ? '100%' : '66%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}