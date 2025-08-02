import React, { useEffect, useState } from 'react'
import { useInputValidation } from '6pp'
import { emailValidator } from '../utils/validators'
import axios from 'axios'
import toast from 'react-hot-toast'
import { server } from '../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
    const [isLogin, setIsLogin] = useState(true) // 
    const [role, setRole] = useState('client')   //
    const [isLoading, setIsLoading] = useState(false) // for loading state

    const toggleMode = () => setIsLogin((prev) => !prev)
    const switchRole = (newRole) => setRole(newRole)
    const dispatch = useDispatch()

    const name = useInputValidation('')
    const email = useInputValidation('', emailValidator)
    const password = useInputValidation('')
    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");
        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }
        const endpoint = role === 'client'
            ? `${server}/api/v1/client/loginclient`
            : `${server}/api/v1/worker/loginworker`
        try {

            const { data } = await axios.post(
                endpoint, {
                email: email.value,
                password: password.value,

            }, config);
            console.log(data)
            const userData = {
                ...data.user,
                role: data.role, // Assuming the response contains the user role
            }
            console.log(userData)
            dispatch(userExists(userData))
            toast.success(data.message, { id: toastId })

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }
    const handleSignUp = async (e) => {
        e.preventDefault()
        const toastId = toast.loading("Signing Up...");
        setIsLoading(true);
        const signUpData = {
            name: name.value,
            email: email.value,
            password: password.value,
        }
        const endpoint = role === 'client'
            ? `${server}/api/v1/client/newclient`
            : `${server}/api/v1/worker/newworker`

        try {
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
            if (role === 'client') {
                signUpData.role = 'client';
            } else {
                signUpData.role = 'worker';
            }
            const { data } = await axios.post(
                endpoint,
                signUpData,
                config
            );
            const userData = {
                ...data.user,
                role: data.role, // Assuming the response contains the user role
            }
            dispatch(userExists(userData));
            toast.success(data.message, { id: toastId })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-200 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    {isLogin ? 'Login' : 'Sign Up'} as {role === 'client' ? 'Client' : 'Freelancer'}
                </h2>

                {/* Role Switch */}
                <div className="flex justify-center gap-4">
                    <button
                        disabled={isLoading}
                        onClick={() => switchRole('client')}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${role === 'client'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        Client
                    </button>
                    <button
                        disabled={isLoading}
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
                <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleSignUp}>
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                value={name.value}
                                onChange={name.changeHandler}
                                type="text"
                                placeholder="Enter your name"
                                className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input

                            value={email.value}
                            onChange={email.changeHandler}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            value={password.value}
                            onChange={password.changeHandler}
                            type="password"
                            placeholder="••••••••"
                            className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>


                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {/* Mode Switch */}
                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        disabled={isLoading}
                        onClick={toggleMode} className="text-blue-500 hover:underline font-medium">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )

}

export default Login