import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { dummyConversations, dummyProjects } from '../assets/assets';

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project>(null)

  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')
  const [menuOpen, setMenuOpen] = useState(false)

  const fetchProject = async () => {
    const project = dummyProjects.find(project => project.id === projectId)
    
    setTimeout(() => {
      if(project){
        setProject({...project, conversation: dummyConversations})
        setIsGenerating(project.current_code ? false : true)
        setLoading(false)
    }
    },2000)
  }

  useEffect(() => {
    fetchProject()
  })

  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center h-screen'>
          <Loader2Icon className='size-7 animate-spin text-violet-200' />
        </div>
      </>
    )
  }
  return project ? (
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <p className='text-2xl font-medium text-gray-200'>Unable to load projects!</p>
    </div>
  )
}

export default Projects