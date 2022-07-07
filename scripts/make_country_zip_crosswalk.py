import pandas as pd 

# Data sources 
source_url = 'https://www.huduser.gov/portal/datasets/usps/ZIP_COUNTY_122021.xlsx'
county_names_url = "https://raw.githubusercontent.com/ChuckConnell/articles/master/fips2county.tsv"

# Load data
crosswalk = pd.read_excel(source_url, dtype={'zip':str, 'county':str})
county_names = pd.read_table(county_names_url, dtype={"CountyFIPS":str})

# Drop any combination where the residential ratio is zero
crosswalk = crosswalk[crosswalk['res_ratio'] >0]

# Merge names and limit columns 
result = pd.merge( crosswalk, county_names, left_on="county", right_on="CountyFIPS")[['CountyName','CountyFIPS', 'res_ratio','zip']]

counts = result.groupby("zip").count()

with open("../utils/zip_county_crosswalk.json",'w') as f :
    f.write(result.to_json(orient='records'))
