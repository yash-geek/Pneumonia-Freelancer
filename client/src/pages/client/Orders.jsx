import React, { useEffect, useState } from 'react'
import { useGetMyOrdersQuery, useRateOrderMutation } from '../../redux/apis/api'
import LayoutLoader from '../../components/Layouts/LayoutLoader'
import { FaStar } from 'react-icons/fa'
import { CiChat1 as ChatIcon } from 'react-icons/ci'
import { useAsyncMutation } from '../../hooks/hook';
import { useNavigate } from 'react-router-dom'
const Orders = () => {
  const { data, isLoading, isError, error } = useGetMyOrdersQuery()
  const [rateTrigger, isLoadingRate] = useAsyncMutation(useRateOrderMutation)
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState(['pending', 'in progress', 'completed', 'cancelled']);
  const navigate = useNavigate();
  useEffect(() => {
  }, [data, isError, error])

  const selectedBtn = 'bg-blue-600 text-white shadow-md';
  const unselectedBtn = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  const handleRate = async (orderId, rating, gigId, freelancerId) => {
    await rateTrigger('updating order', {
      orderId,
      rating,
      gigId,
      freelancerId
    })


    //{orderId, rating, gigId, freelancerId}
    //handle rating logic here
  }
  const gotoChat = (order)=>{
    navigate(`/chat/${order?._id}`) // Assuming you want to navigate to the first order's chat
    // Here you would typically check if a chat exists for the order and create one if it doesn't
    // For now, just logging the action
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'in progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-green-200 text-green-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  return isLoading ? <LayoutLoader /> : (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8"> My Orders </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {['all', 'pending', 'completed'].map(type => (
          <button
            key={type}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${filter === type ? selectedBtn : unselectedBtn}`}
            onClick={() => {
              setFilter(type);
              setStatus(type === 'all'
                ? ['pending', 'in progress', 'completed', 'cancelled']
                : type === 'pending'
                  ? ['pending', 'in progress']
                  : ['completed', 'cancelled']
              );
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 scrollbar-thin-pretty">
        {data?.orders
          ?.filter(order => status.includes(order.status))
          .map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between gap-1">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{order.gigTitle}</h2>
                <p className="text-sm text-gray-500">ID: {order.orderID}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p><strong>Freelancer:</strong> {order?.freelancer?.name || 'Unknown'}</p>
                <p><strong>Price:</strong> ${order.price}</p>
                <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} w-fit`}>
                {order.status.toUpperCase()}
              </span>
              {order.status === 'completed' && order.giveRating && <div className='flex items-center mt-2'>
                <FaStar />
                <span className="ml-1 text-yellow-600">{order.giveRating}</span>
              </div>

              }
              {
                (order.status === 'in progress' || order.status === 'pending') 
                && 
                <button onClick={()=>gotoChat(order)} className='flex px-3 py-1 text-xs font-medium rounded-full items-center gap-1 bg-blue-50 w-fit cursor-pointer '><span>Chat</span><ChatIcon size={'1.5rem'} /> </button>
              }
              {!order.giveRating && order.status === 'completed' && <span className='flex flex-col mt-2'>

                Rate Now
                <div>
                  {
                    [1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} className='btn bg-yellow-500 text-white rounded-full
                    hover:bg-yellow-600 ml-2 p-1 text-xs font-small scale-0.75 hover:scale-100 transition-transform duration-200'
                        onClick={() => {
                          handleRate(order._id, rating, order.gig._id, order.freelancer._id);
                        }}
                      >
                        {rating}
                      </button>
                    ))
                  }
                </div>

              </span>}
            </div>
          ))
        }

        {data?.orders?.filter(order => status.includes(order.status)).length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-xl font-medium">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
