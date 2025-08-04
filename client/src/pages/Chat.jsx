import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { IoMdSend as SendIcon } from 'react-icons/io';
import { IoArrowBack as BackIcon } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LayoutLoader from '../components/Layouts/LayoutLoader';
import { useFetchOrderQuery, useGetMessagesQuery } from '../redux/apis/api';
import { useSocket } from '../socket';

const Chat = () => {
    const socket = useSocket();
    const { user } = useSelector((state) => state.auth);
    const params = useParams();
    const orderId = params.orderId;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const { data: orderData, isLoading: isLoadingOrder, isError, error } = useFetchOrderQuery({ orderId, route: user.role === 'client' ? 'client' : 'worker' });
    const { data: messageData, isLoading: messageLoading, isError: messageError } = useGetMessagesQuery({ orderId });

    // Scroll to latest message

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load initial messages
    useEffect(() => {
        if (messageData) {
            setMessages(messageData.messages);
        }
    }, [messageData]);

    // Socket listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = ({ chatId, message: incomingMessage }) => {

            setMessages(prev => {
                const exists = prev.some(msg => msg._id === incomingMessage._id);
                if (!exists) return [...prev, incomingMessage];
                return prev;
            });
        };

        socket.on("NEW_MESSAGE", handleNewMessage);

        return () => {
            socket.off("NEW_MESSAGE", handleNewMessage);
        };
    }, [socket]);


    // Send message
    const sendMessage = () => {
        if (!message.trim()) return;

        const tempMessage = {
            _id: Date.now(), // temporary ID
            text: message,
            sender: {
                _id: user._id,
                name: user.name,
            },
            role: user.role,
            chatId: orderId,
            sentAt: new Date().toISOString(),
        };

        // Optimistic update
        setMessages((prev) => [...prev, tempMessage]);

        socket?.emit("NEW_MESSAGE", {
            orderId,
            content: message,
        });

        setMessage('');
    };

    if (isLoadingOrder || messageLoading) return <LayoutLoader />;
    if (!socket) {
        return <LayoutLoader />;
    }

    return (
        <div className='bg-blue-400 flex flex-col justify-center items-center h-[100%] w-[100%] relative'>
            {/* Back Button */}
            <Link
                to={user.role === 'client' ? '/orders' : '/manageorders'}
                className='text-blue-800 flex items-center gap-2 w-fit border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50 bg-white transition-all left-3 absolute top-3 z-10'>
                <BackIcon />
                <span>Back</span>
            </Link>

            {/* Order Details */}
            <div className='flex-1 w-fit max-w-[90%] bg-blue-50 rounded-2xl flex flex-col gap-2 p-4 items-center absolute top-10 left-1/2 transform -translate-x-1/2 z-10 opacity-70'>
                <span>Order Id: {orderData?.order?.orderID}</span>
                <span>Title: {orderData?.order?.gig?.title}</span>
                <span>{user.role === 'worker' ? 'Client' : 'Freelancer'} Contact: {user.role === 'worker' ? orderData?.order?.client?.email : orderData?.order?.freelancer?.email}</span>
            </div>

            {/* Chat Body */}
            <div className='h-[95%] flex flex-col justify-between p-4 items-center relative w-[100%] overflow-y-clip pt-35 py-10 scrollbar-thin-pretty'>
                <div className='flex-1 flex flex-col overflow-auto w-full'>
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={msg._id || index}
                                className={`p-2 m-2 rounded-xl max-w-[70%] ${msg.sender._id.toString() === user._id.toString()
                                    ? 'bg-blue-300 self-end'
                                    : 'bg-gray-200 self-start'
                                    }`}
                            >
                                <p className='text-sm'>{msg.text}</p>
                                <p className='text-xs text-right text-gray-600'>
                                    {moment(msg.sentAt).format('HH:mm')}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-700'>no messages yet... Say hi~ 👋</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Field */}
            <div className='flex items-center gap-2 p-2 justify-center bg-white rounded-lg shadow-md w-[90%] bottom-3 absolute border-none'>
                <input
                    className='w-[95%] focus:outline-none focus:ring-0'
                    type="text"
                    placeholder='Write a message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className='w-[5%] cursor-pointer' onClick={sendMessage}><SendIcon /></button>
            </div>
        </div>
    );
};

export default Chat;
