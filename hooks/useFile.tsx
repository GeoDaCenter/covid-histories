import useSWR from 'swr'

const fetcher = (url:string) => {
  return fetch(url).then(res => res.json())
}

export const useFile= (fileId:string | null )=>{
  const {data: file, error, mutate} = useSWR(fileId ? `/api/admin/get_file?fileId=${fileId}` : null, fetcher)
  const updateState = (fileId: string, state: "accept" | "reject" | "delete", reason: string | null )=>{
    return fetch(`/api/admin/review?action=${state}&reason=${reason}&fileId=${fileId}`, {method:"POST"})
      .then(r=>r.json()) 
  }
  return {file: file ? file[0] : null,error, updateState}
}
