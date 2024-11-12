import {useEffect, useState} from 'react'

export const useFecth = (url) => {

  const [state,setState] = useState({
    data:null,
    isLoading:null,
    errors:null
  })

  const {data,isLoading,errors} = state

  useEffect(()=>{getFetch()},[url])

  const getFetch=async(url)=>{
    if(!url)return
    try{
    const res = await fetch(url)
    const getdata = await res.json() 
    setState({
        data:getdata,
        isLoading:false,
        error:null
    })
    }catch(e){
        setState({
            data:null,
            isLoading:false,
            error:e
        })
    }
  }

  return {
    data,
    isLoading,
    errors
  }
}
