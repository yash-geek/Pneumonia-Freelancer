import React from 'react';

const Profile = ({ user }) => {
  console.log(user);

  return (
    
      <div className="bg-white shadow-md max-w-md w-full p-8 space-y-4 rounded-lg mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center border-b pb-3">Profile</h1>
        
        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
          <p><span className="font-medium text-gray-900">Name:</span> {user?.name || '—'}</p>
          <p><span className="font-medium text-gray-900">Email:</span> {user?.email || '—'}</p>
          <p><span className="font-medium text-gray-900">Role:</span> {user?.role || '—'}</p>
        </div>
      </div>
    
  );
};

export default Profile;
