import React from 'react';

const Profile = ({ user }) => {
  return (
    <div className="max-w-md w-full mx-auto mt-16 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-4xl font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">User Profile</h1>
        </div>

        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <div>
            <span className="font-medium text-gray-900">Name:</span>{' '}
            {user?.name || 'Not provided'}
          </div>
          <div>
            <span className="font-medium text-gray-900">Email:</span>{' '}
            {user?.email || 'Not provided'}
          </div>
          <div>
            <span className="font-medium text-gray-900">Role:</span>{' '}
            {user?.role || 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
