import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit as EditIcon } from 'react-icons/fa'
import addProfileImg from '../../assets/addprofile.svg';
import { useAsyncMutation } from '../../hooks/hook'
import {
  isValidEmail,
  isValidPhoneNumber,
  useFileHandler,
  useInputValidation,
} from '6pp';
import { useCreateProfileMutation, useGetProfileQuery, useUpdateProfileMutation } from '../../redux/apis/api';

const WorkerProfile = () => {
  const [edit, setEdit] = useState(false)
  const [create, setCreate] = useState(false)
  const [name, setName] = useState('');
  const avatar = useFileHandler('single');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [skills, setSkills] = useState(['']);

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };
  const { data, isLoading, refetch } = useGetProfileQuery()
  const [createProfileTrigger, isLoadingCreateProfile] = useAsyncMutation(useCreateProfileMutation);
  const [updateProfileTrigger, isLoadingUpdateProfile] = useAsyncMutation(useUpdateProfileMutation);

  const handleSubmit = async (e) => {
    e.preventDefault();




    console.log(name, email, avatar.file)
    if (!name || !email || !contact || !address) {
      return toast.error('Please fill all required fields!');
    }


    const formData = new FormData();
    formData.append('name', name);
    formData.append('picture', avatar.file); // single file
    formData.append('bio', bio);
    formData.append('email', email);
    formData.append('contact', contact);
    formData.append('address', address);
    skills
      .filter(skill => skill.trim() !== '')
      .forEach(skill => formData.append('skills[]', skill));

    console.log([...formData.entries()]);
    if (data?.workerProfile) {
      console.log('profile present')
      try {
        const res = await updateProfileTrigger('Updating Your Profile', formData)
        if (res?.success) {
          await refetch();
        }
      }
      catch(err) {
        toast.error('Something went wrong!!!'+err)
      }
      finally {
        setEdit(false);
      }
    }
    else {
      try {
        const res = await createProfileTrigger('Creating Your Profile', formData)
        if (res?.success) {
          await refetch();
        }
      }
      catch(err) {
        toast.error('Something went wrong!!!'+err)
      }
      finally {
        setEdit(false);
      }
    }
  };

  useEffect(() => {
    if (data?.status) {
      console.log(data)
      setName(data?.workerProfile?.name)
      setBio(data?.workerProfile?.bio)
      setAddress(data?.workerProfile?.address)
      setEmail(data?.workerProfile?.email)
      setContact(data?.workerProfile?.contact)
      setSkills([...(data?.workerProfile?.skills ?? [])]);


    }
  }, [isLoading, data])



  return (
    (data?.status || create)
      ?
      <div className="flex gap-2 flex-col justify-center items-center w-full bg-white px-4 py-10">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="p-8 bg-gray-100 shadow-xl flex flex-col rounded-2xl w-full max-h-[100%] overflow-y-auto space-y-6"
        >

          <h2 className="text-2xl font-bold text-gray-800 text-center">Worker Profile</h2>
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600 font-medium">Profile Picture:</label>

            {/* Custom file input */}
            {edit && (
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition duration-200">
                  Upload Image
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={avatar.changeHandler}
                    className="hidden"
                  />
                </label>

                {avatar.file && (
                  <span className="text-sm text-gray-700 truncate max-w-[150px]">
                    {avatar.file.name}
                  </span>
                )}
              </div>
            )}


            {/* Preview image */}
            {avatar.preview && edit && (
              <img
                src={avatar.preview}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-4 object-cover border-2 border-indigo-300 shadow-md"
              />
            )}
            {
              !edit && data?.workerProfile && <img
                src={data?.workerProfile?.picture?.url}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-4 object-cover border-2 border-indigo-300 shadow-md"
              />
            }

          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Name:</label>
            <input
              disabled={!edit}
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Email:</label>
            <input
              disabled={!edit}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              className="p-3 rounded-xl border border-gray-300"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Contact:</label>
            <input
              disabled={!edit}
              type="tel"
              value={contact}
              onChange={(e) => { setContact(e.target.value) }}
              className="p-3 rounded-xl border border-gray-300"
              placeholder="Phone number"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Address:</label>
            <input
              disabled={!edit}
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value) }}
              className="p-3 rounded-xl border border-gray-300"
              placeholder="Your Address"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Bio:</label>
            <input
              disabled={!edit}
              type="text"
              value={bio}
              onChange={(e) => { setBio(e.target.value) }}
              className="p-3 rounded-xl border border-gray-300"
              placeholder="Tell us about yourself~"
            />
          </div>



          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-600">Skills:</label>
            {skills.map((skill, index) => (
              <input
                disabled={!edit}
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
                className="p-3 rounded-xl border border-gray-300 mb-2"
              />
            ))}
            <button

              disabled={!edit}
              type="button"
              onClick={addSkill}
              className={`text-indigo-600 hover:underline text-sm ${!edit && 'hidden'}`}
            >
              + Add another skill
            </button>
          </div>

          {
            edit && <button
              disabled={isLoadingCreateProfile && isLoadingUpdateProfile}
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-200"
            >
              Update Profile
            </button>

          }
        </form>
        {
          !edit && <button
            type="button"
            className="w-[50%] bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 flex justify-center items-center gap-4 rounded-xl transition duration-200"
            onClick={() => setEdit(true)}
          >
            <EditIcon />
            Edit Profile
          </button>
        }
      </div>
      :
      <div className='flex flex-col items-center gap-3 justify-center h-full w-full'>
        <img className='w-40' src={addProfileImg} alt="Add Profile" />
        <span>You don't have a profile yet, create one now</span>
        <button
          type="button"
          disabled={isLoadingCreateProfile}
          className="w-40 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 flex justify-center items-center gap-4 rounded-xl transition duration-200"
          onClick={() => setCreate(true)}
        >
          <EditIcon />
          Create Profile
        </button>
      </div>
  );
};

export default WorkerProfile;
