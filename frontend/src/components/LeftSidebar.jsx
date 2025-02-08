import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Home className="w-5 h-5" />, text: "Home" },
        { icon: <Search className="w-5 h-5" />, text: "Search" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Explore" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Messages" },
        { icon: <Heart className="w-5 h-5" />, text: "Notifications" },
        { icon: <PlusSquare className="w-5 h-5" />, text: "Create" },
        {
            icon: (
                <Avatar className='w-7 h-7 ring-2 ring-purple-500 ring-offset-2'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
    ]

    return (
        <div className='fixed top-0 z-10 left-0 px-6 w-[16.5%] h-screen bg-gradient-to-b from-indigo-50 to-purple-50 border-r border-purple-100'>
            <div className='flex flex-col h-full'>
                <h1 className='my-8 pl-3 font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    THE-X-SOCIALS
                </h1>
                
                <div className='flex flex-col gap-2'>
                    {sidebarItems.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => sidebarHandler(item.text)}
                            className='flex items-center gap-4 relative hover:bg-purple-50 cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-sm group'
                        >
                            <span className='text-purple-600 group-hover:text-purple-700'>
                                {item.icon}
                            </span>
                            <span className='text-gray-700 group-hover:text-purple-900 font-medium'>
                                {item.text}
                            </span>
                            
                            {item.text === "Notifications" && likeNotification.length > 0 && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            size='icon' 
                                            className="rounded-full h-6 w-6 bg-pink-500 hover:bg-pink-600 absolute left-8 -top-2 text-xs text-white"
                                        >
                                            {likeNotification.length}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='rounded-xl shadow-lg'>
                                        <div className='space-y-3'>
                                            {likeNotification.length === 0 ? (
                                                <p className='text-gray-500 text-sm'>No new notifications</p>
                                            ) : (
                                                likeNotification.map((notification) => (
                                                    <div 
                                                        key={notification.userId} 
                                                        className='flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg'
                                                    >
                                                        <Avatar className='w-8 h-8'>
                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className='text-sm text-gray-700'>
                                                            <span className='font-semibold'>
                                                                {notification.userDetails?.username}
                                                            </span> liked your post
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar