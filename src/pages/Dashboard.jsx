import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaSignOutAlt, FaPlus, FaTrash, FaCheck, FaSearch, FaMoon, FaSun, 
  FaCalendarAlt, FaTags, FaList, FaStar, FaTimes, FaBars, FaEdit, 
  FaCheckCircle, FaRegCircle, FaChevronRight, FaFilter, FaSortAmountDown,
  FaFolder, FaClock, FaExclamationCircle, FaUserCircle, FaInfoCircle, FaInbox
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

function Dashboard() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{"email":"User","fullName":"Member"}')

    // Initial tasks configuration (loaded if local storage is empty)
    const getInitialTasks = () => {
        const stored = localStorage.getItem(`tasks_${user.email}`)
        if (stored) return JSON.parse(stored)
        
        // Default seed tasks for outstanding premium UX on first load
        return [
            {
                id: 1,
                text: "Welcome to your Productivity Workspace! 🎯",
                description: "Click on this task to view its details on the right panel. You can add notes, add subtasks, change priorities, and edit due dates.",
                completed: false,
                priority: "high",
                category: "Personal",
                dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days out
                subtasks: [
                    { id: 101, text: "Check off a subtask", completed: true },
                    { id: 102, text: "Create a new custom task", completed: false },
                    { id: 103, text: "Try toggling Dark Mode in the bottom left", completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                text: "Schedule project sprint kickoff meeting",
                description: "Invite core stakeholders, prepare agenda slides, and check room availability.",
                completed: true,
                priority: "medium",
                category: "Work",
                dueDate: new Date().toISOString().split('T')[0], // Today
                subtasks: [
                    { id: 201, text: "Send calendar invite", completed: true },
                    { id: 202, text: "Draft meeting outline agenda", completed: true }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                text: "Weekly cardio and endurance session",
                description: "5km outdoor trail run. Target heart rate is 140-155 bpm.",
                completed: false,
                priority: "low",
                category: "Fitness",
                dueDate: "",
                subtasks: [],
                createdAt: new Date().toISOString()
            }
        ]
    }

    // State Declarations
    const [tasks, setTasks] = useState(getInitialTasks)
    const [taskInput, setTaskInput] = useState('')
    const [taskCategory, setTaskCategory] = useState('Work')
    const [taskPriority, setTaskPriority] = useState('medium')
    const [taskDueDate, setTaskDueDate] = useState('')
    
    // Sidebar, filters and sorting
    const [activeCategory, setActiveCategory] = useState('All')
    const [quickFilter, setQuickFilter] = useState('All') // 'All', 'Today', 'Upcoming', 'High Priority', 'Overdue'
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('dueDate') // 'dueDate', 'priority', 'created', 'alphabetical'
    const [statusFilter, setStatusFilter] = useState('All') // 'All', 'Active', 'Completed'
    
    // Detail drawer & responsiveness
    const [selectedTask, setSelectedTask] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [newSubtaskText, setNewSubtaskText] = useState('')
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    })

    // Categories list
    const categories = ['Work', 'Personal', 'Fitness', 'Shopping', 'Health']

    // Sync theme settings with DOM
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode])

    // Save tasks to user-scoped storage
    useEffect(() => {
        if (user.email) {
            localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks))
        }
    }, [tasks, user.email])

    // Keep selected task in drawer synced with list changes
    useEffect(() => {
        if (selectedTask) {
            const current = tasks.find(t => t.id === selectedTask.id)
            if (current) {
                setSelectedTask(current)
            } else {
                setSelectedTask(null)
            }
        }
    }, [tasks])

    // Handlers
    const addTask = (e) => {
        e.preventDefault()
        if (!taskInput.trim()) return

        const newTask = {
            id: Date.now(),
            text: taskInput.trim(),
            description: '',
            completed: false,
            priority: taskPriority,
            category: taskCategory,
            dueDate: taskDueDate,
            subtasks: [],
            createdAt: new Date().toISOString()
        }

        setTasks([newTask, ...tasks])
        setTaskInput('')
        setTaskDueDate('')
    }

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id))
        if (selectedTask && selectedTask.id === id) {
            setSelectedTask(null)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    // Detail drawer inline modifiers
    const updateSelectedTask = (fields) => {
        setTasks(prev => prev.map(t => 
            t.id === selectedTask.id ? { ...t, ...fields } : t
        ))
    }

    const addSubtask = (e) => {
        e.preventDefault()
        if (!newSubtaskText.trim() || !selectedTask) return

        const newSub = {
            id: Date.now(),
            text: newSubtaskText.trim(),
            completed: false
        }

        updateSelectedTask({
            subtasks: [...selectedTask.subtasks, newSub]
        })
        setNewSubtaskText('')
    }

    const toggleSubtask = (subId) => {
        if (!selectedTask) return
        const updatedSubs = selectedTask.subtasks.map(sub => 
            sub.id === subId ? { ...sub, completed: !sub.completed } : sub
        )
        updateSelectedTask({ subtasks: updatedSubs })
    }

    const deleteSubtask = (subId) => {
        if (!selectedTask) return
        const updatedSubs = selectedTask.subtasks.filter(sub => sub.id !== subId)
        updateSelectedTask({ subtasks: updatedSubs })
    }

    // Computations & Metrics
    const todayStr = new Date().toISOString().split('T')[0]
    
    // Quick filters logic
    const filteredTasks = tasks.filter(task => {
        // Category filter
        if (activeCategory !== 'All' && task.category !== activeCategory) return false

        // Quick filters (Today, Upcoming, High Priority, Overdue)
        if (quickFilter === 'Today') {
            if (task.dueDate !== todayStr) return false
        } else if (quickFilter === 'Upcoming') {
            if (!task.dueDate || task.dueDate <= todayStr) return false
        } else if (quickFilter === 'High Priority') {
            if (task.priority !== 'high') return false
        } else if (quickFilter === 'Overdue') {
            if (!task.dueDate || task.dueDate >= todayStr || task.completed) return false
        }

        // Completion Status Filter
        if (statusFilter === 'Active' && task.completed) return false
        if (statusFilter === 'Completed' && !task.completed) return false

        // Search text matching
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase()
            const matchTitle = task.text.toLowerCase().includes(q)
            const matchDesc = task.description?.toLowerCase().includes(q)
            if (!matchTitle && !matchDesc) return false
        }

        return true
    })

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'dueDate') {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return a.dueDate.localeCompare(b.dueDate)
        }
        if (sortBy === 'priority') {
            const pMap = { high: 3, medium: 2, low: 1 }
            return pMap[b.priority] - pMap[a.priority]
        }
        if (sortBy === 'created') {
            return b.createdAt.localeCompare(a.createdAt)
        }
        if (sortBy === 'alphabetical') {
            return a.text.localeCompare(b.text)
        }
        return 0
    })

    // Stats calculations
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasksCount = tasks.filter(t => t.completed).length
    const totalCount = tasks.length
    const completionRate = totalCount > 0 ? Math.round((completedTasksCount / totalCount) * 100) : 0
    
    const overdueCount = tasks.filter(t => t.dueDate && t.dueDate < todayStr && !t.completed).length
    const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length

    // Category colors dictionary
    const catColors = {
        Work: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
        Personal: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25',
        Fitness: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
        Shopping: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
        Health: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
        Default: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25'
    }

    const getCatColor = (cat) => catColors[cat] || catColors.Default

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
            
            {/* 1. SIDEBAR */}
            <aside 
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300 md:relative md:transform-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden md:flex md:w-0'
                }`}
            >
                <div>
                    {/* Brand Logo */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                                ✓
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Workspace
                            </span>
                        </div>
                        {/* Mobile sidebar close */}
                        <button 
                            onClick={() => setSidebarOpen(false)} 
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Logged in User Profile Info */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                            {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{user.fullName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Filter views (Inbox, Today, etc) */}
                    <nav className="p-4 space-y-1">
                        <p className="px-3 py-1.5 text-xxs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Views</p>
                        
                        <button 
                            onClick={() => { setQuickFilter('All'); setActiveCategory('All'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                quickFilter === 'All' && activeCategory === 'All'
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaInbox className="text-base opacity-85" />
                                <span>All Tasks</span>
                            </div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium text-slate-500 dark:text-slate-400">
                                {tasks.length}
                            </span>
                        </button>

                        <button 
                            onClick={() => { setQuickFilter('Today'); setActiveCategory('All'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                quickFilter === 'Today' && activeCategory === 'All'
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-base opacity-85" />
                                <span>Today</span>
                            </div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium text-slate-500 dark:text-slate-400">
                                {tasks.filter(t => t.dueDate === todayStr).length}
                            </span>
                        </button>

                        <button 
                            onClick={() => { setQuickFilter('Upcoming'); setActiveCategory('All'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                quickFilter === 'Upcoming' && activeCategory === 'All'
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaClock className="text-base opacity-85" />
                                <span>Upcoming</span>
                            </div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium text-slate-500 dark:text-slate-400">
                                {tasks.filter(t => t.dueDate && t.dueDate > todayStr).length}
                            </span>
                        </button>

                        <button 
                            onClick={() => { setQuickFilter('High Priority'); setActiveCategory('All'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                quickFilter === 'High Priority' && activeCategory === 'All'
                                ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaStar className="text-base opacity-85" />
                                <span>High Priority</span>
                            </div>
                            <span className="text-xs bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-semibold">
                                {highPriorityCount}
                            </span>
                        </button>

                        <button 
                            onClick={() => { setQuickFilter('Overdue'); setActiveCategory('All'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                quickFilter === 'Overdue' && activeCategory === 'All'
                                ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaExclamationCircle className="text-base opacity-85" />
                                <span>Overdue</span>
                            </div>
                            <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-semibold">
                                {overdueCount}
                            </span>
                        </button>
                    </nav>

                    {/* Category List */}
                    <div className="p-4 space-y-1">
                        <p className="px-3 py-1.5 text-xxs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Categories</p>
                        {categories.map(cat => {
                            const count = tasks.filter(t => t.category === cat && !t.completed).length
                            const isActive = activeCategory === cat && quickFilter === 'All'
                            return (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setQuickFilter('All'); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                        isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${
                                            cat === 'Work' ? 'bg-blue-500' :
                                            cat === 'Personal' ? 'bg-purple-500' :
                                            cat === 'Fitness' ? 'bg-emerald-500' :
                                            cat === 'Shopping' ? 'bg-amber-500' :
                                            cat === 'Health' ? 'bg-rose-500' : 'bg-slate-400'
                                        }`} />
                                        <span>{cat}</span>
                                    </div>
                                    {count > 0 && (
                                        <span className="text-xxs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium text-slate-500 dark:text-slate-400">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar Bottom Controls */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-all duration-200"
                    >
                        {darkMode ? <><FaSun className="text-amber-400 animate-spin-slow" /> Light Theme</> : <><FaMoon className="text-indigo-500" /> Dark Theme</>}
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl transition-all duration-200"
                    >
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile menu drawer */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs md:hidden"
                />
            )}

            {/* 2. MAIN APP WORKSPACE */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Upper Navbar (Collapsible Toggle) */}
                <header className="sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-30 px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                            title="Toggle Sidebar"
                        >
                            <FaBars />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                {activeCategory === 'All' ? `${quickFilter} Tasks` : `${activeCategory} Category`}
                            </h2>
                            <p className="text-xs text-slate-400 hidden sm:block">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Dashboard Inner Container */}
                <div className="max-w-5xl w-full mx-auto px-6 py-8 space-y-8 flex-1">
                    
                    {/* STATS OVERVIEW CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Circle Progress Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Progress Rate</p>
                                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{completionRate}%</h3>
                                <p className="text-xs text-slate-500 mt-1">{completedTasksCount} of {totalCount} completed</p>
                            </div>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                                    <circle cx="32" cy="32" r="28" className="stroke-indigo-600 dark:stroke-indigo-500 fill-none transition-all duration-500" strokeWidth="6"
                                        strokeDasharray={2 * Math.PI * 28}
                                        strokeDashoffset={2 * Math.PI * 28 * (1 - completionRate / 100)}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-300">{completionRate}%</span>
                            </div>
                        </div>

                        {/* Pending Tasks */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Tasks</p>
                                    <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{activeTasks.length}</h3>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">
                                    <FaList />
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Focused & ready to resolve
                            </div>
                        </div>

                        {/* High Priority Tasks */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">High Priority</p>
                                    <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{highPriorityCount}</h3>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">
                                    <FaStar />
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Require immediate action
                            </div>
                        </div>

                        {/* Overdue Tasks */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Overdue</p>
                                    <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">{overdueCount}</h3>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-sm">
                                    <FaExclamationCircle />
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-red-500/80 dark:text-red-400/80 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                Passed scheduled deadlines
                            </div>
                        </div>
                    </div>

                    {/* ADD TASK BOX CONTAINER */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200">Create New Workspace Task</h3>
                        
                        <form onSubmit={addTask} className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    placeholder="Task summary details..."
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 hover:scale-101 transition-all duration-300 flex items-center gap-2 whitespace-nowrap text-sm"
                                >
                                    <FaPlus className="text-xs" /> Add Task
                                </button>
                            </div>

                            {/* Task Inline Settings */}
                            <div className="flex flex-wrap gap-4 items-center justify-between pt-1">
                                <div className="flex flex-wrap gap-3 items-center">
                                    
                                    {/* Category Select */}
                                    <div className="flex items-center gap-1.5">
                                        <FaTags className="text-xs text-slate-400" />
                                        <select
                                            value={taskCategory}
                                            onChange={(e) => setTaskCategory(e.target.value)}
                                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Priority Select */}
                                    <div className="flex items-center gap-1.5">
                                        <FaStar className="text-xs text-slate-400" />
                                        <select
                                            value={taskPriority}
                                            onChange={(e) => setTaskPriority(e.target.value)}
                                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">High Priority</option>
                                        </select>
                                    </div>

                                    {/* Due Date Select */}
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-xs text-slate-400" />
                                        <input
                                            type="date"
                                            value={taskDueDate}
                                            onChange={(e) => setTaskDueDate(e.target.value)}
                                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* SEARCH, SORT, AND FILTER CONTROLS */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaSearch className="text-slate-400 text-xs" />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search workspace..."
                                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Status Badges and Sort */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                            
                            {/* Filter Status Badges */}
                            <div className="bg-slate-100/80 dark:bg-slate-900/80 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex text-xs">
                                {['All', 'Active', 'Completed'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1 rounded-lg font-medium transition-all ${
                                            statusFilter === status
                                            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Selector */}
                            <div className="flex items-center gap-2">
                                <FaSortAmountDown className="text-xs text-slate-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="dueDate">Due Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="created">Created Date</option>
                                    <option value="alphabetical">Alphabetical</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TASKS LIST */}
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {sortedTasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
                                >
                                    <FaInbox className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found matching your configuration.</p>
                                    <p className="text-xs text-slate-400 mt-1">Try resetting your category views, status filters, or search queries.</p>
                                </motion.div>
                            ) : (
                                sortedTasks.map((task) => {
                                    // Count subtasks completed
                                    const totalSubs = task.subtasks?.length || 0
                                    const completedSubs = task.subtasks?.filter(s => s.completed).length || 0
                                    const subtasksPercent = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0
                                    const hasOverdue = task.dueDate && task.dueDate < todayStr && !task.completed

                                    return (
                                        <motion.div
                                            key={task.id}
                                            layoutId={`task-card-${task.id}`}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.25 }}
                                            className={`group relative flex items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border ${
                                                task.completed 
                                                ? 'border-slate-100 dark:border-slate-800/40 opacity-70' 
                                                : hasOverdue 
                                                  ? 'border-red-500/30 bg-red-50/5' 
                                                  : 'border-slate-200/60 dark:border-slate-800/60'
                                            } rounded-2xl shadow-xxs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200`}
                                        >
                                            
                                            {/* Checklist & Content Link */}
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                
                                                {/* Custom Animated Checkbox */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTask(task.id)}
                                                    className="flex-shrink-0 focus:outline-none"
                                                >
                                                    {task.completed ? (
                                                        <FaCheckCircle className="text-indigo-600 dark:text-indigo-400 text-2xl transition-all scale-105" />
                                                    ) : (
                                                        <FaRegCircle className="text-slate-300 dark:text-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400 text-2xl transition-all" />
                                                    )}
                                                </button>

                                                {/* Title & metadata clickable link */}
                                                <div 
                                                    onClick={() => setSelectedTask(task)} 
                                                    className="flex-1 cursor-pointer min-w-0"
                                                >
                                                    <h4 className={`font-semibold text-sm truncate leading-snug ${
                                                        task.completed 
                                                        ? 'line-through text-slate-400 dark:text-slate-500' 
                                                        : 'text-slate-800 dark:text-slate-100'
                                                    }`}>
                                                        {task.text}
                                                    </h4>

                                                    {/* Badges metadata list */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        
                                                        {/* Category badge */}
                                                        <span className={`px-2 py-0.5 rounded-lg border text-xxs font-medium ${getCatColor(task.category)}`}>
                                                            {task.category}
                                                        </span>

                                                        {/* Priority badge */}
                                                        <span className={`px-2 py-0.5 rounded-lg border text-xxs font-semibold uppercase tracking-wider ${
                                                            task.priority === 'high' 
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                                                            : task.priority === 'medium'
                                                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                        }`}>
                                                            {task.priority}
                                                        </span>

                                                        {/* Due Date badge */}
                                                        {task.dueDate && (
                                                            <span className={`px-2 py-0.5 rounded-lg border text-xxs font-medium flex items-center gap-1 ${
                                                                hasOverdue 
                                                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25 font-semibold' 
                                                                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200/40'
                                                            }`}>
                                                                <FaClock className="text-[10px]" />
                                                                {hasOverdue ? 'Overdue: ' : ''}
                                                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}

                                                        {/* Subtask stats badge */}
                                                        {totalSubs > 0 && (
                                                            <span className="px-2 py-0.5 rounded-lg border border-slate-200/40 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xxs font-semibold">
                                                                {completedSubs}/{totalSubs} subtasks ({subtasksPercent}%)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Control Panel */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedTask(task)}
                                                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-all duration-200"
                                                    title="Edit details"
                                                >
                                                    <FaEdit className="text-xs" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all duration-200"
                                                    title="Delete task"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* 3. DETAILS EDIT SLIDING DRAWER (RIGHT PANEL) */}
            <AnimatePresence>
                {selectedTask && (
                    <>
                        {/* Drawer Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTask(null)}
                            className="fixed inset-0 z-45 bg-slate-950 backdrop-blur-xs"
                        />

                        {/* Drawer Panel Container */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Task Workspace</h3>
                                    <p className="text-xxs text-slate-400 mt-0.5">Created on {new Date(selectedTask.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                                >
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>

                            {/* Drawer Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                
                                {/* Edit Title Text */}
                                <div>
                                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Task Title</label>
                                    <input
                                        type="text"
                                        value={selectedTask.text}
                                        onChange={(e) => updateSelectedTask({ text: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-sm"
                                    />
                                </div>

                                {/* Properties Grid (Category, Priority, Due Date) */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category Selector */}
                                    <div>
                                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                                        <select
                                            value={selectedTask.category}
                                            onChange={(e) => updateSelectedTask({ category: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Priority Selector */}
                                    <div>
                                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                                        <select
                                            value={selectedTask.priority}
                                            onChange={(e) => updateSelectedTask({ priority: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">High Priority</option>
                                        </select>
                                    </div>

                                    {/* Due Date selector */}
                                    <div className="col-span-2">
                                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Due Date</label>
                                        <input
                                            type="date"
                                            value={selectedTask.dueDate || ''}
                                            onChange={(e) => updateSelectedTask({ dueDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Task Notes Description */}
                                <div>
                                    <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detailed Workspace Notes</label>
                                    <textarea
                                        rows="4"
                                        value={selectedTask.description || ''}
                                        onChange={(e) => updateSelectedTask({ description: e.target.value })}
                                        placeholder="Add notes, ideas, lists, and instructions..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                                    />
                                </div>

                                {/* Subtasks Panel */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400">Subtask Milestones</label>
                                        <span className="text-xxs text-indigo-500 font-semibold">
                                            {selectedTask.subtasks?.filter(s => s.completed).length || 0} of {selectedTask.subtasks?.length || 0} completed
                                        </span>
                                    </div>

                                    {/* Subtasks Progress Line */}
                                    {selectedTask.subtasks?.length > 0 && (
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                                                style={{ 
                                                    width: `${Math.round(
                                                        ((selectedTask.subtasks?.filter(s => s.completed).length || 0) / 
                                                         (selectedTask.subtasks?.length || 1)) * 100
                                                    )}%` 
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Create Subtask Field */}
                                    <form onSubmit={addSubtask} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSubtaskText}
                                            onChange={(e) => setNewSubtaskText(e.target.value)}
                                            placeholder="Add subtask milestone..."
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors duration-200"
                                        >
                                            Add
                                        </button>
                                    </form>

                                    {/* Subtasks listing */}
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {selectedTask.subtasks?.map(sub => (
                                            <div 
                                                key={sub.id}
                                                className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 rounded-xl"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSubtask(sub.id)}
                                                    className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                                                >
                                                    {sub.completed ? (
                                                        <FaCheckCircle className="text-indigo-600 dark:text-indigo-400 text-sm flex-shrink-0" />
                                                    ) : (
                                                        <FaRegCircle className="text-slate-400 dark:text-slate-600 text-sm flex-shrink-0" />
                                                    )}
                                                    <span className={`text-xs truncate ${
                                                        sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'
                                                    }`}>
                                                        {sub.text}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSubtask(sub.id)}
                                                    className="text-slate-400 hover:text-rose-500 text-xs p-1"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer Actions */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors duration-200"
                                >
                                    Workspace Saved
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Dashboard
