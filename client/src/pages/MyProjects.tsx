import React, { useEffect } from 'react'
import type { Project } from '../types';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';

const MyProjects = () => {
  const {data: session, isPending} = authClient.useSession()

  const [loading, setLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try{
      const {data} = await api.get(`/api/user/projects`);
      setProjects(data.projects)
      setLoading(false)
    } catch (error: any){
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteProject = async (projectId : string) => {
    try{
      const confirm = window.confirm('Are you sure you want to delete this project?')
      if(!confirm) return;

      const {data} = await api.delete(`/api/project/${projectId}`);
      toast.success(data.message)
      
      fetchProjects()
    } catch (error: any){
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(()=> {
    if(session?.user && !isPending){
      fetchProjects();
    }else if(!isPending && !session?.user){
      navigate('/')
      toast("Please login to view your projects")
    }  
  }, [session?.user])

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
                  group-hover:shadow-indigo-700/30 hover:border-indigo-800/80 cursor-pointer w-72
                  transition-all duration-300 shadow-md flex-col'>
                  {/* preview img*/}
                  <div className='relative w-full h-40 shrink-0 bg-gray-900 overflow-hidden border-b border-gray-800'>
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
                  <div className='p-4 text-white flex-1 flex flex-col group-hover:bg-indigo-950/40 transition-colors duration-300'>
                    <div className='flex items-start justify-between'>
                      <h1 className='line-clamp-2 font-medium text-lg'>{project.name}</h1>
                      <button className='bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full
                        text-xs mt-1 ml-2 '>Website</button>
                    </div>
                    <p className='line-clamp-2 text-gray-400 mt-1 text-sm'>{project.initial_prompt}</p>

                    <div onClick={(e) => e.stopPropagation()}
                      className='flex justify-between items-center mt-auto pt-6'>
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