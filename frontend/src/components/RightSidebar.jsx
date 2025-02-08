import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)
  
  return (
    <div className='sticky top-0 h-screen w-80 border-l hidden lg:block bg-gray-50'>
      <div className='flex flex-col gap-6 p-6 pt-12'>
        {/* User Profile Section */}
        <div className='flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow transition-shadow'>
          <Link 
            to={`/profile/${user?._id}`}
            className='hover:ring-4 ring-primary/10 transition-all rounded-full'
          >
            <Avatar className='h-14 w-14 border-2 border-white'>
              <AvatarImage 
                src={user?.profilePicture} 
                alt={user?.username} 
                className='object-cover'
              />
              <AvatarFallback className='font-medium text-gray-600'>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className='flex-1 min-w-0'>
            <h1 className='font-semibold text-base truncate'>
              <Link 
                to={`/profile/${user?._id}`}
                className='text-gray-800 hover:text-primary transition-colors'
              >
                {user?.username}
              </Link>
            </h1>
            <p className='text-sm text-gray-500 truncate'>
              {user?.bio || '✨ Your bio goes here...'}
            </p>
          </div>
        </div>

        {/* Suggested Users Section */}
        <div className='space-y-4'>
         
          <div className='space-y-4'>
            <SuggestedUsers />
          </div>
        </div>

        {/* Footer Text */}
        <div className='px-4 pt-8 border-t border-gray-100'>
          <p className='text-xs text-gray-400 text-center'>
            © 2024 Your App Name · Privacy · Terms
          </p>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar