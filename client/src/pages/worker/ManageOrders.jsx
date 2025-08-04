import React, { useEffect, useState } from 'react'
import { useGetOrdersQuery, useGetProfileQuery } from '../../redux/apis/api'
import { useNavigate } from 'react-router-dom'

import addProfileImg from '../../assets/addprofile.svg';
import MyOrderItem from '../../components/specifics/MyOrderItem';

const ManageOrders = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState(['pending', 'in progress', 'completed', 'cancelled']);

  const selectedBtn = 'bg-blue-600 text-white shadow-md';
  const unselectedBtn = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'in progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-green-200 text-green-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }
  const getStatus = (type) => {
    switch (type) {
      case 'all': return ['pending', 'in progress', 'completed', 'cancelled'];
      case 'new': return ['pending'];
      case 'ongoing': return ['in progress'];
      case 'completed': return ['completed', 'cancelled'];
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  const { data, isLoading, refetch } = useGetProfileQuery()
  const { data: ordersData, isLoading: ordersLoading, refetch: ordersRefetch } = useGetOrdersQuery()
  useEffect(() => {
  }, [isLoading, data, ordersData])
  return (
    data?.status ?

      <div className='h-full w-full overflow-hidden'>
        <div className='h-48 w-full py-8'>
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8"> Manage Orders </h1>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {['all', 'new', 'ongoing', 'completed'].map(type => (
              <button
                key={type}
                className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${filter === type ? selectedBtn : unselectedBtn}`}
                onClick={() => {
                  setFilter(type);
                  setStatus(getStatus(type));
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

        </div>
        <div className='h-[calc(100%-12rem)] w-full'>
          <div className='w-full h-full flex flex-col items-center p-4 gap-4 overflow-y-auto scrollbar-thin-pretty'>
            {
              ordersData?.ordersForMe?.length > 0 ?
              ordersData?.ordersForMe?.filter(thisOrder => status.includes(thisOrder.status)).map((thisOrder, index) => (
                <MyOrderItem key={index} order={thisOrder} />
                ))
                :
                <div className='flex flex-col items-center gap-3 justify-center h-full w-full'>
                  <img className='w-40' src={addProfileImg} alt="Add Profile" />
                  <span>No orders yet</span>
                </div>
              
            }

          </div>
        </div>
      </div>
      :
      <div className='flex flex-col items-center gap-3 justify-center h-full w-full'>
        <img className='w-40' src={addProfileImg} alt="Add Profile" />
        <span>You don't have a Freelancer profile yet, create one now</span>
        <button
          onClick={() => navigate('/profile')}
          type="button"
          className="w-40 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 flex justify-center items-center gap-4 rounded-xl transition duration-200"
        >
          Go to Profile
        </button>
      </div>
  )
}

export default ManageOrders