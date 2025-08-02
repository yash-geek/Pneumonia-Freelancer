import React, { useEffect, useState } from 'react';
import { useCreateGigMutation, useGetMyGigsQuery, useGetProfileQuery } from '../../redux/apis/api';
import addProfileImg from '../../assets/addprofile.svg';
import { useNavigate } from 'react-router-dom';
import MyGigItem from '../../components/specifics/MyGigItem';
import { RxCross2 as CancelIcon } from 'react-icons/rx';
import { useFileHandler } from '6pp'
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../../hooks/hook';

const MyGigs = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProfileQuery();
  const { data: myGigsData} = useGetMyGigsQuery();

  const [create, setCreate] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [description, setDescription] = useState('');
  const [activityStatus, setActivityStatus] = useState(false);
  const [price, setPrice] = useState('');
  const [revisions, setRevisions] = useState('');
  const [tags, setTags] = useState(['']);
  const image = useFileHandler('single')
  const handleTagsChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  const addTag = () => setTags([...tags, '']);
  const [createGigTrigger, isLoadingCreateGig] = useAsyncMutation(useCreateGigMutation);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !category || !subCategory || !deliveryTime || !description || !price || !revisions || tags.some(tag => tag.trim() === '')) {
       return toast.error('Please fill all the fields');
    }

    
    const formData = new FormData();
    formData.append('gigImage', image.file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('deliveryTime', deliveryTime);
    formData.append('description', description);
    formData.append('isActive', activityStatus);
    formData.append('price', price);
    formData.append('revisions', revisions);
    formData.append('tags', tags.join(','));
   
    try {
        const res = await createGigTrigger('Creating New Gig', formData)
      }
      catch(err) {
        toast.error('Something went wrong!!!'+err)
      }
      finally {
        setCreate(false);
      }


  };


  useEffect(() => {
    if (myGigsData) console.log(myGigsData);
  }, [isLoading, data, myGigsData]);

  return data?.status ? (
    <div className="max-w-full gap-6 flex px-2 py-6 flex-wrap justify-start">
      {create && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white p-6 pt-12 rounded-2xl max-h-[90vh] shadow-2xl w-full max-w-lg overflow-y-auto space-y-5 scrollbar-thin-pretty"
          >
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setCreate(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              <CancelIcon />
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-indigo-600 text-center mb-4">Create New Gig</h2>

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
                  onChange={(e) => setActivityStatus(e.target.value === 'true')}
                  className="w-full max-w-svw p-3 mt-1 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="space-y-2">
                  {tags.map((tag, index) => (
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
                    className="text-indigo-600 hover:underline text-sm font-medium mt-1"
                  >
                    + Add another tag
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoadingCreateGig}
              className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-200"
            >
              Create Now
            </button>
          </form>
        </div>
      )}



      <div className="p-4 max-w-md rounded-xl shadow-lg bg-white space-y-3 mx-auto flex flex-col items-center">
        <h2 className="text-xl font-bold text-purple-600"> Create Your First Gig </h2>
        <img
          src={'https://media.istockphoto.com/id/1093969078/photo/question-mark.jpg?s=612x612&w=0&k=20&c=Q-_NX_ofvmuR6l7Uaprmm5YGTL9CXsJ41rfsqbobbH8='}
          alt="Gig Placeholder"
          className="w-full h-48 object-cover rounded-lg"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl cursor-pointer" onClick={() => setCreate(true)}>
          Create New
        </button>
      </div>

      {myGigsData?.userGigs?.map((gig, idx) => (
        <MyGigItem key={gig._id || idx} gig={gig} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 justify-center h-full w-full p-4">
      <img className="w-40" src={addProfileImg} alt="Add Profile" />
      <span>You don't have a Freelancer profile yet, create one now</span>
      <button
        onClick={() => navigate('/profile')}
        className="w-40 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl"
      >
        Go to Profile
      </button>
    </div>
  );
};

export default MyGigs;