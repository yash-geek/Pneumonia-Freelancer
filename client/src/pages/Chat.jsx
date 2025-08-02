import React, { useEffect, useState } from 'react'
import { IoMdSend as SendIcon } from 'react-icons/io'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import ChatList from '../components/specifics/ChatList'
import { Link, useParams } from 'react-router-dom'
import { useFetchOrderQuery } from '../redux/apis/api'
import LayoutLoader from '../components/Layouts/LayoutLoader'
import { useSelector } from 'react-redux'

const Chat = (

) => {
    
    const {user} = useSelector((state)=>state.auth) 
    console.log(user.role)
    const params = useParams();
    const orderId = params.orderId;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); 
    const sendMessage = () => {
        console.log('send message', message);
        // Logic to send message
        setMessage('');
    }
    const chats = ['fetch chats from server']
    const { data:orderData, isLoading:isLoadingOrder, isError, error } = useFetchOrderQuery({ orderId });
    console.log('order data:', orderData?.order, isLoadingOrder, isError, error);

    useEffect(() => {
       
        // Fetch chat messages for the orderId from the server
        // setMessages(fetchedMessages);
    }, [orderData,isLoadingOrder]);
    return (
        isLoadingOrder ? <LayoutLoader /> :
            <div className=' bg-blue-400 flex flex-col justify-center items-center h-[100%] w-[100%] relative '>
                {/* <div className='flex-1 bg-amber-900 h-[100%] overflow-clip'>
                <ChatList chats={chats}/>
            </div> */}
                <Link
                    to='/orders'
                    className='text-blue-800 flex items-center gap-2 w-fit border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50 bg-white transition-all left-3 absolute top-3 z-10'>
                    <BackIcon />
                    <span>Back</span>
                </Link>

                <div className='flex-1 w-fit max-w-[90%] bg-blue-50 rounded-2xl flex flex-col gap-2 p-4 items-center absolute top-10 left-1/2 transform -translate-x-1/2'>
                    <span>Order Id: {orderData?.order?.orderID}</span>
                    <span>Title: {orderData?.order?.gig?.title}</span>
                    <span>Freelancer Contact: {orderData?.order?.freelancer?.email}</span>
                </div>
                <div className='h-[100%] flex flex-col justify-between p-4 items-center relative w-[100%] overflow-y-clip py-20'>


                    {/* Chat messages and input area will go here */}
                    <div className='flex-1 overflow-auto w-full'>
                        {/* Render chat messages here */}
                        <p className='h-[5rem]'>Message no 1</p>
                        <p className='h-[5rem]'>Message no 2</p>
                        <p className='h-[5rem]'>Message no 3</p>
                        <p className='h-[5rem]'>Message no 4</p>
                        <p className='h-[5rem]'>Message no 5</p>
                        <p className='h-[5rem]'>Message no 6</p>
                        <p className='h-[5rem]'>Message no 7</p>
                        <p className='h-[5rem]'>Message no 8</p>
                        <p className='h-[5rem]'>Message no 9</p>
                        <p className='h-[5rem]'>Message no 10</p>
                        <p className='h-[5rem]'>Message no 11</p>
                        <p className='h-[5rem]'>Message no 12</p>
                        <p className='h-[5rem]'>Message no 13</p>
                        <p className='h-[5rem]'>Message no 14</p>
                        <p className='h-[5rem]'>Message no 15</p>
                        <p className='h-[5rem]'>Message no 16</p>
                        <p className='h-[5rem]'>Message no 17</p>
                        <p className='h-[5rem]'>Message no 18</p>
                        <p className='h-[5rem]'>Message no 19</p>
                        <p className='h-[5rem]'>Message no 20</p>
                        <p className='text-center text-gray-700'>Chat messages will appear here...</p>
                    </div>
                </div>
                <div className='flex items-center gap-2 p-2 justify-center bg-white rounded-lg shadow-md  w-[90%] bottom-3 absolute border-none '>
                    <input
                        className=' w-[95%] focus:outline-none focus:ring-0'
                        type="text"
                        placeholder='write a message...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className='w-[5%] cursor-pointer' onClick={sendMessage}><SendIcon /></button>
                </div>

            </div>
    )
}

export default Chat