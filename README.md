# Queuery

Asynchronous Queued Query Service

## Pronounciation

Same as **きゅうり**

## How to Hack

Components:
- API Server (Simple Rails Application)
- Frontend (TypeScript + React, parcel)

To run these, work following steps.

1. setup PostgreSQL DB to use `createdb` and `createuser` manually to create `queuery_development` user & DB
2. execute `bundle exec bin/setup`
3. set env variables AAD_CLIENT_ID, AAD_CLIENT_SECRET, AAD_TENANT_ID
4. execute `foreman start` then open `http://localhost:3000/console/` in your browser.

(If you create client account at local environment, you must have access to Redshift)

# API

Queuery has two version API. v1 is used by client. v2 is used by web console.

## Authentication

### ClientCredential
The authentication method is used in each v1 API endpoints properly.
In this method, clients are authenticated with token/token-secret. These are passed as username/password over HTTP Basic Authentication respectively.

### OAuth2
The authentication method is used to access web console.
Queuery use Azure AD for OAuth2. Users for queuery-console need MS account.

## Endpoints

### POST `/v1/queries/`

Enqueue a new query

Authentication: ClientCredential

Parameters:
- `q`: String
  - Query which formed as a SQL select statement
  - Example: `"select 1,2,3;"`

Response: [`Query`](#query) JSON

### GET `/v1/queries/:id`

Get enqueued query status and result

Authentication: ClientCredential

Parameters:
- `id`: `id` value in [`Query`](#query)

Response: [`Query`](#query) JSON

## Types

### `Query`

Properties:
- `id`: Integer
  - Identifier of query
- `status`: String (`"pending"` | `"running"` | `"success"` | `"failed"` | `"canceled"` | `"unknown"`)
- `data_file_urls`: Array<String>
  - Url array of presigned url of data file object
  - Present only when status is `"success"`
  - Job status
- `manifest_file_url`(selectable): String
  - Presigned Url of manifest file onject
  - Manifest file has a schema type of SQL result
- `error`: String
  - Message describes what error occured.
  - Present only when status is `"failed"`
- `select_stmt`(selectable): String
  - Same SQL statement as in POST `/v1/queries/` request
- `created_at`(selectable): Timestamp
  - created timestamp of query record in Queuery
- `job_id`(selectable): UUID
  - queuery execution job id (not Redshift Data API id)
- `client_account_name`(selectable): String
  - Name of a client executed the query
- `s3_prefix`(selectable): String
  - S3 uri starting with bucket name and ending with `result.csv.`
  - Data files & manifest file are in this prefix path
