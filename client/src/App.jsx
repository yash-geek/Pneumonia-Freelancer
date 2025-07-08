import React, { lazy, Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import LayoutLoader from './components/Layouts/LayoutLoader'

import ProtectRoute from './components/Auth/ProtectRoute'


const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))

const user = true;
const App = () => {
  return (
    <Router>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route  
          element={<ProtectRoute user={user} />} >
          {// all important routes i'll put here
          }
          <Route path='/' element={<Home/>} />
          </Route>


          {
            //login below
          }
          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>
          } />
          
        </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </Router>
  )
}

export default App