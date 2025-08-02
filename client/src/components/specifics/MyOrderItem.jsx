import React, { useEffect } from 'react'
import { useHandleOrderMutation } from '../../redux/apis/api'
import { useAsyncMutation } from '../../hooks/hook'

const MyOrderItem = ({ order }) => {
    useEffect(() => {
        console.log(order)
    }, [order])

    
    const { orderID, client, gig, price, status, time, paymentStatus } = order || {}
    const [updateOrderStatus, isLoading] = useAsyncMutation(useHandleOrderMutation)
    const handleOrder = (status) => {
        console.log('Order status:', status, 'id: ', order._id)
        updateOrderStatus('Updating Order Status',{ orderId:order._id, status })
            .then((response) => {
                console.log('Order status updated successfully:', response)
            })
            .catch((error) => {
                console.error('Error updating order status:', error)
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
                <div className="text-sm font-semibold text-blue-600">
                    Status: <span className="capitalize">{status}</span>
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
