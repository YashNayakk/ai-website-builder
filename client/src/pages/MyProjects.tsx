import React, { useEffect } from 'react'
import type { Project } from '../types';
import { dummyProjects } from '../assets/assets';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const MyProjects = () => {
  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate()

  const fetchProjects = async () => {
    setProjects(dummyProjects)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const deleteProject = async (id : string) => {
    
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <div className='flex items-center justify-center h-[80vh]'>
            <Loader2Icon className='size-7 animate-spin text-indigo-200' />
          </div>
        ) : projects?.length > 0 ? (
          <div className='min-h-[80vh] py-10'>
            <div className='flex items-center justify-between mb-12'>
              <h1 className='text-2xl text-white font-medium'>My Projects</h1>
              <button onClick={() => navigate(`/`)} className='flex items-center gap-2 bg-linear-to-br from-indigo-500 to-indigo-600 hover:opacity-90
                rounded px-3 sm:px-6 sm:py-2 py-1 text-white active:scale-95 transition-all'>
                <PlusIcon size={18} /> Create project
              </button>
            </div>

            <div className='flex flex-wrap gap-3.5'>
              {projects.map((project) => (
                <div onClick={() => navigate(`/projects/${project.id}`)} key={project.id} className='relative group bg-gray-900/60 overflow-hidden border border-gray-700
                  group-hover:shadow-indigo-700/30 hover:border-indigo-800/80 cursor-pointer w-72 rounded-lg max-sm:mx-auto
                  transition-all duration-300 shadow-md'>
                  {/* preview img*/}
                  <div className='relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800'>
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        className='absolute top-0 left-0 w-300 h-200 origin-top-left pointer-events-none'
                        sandbox='allow-script allow-same-origin'
                        style={{ transform: 'scale(0.25)' }}
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full text-gray-500'>
                        <p>No Preview</p>
                      </div>
                    )}
                  </div>

                  {/*content */}
                  <div className='p-4 text-white bg-linear-180 from-transparent group-hover:bg-indigo-950 to-transparent transition-colors'>
                    <div className='flex items-start justify-between'>
                      <h1 className='line-clamp-2 font-medium text-lg'>{project.name}</h1>
                      <button className='bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full
                        text-xs mt-1 ml-2 '>Website</button>
                    </div>
                    <p className='line-clamp-2 text-gray-400 mt-1 text-sm'>{project.initial_prompt}</p>

                    <div onClick={(e) => e.stopPropagation()}
                      className='flex justify-between items-center mt-6'>
                      <span className='text-xs text-gray-500'>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className='flex gap-3 text-white text-sm'>
                        <button onClick={() => navigate(`/preview/${project.id}`)} className='px-3 py-1.5 bg-white/10 
                      hover:bg-white/15 rounded-md transition-all'>Preview</button>
                        <button onClick={() => navigate(`/projects/${project.id}`)} className='px-3 py-1.5 bg-white/10 
                      hover:bg-white/15 rounded-md transition-all'>Open</button>
                      </div>
                    </div>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <TrashIcon onClick={() => deleteProject(project.id)} className='absolute top-3 right-3 scale-0 
                  group-hover:scale-100 bg-white p-1.5 size-7
                  rounded text-red-500 text-xl cursor-pointer transition-all'/>
                  </div>


                </div>
              )
              )}
            </div>
          </div>
        ) : (
          <div className='flex items-center flex-col justify-center h-[80vh]'>
            <p className='text-3xl font-semibold text-gray-300'>You habe no projects yet!</p>
            <button onClick={() => navigate(`/`)} className='bg-indigo-500 text-white px-5 py-2 rounded-md mt-5 hover:bg-indigo-600 active:scale-95 transition-all'>Create new</button>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default MyProjects