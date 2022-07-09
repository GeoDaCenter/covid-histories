import crosswalk from './zip_county_crosswalk.json'

type CountyDetails = {
  CountyName: string
  zip: string
  CountyFIPS: string
  res_ratio: 0.9768957346
}
export const zip_to_counties = (zip_no: string): Array<CountyDetails> => {
  let cross = crosswalk as Array<CountyDetails>
  return cross
    .filter((f) => f.zip === zip_no)
    .sort((a: CountyDetails, b: CountyDetails) =>
      a.res_ratio > b.res_ratio ? 1 : -1
    )
}
