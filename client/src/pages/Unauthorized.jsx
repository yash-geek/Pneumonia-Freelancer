import React from 'react';
import { Link } from 'react-router-dom';
import unauthorizedSvg from '../assets/unauthorized.svg';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <img
        src={unauthorizedSvg}
        alt="Unauthorized Access"
        className="w-72 md:w-96 mb-6"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">401 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        Oops... you’re not allowed to access this page. Maybe try logging in or go back home?
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
