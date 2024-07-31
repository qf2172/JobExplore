import React from 'react'
import customFetch from '../utils/customFetch'
import { redirect, useLoaderData } from 'react-router-dom'
import Wrapper from '../assets/wrappers/StatsContainer'
import StatItem from '../components/StatItem'
import { FaCalendarCheck, FaSuitcaseRolling } from 'react-icons/fa'
export const loader = async() => {
  try {
    const responses = await customFetch.get('/users/admin/app-stats')
    console.log(responses)
    return responses.data
  } catch (error) {
    toast.error('You are not authorized to view this page')
    return redirect('/dashboard')
  }
}
const Admin = () => {
  const { user, Jobs } = useLoaderData()
  console.log(useLoaderData())
  console.log(Jobs)
  console.log(user)

  return (
    <Wrapper>
      <StatItem title='current users' count={user} 
      color='#e9b949' 
      bcg={'#fcefc7'} 
      icon ={<FaSuitcaseRolling />} />
      <StatItem title='total job' count={Jobs}
      color='#647acb'
      bcg='#e0e8f9'
      icon={<FaCalendarCheck />}
      />
    </Wrapper>
  )
}

export default Admin