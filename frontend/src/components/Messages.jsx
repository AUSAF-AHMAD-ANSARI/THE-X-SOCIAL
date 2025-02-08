import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='flex-1 overflow-y-auto bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 p-4 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent'>
            {/* User Profile Header */}
            <div className='sticky top-0 z-10 mb-8 bg-gradient-to-b from-white/80 to-transparent pb-4 pt-2 backdrop-blur-lg'>
                <div className='flex flex-col items-center justify-center space-y-3'>
                    <div className='relative'>
                        <Avatar className="h-24 w-24 shadow-lg shadow-purple-200/50 ring-2 ring-white">
                            <AvatarImage 
                                src={selectedUser?.profilePicture} 
                                alt='profile' 
                                className='object-cover'
                            />
                            <AvatarFallback className='bg-gradient-to-br from-purple-100 to-pink-100 font-medium text-purple-600'>
                                {selectedUser?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='absolute -bottom-2 right-0 h-5 w-5 rounded-full bg-green-400 ring-2 ring-white' />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800'>
                        {selectedUser?.username}
                    </h2>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button 
                            className='h-9 rounded-full bg-white px-5 text-sm font-medium text-purple-600 shadow-md shadow-purple-100 hover:bg-white/90 hover:shadow-lg hover:shadow-purple-200/40'
                            variant="secondary"
                        >
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Messages Container */}
            <div className='flex flex-col gap-3 px-2'>
                {messages && messages.map((msg) => (
                    <div 
                        key={msg._id} 
                        className={`group flex transition-transform duration-150 ease-out ${
                            msg.senderId === user?._id 
                                ? 'justify-end' 
                                : 'justify-start'
                        }`}
                    >
                        <div 
                            className={`relative max-w-[75%] space-y-1 rounded-3xl p-4 text-sm font-medium shadow-sm transition-all duration-200 ${
                                msg.senderId === user?._id 
                                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-purple-300/30 hover:shadow-md hover:shadow-purple-300/40' 
                                    : 'bg-white text-gray-800 shadow-purple-100/50 hover:shadow-md hover:shadow-purple-100/60'
                            }`}
                        >
                            {/* Message Bubble Tail */}
                            <div className={`absolute bottom-0 ${
                                msg.senderId === user?._id 
                                    ? '-right-1 h-4 w-4 -scale-x-100 bg-gradient-to-bl from-purple-600 to-pink-500 clip-path-message-tail'
                                    : '-left-1 h-4 w-4 bg-white clip-path-message-tail'
                            }`} />
                            
                            <p className='break-words leading-snug'>{msg.message}</p>
                            <span 
                                className={`mt-1 block text-xs ${
                                    msg.senderId === user?._id 
                                        ? 'text-purple-200/90' 
                                        : 'text-gray-500/80'
                                }`}
                            >
                                {new Date(msg.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Messages