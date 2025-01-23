import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({item}) => {
  return (
    <div className='w-[19rem]'>  
      <Link to="/">
        <div className='border-2 rounded-md mx-5 h-full cursor-pointer'>
            <img src={item.img}  className="w-full h-[70%] object-cover rounded-t-md " />
            <div className='flex items-center gap-2 p-5'>
                <img src={item.pp} className='w-[50px] h-[50px] rounded-full' />
                <div className='text-xs '>
                    <p className='font-semibold'>{item.cat}</p>
                    <span>{item.username}</span>
                </div>
            </div>
        </div>
      </Link>
    </div>
  )
}

export default ProjectCard
