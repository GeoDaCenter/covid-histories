import useSWR from 'swr'
import {TagFilter} from '../pages/api/files/utils'

const fetcher = (url:string) => {
  return fetch(url).then(res => res.json())
}

export const useSubmissions= (filter:TagFilter)=>{
  const {data: submissions, error, mutate} = useSWR(`/api/admin/list_uploads?filter=${filter}`, fetcher)
  return {submissions,error, mutate}
}
