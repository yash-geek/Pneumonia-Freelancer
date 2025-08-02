import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaClipboardList as OrderIcon } from 'react-icons/fa6'
import { FaUserTie as FreelancerIcon,FaUser as ClientIcon, FaAddressCard as ProfileIcon, FaFileInvoiceDollar as GigIcon } from 'react-icons/fa'
import { MdDashboard as DashboardIcon } from 'react-icons/md'
import { UserIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { closeDrawer } from '../../redux/reducers/misc'

const Nav = () => {
    const inactiveLink = 'flex gap-1 p-1 bg-blue-800 text-white';
    const activeLink = 'bg-white flex gap-1 p-1 text-blue-800 rounded-l-lg';
    const { pathname } = useLocation();
    const dispatch = useDispatch()
    const handleCloseBar = ()=>{
        dispatch(closeDrawer(false))
    }
    const {user} = useSelector((state)=>state.auth)
    return (
        <nav
            className='flex flex-col bg-blue-800 h-[100%] gap-2'
        >
            
            <div
                
                className={`flex gap-8 p-6 w-[100%] text-2xl md:text-3xl bg-blue-800 text-white items-center`}
            >
                
                {user.role === 'client'?'Client':'Freelancer'}
                {user.role === 'client'?<ClientIcon/>:<FreelancerIcon/>}

            </div>
            {
                user.role === 'client'?
                
                <><Link
                onClick={handleCloseBar}
                to={'/'}
                className={`${pathname === '/' ? activeLink : inactiveLink} link`}
            >
                <DashboardIcon className='size-6' />
                Dashboard

            </Link>
            <Link
                onClick={handleCloseBar}
                to={'/orders'}
                className={`${pathname === '/orders' ? activeLink : inactiveLink} link`}
            >
                <OrderIcon className='size-6' />
                My Orders

            </Link>
            <Link
                onClick={handleCloseBar}
                to={'/profile'}
                className={`${pathname === '/profile' ? activeLink : inactiveLink} link`}
            >
                <UserIcon className='size-6' />
                Profile

            </Link>
            </>
            :
            <>
            <Link
                onClick={handleCloseBar}
                to={'/'}
                className={`${pathname === '/' ? activeLink : inactiveLink} link`}
            >
                <DashboardIcon className='size-6' />
                Dashboard

            </Link>
            <Link
                onClick={handleCloseBar}
                to={'/manageorders'}
                className={`${pathname === '/manageorders' ? activeLink : inactiveLink} link`}
            >
                <OrderIcon className='size-6' />
                Manage Orders

            </Link>
            <Link
                onClick={handleCloseBar}
                to={'/gigs'}
                className={`${pathname === '/gigs' ? activeLink : inactiveLink} link`}
            >
                <GigIcon className='size-6' />
                My Gigs

            </Link>
            <Link
                onClick={handleCloseBar}
                to={'/profile'}
                className={`${pathname === '/profile' ? activeLink : inactiveLink} link`}
            >
                <ProfileIcon className='size-6' />
                Worker Profile

            </Link>
            </>
            }
        </nav>
    )
}

export default Nav