import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div className='flex flex-col my-10 justify-center items-center'>
        <div className="loader w-32 h-32"></div>
        <span className="loader2 scale-75">Load&nbsp;ng</span>
    </div>
  )
}

export default Loader
