import React, { useState } from 'react'
import Header from './Header'
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ClientLayout = ({ Component, ...props }) => {
    const { isMobile } = useSelector((state) => state.misc)
    const { user } = useSelector((state) => state.auth)
    return (
        <>
            <Header />
            <div className='flex h-[calc(100vh-64px)]'>
                {
                    isMobile && (
                        <div
                            className={`fixed left-0 w-[50%] h-[100%] z-20 bg-white shadow-lg`}

                        >
                            <Nav />
                        </div>
                    )
                }
                <div className={`flex-1 h-[100%] hidden sm:block`}>
                    <Nav />
                </div>
                <div className='flex-5 h-[100%] flex flex-col overflow-auto items-start'>
                    <Component {...props}/>
                </div>

            </div>
        </>
    )
}

export default ClientLayout