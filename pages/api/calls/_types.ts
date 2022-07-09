export interface UserCallRecord{
  county? : string,
  numberHash: string 
  createdAt: Date,
  language: "en" | "es" 
  permission: boolean
}
