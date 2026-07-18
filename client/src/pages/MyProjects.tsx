import React, { useEffect, useState } from 'react'
import type { Project } from '../types';
import { dummyProjects } from '../assets/assets';

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    setProjects(dummyProjects)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <>
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        {loading ? (
          <div></div>
        ) : projects.length > 0 ? (
          <div></div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  )
}

export default MyProjects