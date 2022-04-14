import { S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
const REGION = "us-west-2"
const client = new S3Client({ region: REGION  });

const S3_BUCKET = "allofthedata"
const BASE_FOLDER = "histories/phone"

export const createOrUpdateUserRecord = async (phoneNo:string, user?:any) =>{
  const initial_data = {
    phoneNo: phoneNo,
    created_at: new Date(),
  }

  try{
    const result = client.send(new PutObjectCommand({
      Bucket:S3_BUCKET,
      Key: `${BASE_FOLDER}/${phoneNo}`,
      Body: JSON.stringify(user ? user : initial_data),
      ACL: "public-read"
    }) )
    return user ? user : initial_data 
  }
  catch(err){
    console.log("Failed to create initial user ", phoneNo, err)
  }
}

export const getUserRecord = async (phoneNo:string)=>{
    try{
      const resp = await fetch(`https://${S3_BUCKET}.s3.us-west-2.amazonaws.com/histories/phone/${encodeURIComponent(phoneNo)}`);
      const user = await resp.json();
      return user
    }
    catch{
      return null
    }
}

export const getOrCreateUserRecord = async (phoneNo: string) =>{
  const record = await getUserRecord(phoneNo);
  if(record){
    return record
  }
  else{
    return await createOrUpdateUserRecord(phoneNo)
  }
}
