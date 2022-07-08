export interface UploadFileToS3Specs {
  url: string
  file: any
}

export const UploadFile = async ({ url, file }: UploadFileToS3Specs) => {
  const result = await fetch(url, {
    method: 'PUT',
    body: file
  })
    .then((response) => response.json())
    .then((result) => {
      return result
    })
    .catch((error) => {
      console.error('Error:', error)
      return error
    })
  return result
}
