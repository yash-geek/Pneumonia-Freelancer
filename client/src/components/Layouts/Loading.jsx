import React from 'react'
import { ScaleLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <ScaleLoader
                height={'10vh'}
                speedMultiplier={1.2}
            />
        </div>
    )
}

export default Loading
