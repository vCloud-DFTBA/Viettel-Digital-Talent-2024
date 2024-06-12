import http from 'k6/http'
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';

const session = new Httpx({ baseURL: 'https://api.dotv.home.arpa' });
const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqNlFOM3dhVmw2a2xTRlg1WjNuYmZyQmw4ckZBdEtCWldjUVNtelZSNzhRIn0.eyJleHAiOjE3MTgxODkyMTYsImlhdCI6MTcxODE4ODkxNiwianRpIjoiZjcxODJiZTctZjdlZi00ZTI5LWI1OTYtNWJmYTgyMjE3MDYxIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5kb3R2LmhvbWUuYXJwYS9yZWFsbXMvdmR0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImRiN2VkOTJjLTMzNTktNDcyMS05MzEwLTFiYzdkNThiODcyOCIsInR5cCI6IkJlYXJlciIsImF6cCI6InZkdC1iZSIsInNlc3Npb25fc3RhdGUiOiI2MTY2OTE1Yy0zNjhlLTQxODYtYTcwNy1mODNiNDFkNWUxNTYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vYXBpLmRvdHYuaG9tZS5hcnBhIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXZkdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6IjYxNjY5MTVjLTM2OGUtNDE4Ni1hNzA3LWY4M2I0MWQ1ZTE1NiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWJkZSBhYWEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ1c2VyIiwiZ2l2ZW5fbmFtZSI6ImFiZGUiLCJmYW1pbHlfbmFtZSI6ImFhYSIsImVtYWlsIjoidXNlckBsb2NhbCJ9.lku04u-II8G3MG2aooeuxfD4khMfOnjVxnjJKCP6G-Y4e6BaEC-a6_NLKVEYcY2zK7-EPZX_UeX1s5l1gyN2Qz4NEUJRO8f558sZyneIcz_MiA_lwAYA_z9P96rCitMYsacuXfI377m5p9LSe08KGLbm0XOqP19NMTOrxL_4ZGVFIEVg9D99ghrVZ5Xqzy--PA84QLF4vQUltx49Pg_NcXFwr4RrPTb--Z0nYGv9WTU3fkyCdhk-tgTVgfUHbRcDTlV9PoH7a10da--GEj3k5rZb6FRTXAPQNZXmVsfz0aSLIEBKV2A-850FeHGZU_-drzGIItNtPkN6deQxMhc7JA"

session.addHeader('Authorization', `Bearer ${token} `);

export const options = {
	vus: 1,
	duration: '60s',
	thresholds: {
        // Some dummy thresholds that are always going to pass.
        'http_req_duration{status:200}': ['max>=0'],
        'http_req_duration{status:409}': ['max>=0'],
        },
    'summaryTrendStats': ['min', 'med', 'avg', 'p(90)', 'p(95)', 'max', 'count'],
}

export default function () {
  session.get('/api/v1/users');
}
