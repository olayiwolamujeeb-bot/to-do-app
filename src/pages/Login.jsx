import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaCheckCircle, FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            
            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            let matchedUser = users.find(
                u => u.email.toLowerCase() === email.toLowerCase()
            )

            // If the user doesn't exist yet, register them on the fly!
            if (!matchedUser) {
                const parts = email.split('@')
                const nameFromEmail = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
                matchedUser = {
                    fullName: nameFromEmail || 'Demo User',
                    email: email.toLowerCase(),
                    password: password
                }
                users.push(matchedUser)
                localStorage.setItem('users', JSON.stringify(users))
            }

            localStorage.setItem('user', JSON.stringify({ email: matchedUser.email, fullName: matchedUser.fullName }))
            navigate('/dashboard')
        }, 1200)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
            {/* Visual background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative z-10 m-4"
            >
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 text-2xl font-bold"
                    >
                        ✓
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 text-sm">Sign in to your productivity hub</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl mb-6 flex flex-col gap-1"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-ping"></span>
                            <span className="font-semibold text-red-300">Authentication Error</span>
                        </div>
                        <p className="text-xs text-red-300/80 mt-1">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-slate-300 font-medium text-sm mb-1.5 ml-1">
                            Email Address
                        </label>
                        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-900/30 transition-all duration-300">
                            <FaEnvelope className="text-slate-500 mr-3 text-sm" />
                            <input
                                type="email"
                                id="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="outline-none flex-1 bg-transparent text-slate-200 placeholder-slate-600 disabled:opacity-60 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-slate-300 font-medium text-sm mb-1.5 ml-1">
                            Password
                        </label>
                        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-900/30 transition-all duration-300">
                            <FaLock className="text-slate-500 mr-3 text-sm" />
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="outline-none flex-1 bg-transparent text-slate-200 placeholder-slate-600 disabled:opacity-60 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-2 px-1">
                        <label className="flex items-center text-slate-400 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                                className="w-4 h-4 mr-2 bg-slate-950 border border-slate-800 rounded accent-indigo-600 cursor-pointer"
                            />
                            Remember me
                        </label>
                        <a href="#forgot-password" className="text-indigo-400 hover:text-indigo-300 transition-all font-semibold">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className="text-sm" /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-400 text-sm border-t border-slate-800/60 pt-6">
                    <p>Don't have an account? <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-all">Sign up here <FaChevronRight className="inline text-[10px] ml-0.5" /></Link></p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
