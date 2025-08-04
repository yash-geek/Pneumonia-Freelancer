import toast from 'react-hot-toast'
import { CiChat1 as ChatIcon } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useHandleOrderMutation } from '../../redux/apis/api'

const MyOrderItem = ({ order }) => {
    const navigate = useNavigate();
    const gotoChat = (orderId) => {
        navigate(`/chat/${order?._id}`)
    }

    const { orderID, client, gig, price, status, time, paymentStatus } = order || {}
    const [updateOrderStatus, isLoading] = useAsyncMutation(useHandleOrderMutation)
    const handleOrder = (status) => {
        updateOrderStatus('Updating Order Status', { orderId: order._id, status })
            .then((response) => {
                toast.success('Order status updated successfully:')
            })
            .catch((error) => {
                toast.error('Error updating order status:' + error)
            })
    }



    return (
        <div className="w-full max-h-fit bg-white rounded-2xl shadow-md border border-gray-200 p-5 mb-4 space-y-3 transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-red-800">Order ID: {orderID}</h2>
                    <p className="text-sm text-gray-500">Client: {client?.name}</p>
                    <p className="text-sm text-gray-500">Gig : {gig?.title}</p>
                    <p className="text-sm text-gray-500">Price: ₹{price}</p>
                    <p className="text-sm text-gray-500">Time: {new Date(time).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Payment: {paymentStatus}</p>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className="text-sm font-semibold text-blue-600">
                        Status: <span className="capitalize">{status}</span>
                    </div>
                    {
                        ['pending', 'accepted', 'in progress'].includes(status) && <div>
                            <button onClick={() => gotoChat(order)} className='flex px-3 py-1 text-xs font-medium rounded-full items-center gap-1 bg-blue-50 w-fit cursor-pointer '><span>Chat</span><ChatIcon size={'2rem'} /> </button>
                        </div>
                    }
                </div>
            </div>

            {/* Buttons based on status */}
            <div className="flex justify-end gap-2 pt-2">
                {status === 'pending' && (
                    <>
                        <button
                            onClick={() => handleOrder('in progress')}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                        >
                            Accept Order
                        </button>
                        <button
                            onClick={() => handleOrder('cancelled')}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                            Cancel Order
                        </button>
                    </>
                )}
                {status === 'accepted' && (
                    <button
                        onClick={() => handleOrder('completed')}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition"
                    >
                        Complete Order
                    </button>
                )}
                {status === 'in progress' && (
                    <button
                        onClick={() => handleOrder('completed')}
                        className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition"
                    >
                        Mark as Completed
                    </button>
                )}
                {status === 'completed' && (
                    <span className="text-green-600 font-semibold">Order Completed ✅</span>
                )}
            </div>
        </div>
    )
}

export default MyOrderItem
