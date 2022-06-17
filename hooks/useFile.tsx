import useSWR from 'swr'

const fetcher = (url:string) => {
  return fetch(url).then(res => res.json())
}

export const useFile= (fileId:string | null )=>{
  const {data: file, error, mutate} = useSWR(fileId ? `/api/admin/get_file?fileId=${fileId}` : null, fetcher)
  const updateState = async (fileId: string, state: "accept" | "reject" | "delete", note: string | null )=>{
    const r = await fetch(`/api/admin/review?action=${state}&note=${note}&fileId=${fileId}`, {method: "POST"})
    return await r.json() 
  }
  return {file: file ? file[0] : null,error, updateState, mutate}
}
