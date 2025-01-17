import React from 'react'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'
import { ChartsContainer, StatsContainer } from '../components'
import { useQuery } from '@tanstack/react-query'

const statsQuery = {
  queryKey: ['stats'],
  queryFn: async() => {
    const response = await customFetch.get('/jobs/stats')
    return response.data
  }
}
// loader is not a hook
// becomes a function which return a function
export const loader = (queryClient) => async() => {
  const data = await queryClient.ensureQueryData(statsQuery)
  return data
}
const Stats = () => {
  //const { defaultStats, monthlyApplications } = useLoaderData()
  const data = useQuery(statsQuery)
  const { defaultStats, monthlyApplications } = data.data
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {
        monthlyApplications?.length>1 && 
        (<ChartsContainer data={monthlyApplications} />)
      }
    </>
  )
}

export default Stats