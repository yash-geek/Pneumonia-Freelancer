import { IoArrowBack } from 'react-icons/io5'
import { FaStar } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAskQuestionMutation, useCreateStripeSessionMutation, useGetGigInfoQuery, useLazyWorkerProfileQuery, useNewOrderMutation } from '../../redux/apis/api'
import { useAsyncMutation } from '../../hooks/hook'
import toast from 'react-hot-toast'
import LayoutLoader from '../../components/Layouts/LayoutLoader'

const BrowseGig = () => {
  const params = useParams()



  const [toggleCreator, setToggleCreator] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [newOrder, setNewOrder] = useState(false);


  const [getWorker, { data: gigCreator, isLoading: isLoadingCreator }] = useLazyWorkerProfileQuery();
  const { data: gigInfo, isLoading: isLoadingGig } = useGetGigInfoQuery({ id: params.id });
  const [askQuestion, isLoadingAskQuestion] = useAsyncMutation(useAskQuestionMutation);
  const browseCreator = () => {
    setToggleCreator((prev) => !prev);
  };
  const handleAskQuestion = () => {
    setIsQuestion((prev) => !prev);

  };
  const handleSubmitQuestion = async () => {
    setIsQuestion(false);
    await askQuestion("Updating FAQ's", { question: question, id: params.id });
    setQuestion("");
  };

  const [orderTrigger, isLoadingNewOrder] = useAsyncMutation(useNewOrderMutation);
  const newOrderHandler = async () => {
    try {
      const res = await orderTrigger('Creating New Order...', { id: params.id });
    } catch (err) {
      toast.error('Order creation failed:', err);
    }
    setNewOrder(false);
    window.location.reload();
  };
  // const [createStripeSession, isLoadingNewOrder] = useAsyncMutation(useCreateStripeSessionMutation);

  // const newOrderHandler = async () => {
  //   try {
  //     const res = await createStripeSession('Redirecting...', { gigId: params.id });
  //     if (res?.data?.url) {
  //       window.location.href = res.data.url; // Redirect to Stripe Checkout
  //     } else {
  //       console.error('Stripe URL not found');
  //     }
  //   } catch (err) {
  //     console.error('Stripe session creation failed:', err);
  //   }
  // };



  useEffect(() => {
    if (gigInfo?.gig?.creator) {
      getWorker({ workerId: gigInfo.gig.creator });
    }
  }, [gigInfo, gigCreator, getWorker]);

  if (isLoadingGig || isLoadingCreator) return <LayoutLoader/>;

  return (
    <div className='flex w-full flex-col md:flex-row gap-10 p-10 h-screen'>

      {newOrder && (
        <div className='fixed inset-0 bg-none bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-lg h-[70svh] overflow-y-auto'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4 border-b pb-2'>Confirm Your Order</h2>

            <div className='space-y-4'>
              {/* Gig Summary */}
              <div className='bg-gray-50 p-4 rounded-xl border'>
                <h3 className='text-xl font-semibold text-gray-700'>{gigInfo?.gig?.title}</h3>
                <p className='text-sm text-gray-600'>{gigInfo?.gig?.description?.slice(0, 100)}...</p>

                <div className='mt-2 flex flex-wrap gap-2 text-sm'>
                  <span className='bg-green-100 text-green-800 px-2 py-1 rounded'>
                    ₹{gigInfo?.gig?.price}
                  </span>
                  <span className='bg-purple-100 text-purple-800 px-2 py-1 rounded'>
                    {gigInfo?.gig?.deliveryTime} days delivery
                  </span>
                  <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded'>
                    {gigInfo?.gig?.revisions} revisions
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className='border-t pt-4'>
                <h4 className='text-lg font-semibold'>Order Summary</h4>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='text-gray-800 font-medium'>₹{gigInfo?.gig?.price}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Service Fee</span>
                  <span className='text-gray-800 font-medium'>₹{Math.ceil(gigInfo?.gig?.price * 0.05)}</span>
                </div>
                <div className='flex justify-between mt-2 border-t pt-2'>
                  <span className='font-semibold text-lg'>Total</span>
                  <span className='font-bold text-lg text-green-600'>
                    ₹{gigInfo?.gig?.price + Math.ceil(gigInfo?.gig?.price * 0.05)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className='mt-6 flex justify-between'>
              <button
                className='bg-gray-300 px-5 py-2 rounded-xl hover:bg-gray-400 transition'
                disabled={isLoadingNewOrder}
                onClick={() => setNewOrder(false)}
              >
                Cancel
              </button>
              <button
                className='bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition'
                onClick={newOrderHandler} // You can replace this with real logic
                disabled={isLoadingNewOrder}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gig Details */}
      {!toggleCreator && <div className='flex-1 bg-white shadow-lg rounded-2xl p-6 space-y-4 overflow-auto max-h-full'>
        <Link
          to='/'
          className='text-blue-800 flex items-center gap-2 w-fit border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50 transition-all'>
          <IoArrowBack />
          <span>Back</span>
        </Link>

        <h1 className='text-3xl font-bold text-gray-800'>{gigInfo?.gig?.title}</h1>
        <p className='text-gray-600'>{gigInfo?.gig?.description}</p>

        <div className='flex flex-wrap gap-4'>
          <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
            ₹{gigInfo?.gig?.price} total
          </span>
          <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
            {gigInfo?.gig?.deliveryTime} days delivery
          </span>
          <span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm'>
            {gigInfo?.gig?.revisions} revisions
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {gigInfo?.gig?.tags?.[0]?.split(',').map((tag, i) => (
            <span key={i} className='bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded'>
              #{tag.trim()}
            </span>
          ))}
        </div>
        <div>
          <div className='flex items-center gap-1 mt-4'>
            <FaStar className='text-yellow-500' />
            <span>{gigInfo?.gig?.ratings?.average}</span>
            <span>({gigInfo?.gig?.ratings?.count})</span>
          </div>
        </div>
        <div className='mt-4'>
          <img
            src={gigInfo?.gig?.gigImages?.[0]?.url || 'https://cdn.dribbble.com/userupload/16573490/file/original-86360b65d51ebcad69df73818d1f53a9.jpg?resize=400x0'}
            alt='Gig Preview'
            className='rounded-xl w-full h-64 object-cover'
          />
        </div>
        <div
          className='flex p-3 items-center gap-4 cursor-pointer border-1 border-blue-200 rounded-2xl hover:bg-blue-50 transition-all'
          onClick={browseCreator}

        >
          <img
            className='pfp'
            src={gigCreator?.worker?.picture?.url || 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/386c0b8f584977db82c71e4f78c778c2-1677686441502/27560ea0-c990-4abf-8964-2ca1a34db2fd.png'} alt="" />
          <span>{gigCreator?.worker?.name || 'Gig Creator'}</span>
        </div>


        {/* FAQ Section */}


        {/* Action Buttons */}
        <div className='mt-6 flex flex-col gap-4'>
          <button className='max-w-60 cursor-pointer   bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition'
            onClick={() => { setNewOrder(true) }}
          >
            Create New Order
          </button>
          {isQuestion ?
            <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-2xl space-y-4">
              <textarea
                className="w-full h-32 p-4 y-4 text-base text-gray-700 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Ask your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>

              <div className="flex gap-4 justify-end">

                <button
                  className=" px-5 cursor-pointer py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-200"

                  onClick={handleSubmitQuestion}
                >
                  Submit
                </button>

                <button
                  className="px-5 cursor-pointer py-2 bg-red-400 text-white font-semibold rounded-xl hover:bg-red-500 transition duration-200"
                  onClick={() => {
                    setIsQuestion(false)
                    setQuestion("")
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            : <button className='max-w-60 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition' onClick={handleAskQuestion}>
              Ask a Question
            </button>}

        </div>
        {gigInfo?.gig?.faq?.length > 0 && (
          <div className='mt-6 space-y-3'>
            <h3 className='text-xl font-semibold'>FAQs</h3>
            {gigInfo.gig.faq.map((faqItem, idx) => (
              <div key={idx} className='border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded'>
                <p className='font-semibold'>{faqItem.question}</p>
                <p className='text-gray-700'>{faqItem.answer || 'Unanswered'}</p>
              </div>
            ))}
          </div>
        )}
      </div>}

      {/* Creator Info */}
      {toggleCreator && <div className='flex-1 bg-white shadow-lg rounded-2xl p-6 space-y-4 overflow-auto max-h-full'>
        <button
          onClick={() => setToggleCreator(false)}
          className='text-blue-800 flex items-center gap-2 w-fit border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-50 transition-all'>
          <IoArrowBack />
          <span>Back</span>
        </button>
        <div className='flex items-center gap-4'>
          <img
            src={'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/386c0b8f584977db82c71e4f78c778c2-1677686441502/27560ea0-c990-4abf-8964-2ca1a34db2fd.png' || gigCreator?.worker?.picture?.url}
            alt='Creator'
            className='w-16 h-16 rounded-full object-cover'
          />
          <div>
            <h3 className='text-lg font-bold'>{gigCreator?.worker?.name}</h3>
            <p className='text-sm text-gray-500'>{gigCreator?.worker?.email}</p>
            <p className='text-sm text-gray-500'>Rating: {gigCreator?.worker?.rating?.average}</p>
          </div>
        </div>
        <p className='text-gray-700'>{gigCreator?.worker?.bio}</p>
        <div className='mt-4'>
          <h4 className='text-md font-semibold'>Skills:</h4>
          <div className='flex gap-2 flex-wrap mt-2'>
            {gigCreator?.worker?.skills.map((skill, idx) => (
              <span key={idx} className='bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm'>
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className='text-sm text-gray-500'>
          Contact: {gigCreator?.worker?.contact}<br />
          Address: {gigCreator?.worker?.address}
        </div>
      </div>}
    </div>
  )
}

export default BrowseGig
