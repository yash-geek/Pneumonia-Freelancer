import React, { useState } from 'react'

const Login = () => {
    const [isLogin, setIsLogin] = useState(true) // 
    const [role, setRole] = useState('client')   // 

    const toggleMode = () => setIsLogin((prev) => !prev)
    const switchRole = (newRole) => setRole(newRole)

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-200 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    {isLogin ? 'Login' : 'Sign Up'} as {role === 'client' ? 'Client' : 'Freelancer'}
                </h2>

                {/* Role Switch */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => switchRole('client')}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${role === 'client'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Client
                    </button>
                    <button
                        onClick={() => switchRole('freelancer')}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${role === 'freelancer'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Freelancer
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {/* Mode Switch */}
                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={toggleMode} className="text-blue-500 hover:underline font-medium">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )

}

export default Login