import React from 'react';
import FreelancerCalendar from '../../components/Layouts/FreelancerCalendar';
import { useGetRandomFactQuery } from '../../redux/apis/factApi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { data: factData, isLoading } = useGetRandomFactQuery();
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="w-full min-h-screen p-6 flex gap-6 flex-col lg:flex-row items-start overflow-auto">
      {/* Left Section */}
      <motion.div
        className="flex-2 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-700 text-lg">
          Ready to slay those deadlines and earn that 💸?
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-black mb-2">Did you know?</h2>
          <p className="text-gray-600 italic">
            {isLoading ? 'Loading a fun fact...' : factData?.text}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 max-h-[900px] w-full bg-white rounded-lg shadow-lg p-4 h-fit "
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FreelancerCalendar />
      </motion.div>
    </div>
  );
};

export default Dashboard;
