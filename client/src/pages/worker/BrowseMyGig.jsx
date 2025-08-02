import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IoArrowBack as BackIcon } from 'react-icons/io5'
import { FaStar as StarIcon } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useAnswerFaqMutation, useGetMyGigInfoQuery, useUpdateMyGigMutation } from '../../redux/apis/api'
import { useFileHandler } from '6pp'
import toast from 'react-hot-toast'
import { useAsyncMutation } from '../../hooks/hook'
const BrowseMyGig = (


) => {
  const location = useLocation();
  const gigId = location.pathname.split('/').pop();
  const { data: gigInfo, isLoading } = useGetMyGigInfoQuery({ id: gigId });
  console.log(gigInfo);


  const [faqList, setFaqList] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [description, setDescription] = useState('');
  const [activityStatus, setActivityStatus] = useState(false);
  const [price, setPrice] = useState('');
  const [revisions, setRevisions] = useState('');
  const [tags, setTags] = useState([]);
  const image = useFileHandler('single')
  const handleTagsChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };
  const [updateGigTrigger, isLoadingUpdateGig] = useAsyncMutation(useUpdateMyGigMutation);

  const handleGigSave = async (e) => {
    if (!image || !title || !category || !subCategory || !deliveryTime || !description || !price || !revisions || tags.some(tag => tag.trim() === '')) {
      return toast.error('Please fill all the fields');
    }
    console.log('isActive', activityStatus)


    const formData = new FormData();
    formData.append('gigImage', image.file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('deliveryTime', deliveryTime);
    formData.append('description', description);
    formData.append('isActive', activityStatus === 'true');
    formData.append('price', price);
    formData.append('revisions', revisions);
    formData.append('tags', tags.join(','));
    try {
      const res = await updateGigTrigger('Saving Update', { _id: gigId, formData })
    }
    catch (err) {
      toast.error('Something went wrong!!!' + err)
    }
    finally {
      console.log('done')
    }


  };

  const handleFaqAnswerChange = (id, newAnswer) => {
    setFaqList(prev =>
      prev.map(item =>
        item._id === id ? { ...item, answer: newAnswer } : item
      )
    );
  };
  const [answerFaqTrigger, isLoadingAnswerFaq] = useAsyncMutation(useAnswerFaqMutation)
  const handlePostAnswer = (id) => {
    const targetFaq = faqList.find(item => item._id === id);
    console.log('Posting answer:', targetFaq);
    answerFaqTrigger('Posting Answer', { _id: id, answer: targetFaq.answer, gigId })
      .then((response) => {
        console.log('Answer posted successfully:', response);
      })
      .catch((error) => {
        console.error('Error posting answer:', error);
      });
    // TODO: replace with actual API call
    // await postAnswerToBackend(id, targetFaq.answer)
  };

  const addTag = () => setTags([...tags, '']);

  const [isQuestion, setIsQuestion] = useState('')
  const handleAskQuestion = () => { }
  useEffect(() => {
    console.log(gigInfo);
    setTitle(gigInfo?.userGig?.title)
    setCategory(gigInfo?.userGig?.category)
    setSubCategory(gigInfo?.userGig?.subCategory)
    setDeliveryTime(gigInfo?.userGig?.deliveryTime)
    setDescription(gigInfo?.userGig?.description)
    setActivityStatus(gigInfo?.userGig?.isActive)
    setPrice(gigInfo?.userGig?.price)
    setRevisions(gigInfo?.userGig?.revisions)
    setTags(gigInfo?.userGig?.tags?.flatMap(tag => tag.split(',').map(t => t.trim())))
    setFaqList(gigInfo?.userGig?.faq || [])

  }, [gigInfo]);


  return (
    <div className='bg-white shadow-lg space-y-4 md:overflow-hidden overflow-y-auto max-h-screen h-screen w-full flex flex-col md:flex-row relative'>
      <div className='bg-white flex-1 md:overflow-y-auto space-y-5 scrollbar-thin-pretty pt-20 p-4'>

        <Link
          to='/gigs'
          className='bg-blue-800 absolute left-6 top-6 flex items-center gap-2 w-fit text-white border z-20 border-blue-500 px-4 py-1 rounded-full hover:bg-blue-700 transition-all'>
          <BackIcon />
          <span>Back</span>
        </Link>




        {/* Heading */}


        {/* Fields */}
        <div className="space-y-4 flex flex-col">

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Gig Title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gig Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={image.changeHandler}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0 file:text-sm file:font-semibold
      file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
            {image.preview && (
              <img
                src={image.preview}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border"
              />
            )}
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Category"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Category</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Sub Category"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Time (in days)</label>
            <input
              type="number"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={4}
              placeholder="Describe your gig"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Revisions</label>
            <input
              type="number"
              value={revisions}
              onChange={(e) => setRevisions(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Status</label>
            <select
              value={activityStatus}
              onChange={(e) => setActivityStatus(e.target.value)}
              className="w-full p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>


          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="space-y-2">
              {tags?.map((tag, index) => (
                <input
                  key={index}
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  placeholder={`Tag ${index + 1}`}
                  className="w-full p-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              ))}
              <button
                type="button"
                onClick={addTag}
                disabled={isLoadingUpdateGig}
                className="text-indigo-600 hover:underline text-sm font-medium mt-1"
              >
                + Add another tag
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button

          onClick={handleGigSave}
          disabled={isLoadingUpdateGig}
          className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-200"
        >
          Save
        </button>


      </div>
      <div className='md:bg-blue-200 md:flex-1 md:overflow-y-auto p-6 space-y-4 scrollbar-thin-pretty'>
        <h2 className='text-2xl font-bold text-gray-800'>FAQs</h2>
        {faqList?.map((faq, idx) => (
          <div key={faq._id} className='bg-white shadow rounded-xl p-4 space-y-2'>
            <p className='font-semibold text-gray-800'>
              Q{idx + 1}: {faq.question}
            </p>

            <textarea
              className='w-full h-24 p-3 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
              placeholder='Write your answer here...'
              value={faq.answer}
              onChange={(e) => handleFaqAnswerChange(faq._id, e.target.value)}
            />

            <button
              onClick={() => handlePostAnswer(faq._id)}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              Post Answer
            </button>
          </div>
        ))}
      </div>



    </div>

  )
}

export default BrowseMyGig