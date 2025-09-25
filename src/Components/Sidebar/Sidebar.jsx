// import React from 'react'

function Sidebar() {
  return (
    <div className='h-[100vh]'>
       <nav className='flex items-center gap-50 '>
        <span className='bg-gray-4 pl-20 text-4xl relative top-5 font-bold'>
             <span className="text-orange-500 ">G</span>
              <span>o</span>
              <span className="text-orange-500">G</span>
              <span>ru</span>
              <span>b</span>
              <span>.</span>
            </span>
            <div className='text-4xl font-bold text-amber-600 relative top-5 left-100'>
                <h1>Admin Panel</h1>
            </div>
       </nav>
      
    </div>
  )
}

export default Sidebar
