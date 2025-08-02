import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightStartOnRectangleIcon, Bars3Icon, BellIcon, InboxIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { toggleDrawer } from '../../redux/reducers/misc';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config';
import { userNotExists } from '../../redux/reducers/auth';
const Header = () => {
    const dispatch = useDispatch();


    const { isMobile } = useSelector((state) => state.misc)
    const handleMobile = () => {
        dispatch(toggleDrawer())
    }
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const handleLogout = async () => {

        try {
            if (user?.role === 'client') {
                await axios.get(`${server}/api/v1/client/logoutclient`, { withCredentials: true });
            } else if (user?.role === 'worker') {
                await axios.get(`${server}/api/v1/worker/logoutworker`, { withCredentials: true });
            } else {
                toast.error("Unknown user role, cannot logout");
            }

            dispatch(userNotExists());
            navigate('/login'); // or home page
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Logout failed");
        }
    };
    return (
        <div

            className='flex items-center justify-between w-screen bg-blue-500 
    h-16
    
    '
        >

            <div
                className='flex items-center px-6 sm:hidden'
                onClick={handleMobile}
            >
                {
                    isMobile ?
                        <XMarkIcon className='icon-sm lg:icon-lg' /> :
                        <Bars3Icon className='icon-sm lg:icon-lg' />
                }
            </div>
            <h1 className="text-3xl font-bold text-blue-900 leading-tight px-2">
                Pneumonia
            </h1>
            <div
                className='flex gap-5 items-center px-6'
            >

                <InboxIcon className='icon-sm ' />
                <BellIcon className='icon-sm' />
                <ArrowRightStartOnRectangleIcon

                    onClick={handleLogout}
                    className='icon-sm ' />

            </div>

        </div>
    )
}

export default Header