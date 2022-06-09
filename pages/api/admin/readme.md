# Admin Endpoints

1. You must be logged in through that web browser and have the Admin user role with Auth0

## list_uploads

_Purpose_
Returns a list of relevant uploads

_Query Parameters_
- filter: 'unreviewed' | 'approved' | 'rejected' | 'all' 
 > Filters entries based on current tags

_Returns_
- Array of entry information with AWS Key, file ID with generated user and file ID, and last modified date
```
UploadInfo {
	Key: string | undefined
	fileId: string | undefined
	LastModified: Date  | undefined
}
```

_Example_

`stories.uscovidatlas.org/api/admin/list_uploads?filter=unreviewed`

## get_file

_Purpose_
Retrieves presigned get URLs and metadata for a given file

_Query Parameters_
- fileId: string
 > Retrieves files that match a given ID

_Returns_
- JSON containing the submission metadata (title, county, centroid, consent, etc.) and an array `content` with URLs and fileTypes to access files:
```
[
    {
        'title':'my story',
        'county': {
            'label': 'County, State',
            'value': 12345,
            'centroid': [0,0],
        },
        "storyId":"7D2r4hsEoZiJXEVj6q2vV",
        "storyType":"video",
        'consent': true,
        'tags': ['user-added-tags'],
        'date':'1970-01-01',
        'content':[
            {
                'url':'http://aws.s3...',
                'fileName': 'uploads/...',
                'fileType': 'webm'
            }
        ]
    }
]
```

Note, Image entries will have two files, the image itself (variable filetype based on entry) and a caption markdown file.

_Example_

`stories.uscovidatlas.org/api/admin/get_file?fileId=ca78f7aa4c7910cde9c9cf4d139fff27abcfc711/7D2r4hsEoZiJXEVj6q2vV`

## review

_Purpose_
Tags files for a given fileId (metadata, media files) based on an admin review. Approved files will be tagged with `approved: true`, `reviewed: true`, and `reviewed_by: user`. rejected the same, but `approved: false`, and deleted entries will be immediately deleted.

_Query Parameters_
- fileId: string
 > Specifies the files to act on
- action: 'approve' | 'reject' | 'delete'
 > The action to take on a given file

_Returns_
Response from AWS to confirm action success for each file tagged
```
{
    "files": [
        {
            "$metadata": {
                "httpStatusCode": 200,
                ...
            }
        }
    ]
}
```

_Example_

`stories.uscovidatlas.org/api/admin/review?fileId=ca78f7aa4c7910cde9c9cf4d139fff27abcfc711/7D2r4hsEoZiJXEVj6q2vV&action=approve`
