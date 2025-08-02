import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LayoutLoader from './components/Layouts/LayoutLoader'

import ProtectRoute from './components/Auth/ProtectRoute'
import ClientLayout from './components/Layouts/ClientLayout'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { server } from './constants/config'
import { userExists, userNotExists } from './redux/reducers/auth'
import Chat from './pages/Chat'
import Dashboard from './pages/worker/Dashboard'
import ManageOrders from './pages/worker/ManageOrders'
import MyGigs from './pages/worker/MyGigs'
import WorkerProfile from './pages/worker/WorkerProfile'
import BrowseMyGig from './pages/worker/BrowseMyGig'

// Lazy load your pages
const Home = lazy(() => import("./pages/client/Home"))
const Login = lazy(() => import("./pages/Login"))
const Unauthorized = lazy(() => import("./pages/Unauthorized"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Orders = lazy(() => import("./pages/client/Orders"))
const Profile = lazy(() => import("./pages/Profile"))
const BrowseGig = lazy(() => import("./pages/client/BrowseGig"))

// Dummy role-based components
// const ClientProfile = lazy(() => import('./pages/ClientProfile'))
// const ClientOrders = lazy(() => import('./pages/ClientOrders'))
// const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'))
// const WorkerTasks = lazy(() => import('./pages/WorkerTasks'))



// {
//   name: 'Yash-kun',
//   role: 'client', // try changing to 'worker' or null
// }



const App = () => {
  const { user, loader } = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/api/v1/user/role`, { withCredentials: true })
      .then(({ data }) => {
        const role = data.role;

        if (role === 'client') {
          axios.get(`${server}/api/v1/client/getclient`, { withCredentials: true })
            .then(({ data }) => dispatch(userExists({ ...data.user, role: 'client' })))
            .catch(() => dispatch(userNotExists()));

        } else if (role === 'worker') {
          axios.get(`${server}/api/v1/worker/getworker`, { withCredentials: true })
            .then(({ data }) => dispatch(userExists({ ...data.user, role: 'worker' })))
            .catch(() => dispatch(userNotExists()));
        }
      })
      .catch(() => dispatch(userNotExists()));
  }, []);
  useState(() => {
    console.log('User role:', user?.role);
  }, [user]);

  if (loader) return <LayoutLoader />;

  return (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        {!user && location.pathname !== '/login' && <Navigate to="/login" replace />}
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* CLIENT Routes */}
          {user?.role === 'client' && (
            <>
              <Route path="/" element={<ClientLayout Component={Home} />} />
              <Route path="/orders" element={<ClientLayout Component={Orders} />} />
              <Route path="/profile" element={<ClientLayout Component={Profile} user={user} />} />
              <Route path="/gig/:id" element={<ClientLayout Component={BrowseGig} />} />
              <Route path="/chat/:orderId" element={<ClientLayout Component={Chat} />} />
            </>
          )}

          {/* WORKER Routes */}
          {user?.role === 'worker' && (
            <>
              {/* You can change layout for workers here */}
              <Route path="/" element={<ClientLayout Component={Dashboard} />} />
              <Route path="/manageorders" element={<ClientLayout Component={ManageOrders} />} />
              <Route path="/gigs" element={<ClientLayout Component={MyGigs} />} />
              <Route path="/profile" element={<ClientLayout Component={WorkerProfile} />} />
              <Route path="/gigs/:id" element={<ClientLayout Component={BrowseMyGig} />} />
            </>
          )}
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};


export default App
