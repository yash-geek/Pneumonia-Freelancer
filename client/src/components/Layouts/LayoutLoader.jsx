import React from 'react'
import {ScaleLoader} from 'react-spinners'
const LayoutLoader = () => {
  return (
    <div
    className='bg-gray-300 h-svh w-svw flex items-center justify-center'
    >
        <ScaleLoader
       
        height={'10vh'}
        
        speedMultiplier={1.2}
        
        />


        
    </div>
  )
}

export default LayoutLoader