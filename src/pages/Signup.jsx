import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaCheckCircle, FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'

function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            
            // Multi-user persistence logic
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                setError('This email is already registered')
                return
            }

            const newUser = {
                fullName,
                email: email.toLowerCase(),
                password // Note: In a production app, we would hash this. For local simulation, plain text is fine.
            }
            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))
            
            // Set current session
            localStorage.setItem('user', JSON.stringify({ email: newUser.email, fullName: newUser.fullName }))
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
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 mt-2 text-sm">Join to organize and streamline your productivity</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl mb-6 flex items-center gap-3"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-ping"></span>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-slate-300 font-medium text-sm mb-1.5 ml-1">
                            Full Name
                        </label>
                        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-900/30 transition-all duration-300">
                            <FaUser className="text-slate-500 mr-3 text-sm" />
                            <input
                                type="text"
                                id="fullName"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={isLoading}
                                className="outline-none flex-1 bg-transparent text-slate-200 placeholder-slate-600 disabled:opacity-60 text-sm"
                            />
                        </div>
                    </div>

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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-slate-300 font-medium text-sm mb-1.5 ml-1">
                            Confirm Password
                        </label>
                        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-900/30 transition-all duration-300">
                            <FaLock className="text-slate-500 mr-3 text-sm" />
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                className="outline-none flex-1 bg-transparent text-slate-200 placeholder-slate-600 disabled:opacity-60 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Creating account...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle className="text-sm" /> Sign Up
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    <p>Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-all">Sign in here <FaChevronRight className="inline text-[10px] ml-0.5" /></Link></p>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
