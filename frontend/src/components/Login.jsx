import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { motion } from 'framer-motion';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={signupHandler} 
                className='bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 relative overflow-hidden'
            >
                {/* Animated background effect */}
                <div className='absolute inset-0 -z-10'>
                    <div className='absolute -top-4 -left-4 w-12 h-12 bg-purple-300/30 rounded-full blur-xl'></div>
                    <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-pink-300/30 rounded-full blur-xl'></div>
                </div>

                <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className='space-y-2 text-center'
                >
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        THE-X-SOCIALS
                    </h1>
                    <p className='text-gray-600'>Welcome back! Please login to your account</p>
                </motion.div>

                <div className='space-y-4'>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='space-y-2'
                    >
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <Input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                className="pl-10 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-300 hover:shadow-sm"
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='space-y-2'
                    >
                        <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <Input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="pl-10 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 transition-all duration-300 hover:shadow-sm"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button 
                            type='submit' 
                            className='w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                            disabled={loading}
                        >
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                    <span>Logging in...</span>
                                </div>
                            ) : 'Login'}
                        </Button>
                    </motion.div>

                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-white/90 px-2 text-gray-500'>Or continue with</span>
                        </div>
                    </div>

                    <motion.div 
                        className='flex gap-4 justify-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button variant="outline" className='rounded-xl p-3 hover:bg-gray-50 transition-colors'>
                            <Chrome className='h-6 w-6 text-blue-600' />
                        </Button>
                        <Button variant="outline" className='rounded-xl p-3 hover:bg-gray-50 transition-colors'>
                            <Github className='h-6 w-6 text-gray-800' />
                        </Button>
                    </motion.div>
                </div>

                <motion.p 
                    className='text-center text-gray-600'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Don't have an account? {' '}
                    <Link 
                        to="/signup" 
                        className='font-semibold text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline'
                    >
                        Sign up
                    </Link>
                </motion.p>
            </motion.form>
        </div>
    )
}

export default Login