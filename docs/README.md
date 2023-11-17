# covid-histories developer documentation

## Getting Started

Create `.env` from example and update variables as needed:

```bash
cp .env.example .env
```

Update variables as needed (see [Environment Variables](#environment-variables))

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `pages/index.tsx`. The page
auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on
[http://localhost:3000/api/hello](http://localhost:3000/api/hello). This
endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are
treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead
of React pages.

## Build for deployment

If you want to build the site locally you can use this command:

```bash
yarn build
```

However, in production this is entirely handled by Netlify, the site is rebuilt on pushed to this repo.

Overview of entire production infrastructure.

![build infrastructure diagram](./img/build-infrastructure.jpg)

## NextJS

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

## AWS Configuration

The following resources must be provisioned in AWS. Enviroment variables will be used to connect to these resources.

### Prerequisite Resources

Set up the following resources ahead of time. You will be putting information from these resource into environement variables (`.env.local`).

#### S3 Bucket

Create a new S3 bucket. During creation, leave ACLs disabled and disable the "Block *all* public access" setting. Once created, do the following:

1. Edit the bucket policy directly with the following content. Make sure to update `<bucket-name>` appropriately.
    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
            "Sid": "CDN-Allow",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket-name>/public/*"
        },
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket-name>/site_videos/*"
        }
      ]
    }
    ```
2. Edit the CORS policy:
    ```
    [
      {
        "AllowedHeaders": [
          "*"
        ],
      "AllowedMethods": [
          "GET",
          "PUT",
          "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
      }
    ]
    ```
3. Finally, create a new folder in the root of the bucket called `public`. (Other folders will be created automatically as needed.)

The name of this bucket and the region it was created should be placed in the `APP_AWS_BUCKET` and `APP_AWS_REGION` environment variables, respectively.

#### CloudFront Distribution

Create a new CloudFront distribution with an origin that points to the S3 bucket. Set the origin path to `/public`. WAF: Do not enable security protections.

The id should be placed in `APP_AWS_CLOUDFRONT_DISTRIBUTION_ID`.

#### IAM user

An IAM user must exist with the following permissions:

- CloudFront
    - Actions Allowed
        - `CreateInvalidation`
    - Resources
        - distribution: Distribution ID from above.
- S3
    - Actions Allowed
        - `ListBucket`
        - `GetObject`
        - `GetObjectTagging`
        - `DeleteObject`
        - `PutObject`
        - `PutObjectTagging`
        - `PutObjectAcl`
    - Resources
        - bucket: `<bucket-name>`
        - object: *Any* 
  
For best practices, create a new policy `s3PresignedUploader` and attach these permissions to it.

Then create a new user `S3HistoriesUploader` (do not enable console access) and attach this policy to the user.

Create an access key (CLI). Copy the credentials from this key into your local `APP_AWS_ACCESS_KEY_ID` and `APP_AWS_SECRET_ACCESS_KEY` environment variables.

### Workflows Involving S3

The story submission and approval process uses tags on the objects that are uploaded to S3.

![submission and approval diagram](./img/submission-and-approval.jpg)

Presigned URLs are used to allow user upload directly to S3

![s3 presigned url diagram](./img/s3-presigned-flow.jpg)

## Environment Variables

AWS configs, see above.

- `APP_AWS_ACCOUNT_ID`
- `APP_AWS_ACCESS_KEY_ID`
- `APP_AWS_SECRET_ACCESS_KEY`
- `APP_AWS_REGION`
- `APP_AWS_BUCKET`
- `APP_AWS_CLOUDFRONT_DISTRIBUTION_ID`

Mapbox API token

- `NEXT_PUBLIC_MAPBOX_TOKEN`

Google Sheet read/write script endpoints for survey submissions and retrieval

- `DB_SURVEY_READ_URL`
- `DB_SURVEY_WRITE_URL`

Auth0, see [Auth0 docs](https://github.com/auth0/nextjs-auth0#configure-the-application) for more info.

- `AUTH0_SECRET`
- `AUTH0_BASE_URL`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

Twilio configs (a currently disabled component of the app)

- `TWILIO_ACCOUNT_AUTH`
- `TWILIO_ACCOUNT_SID`