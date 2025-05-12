/** @format */

import { api_url } from '../config';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from './auth';

export const api = async (
  path: string,
  method: 'POST' | 'GET' | 'DELETE' | 'PATCH',
  data?: {
    body?: Record<string, unknown> | FormData;
    contentType?: 'application/json' | 'application/x-www-form-urlencoded';
  },
  token?: string,
) => {
  const headers: HeadersInit = {};

  if (data?.contentType) headers['Content-Type'] = data.contentType;
  console.log('APAKAH LEWAT SINI3');
  if (token) {
    const expiresIn = jwtDecode(token).exp! * 1000;
    if (new Date().valueOf() >= expiresIn) {
      const { access_token } = await refreshToken();
      headers['Authorization'] = 'Bearer ' + access_token;
    } else headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(api_url + path, {
    method,
    body:
      data?.body instanceof FormData ? data.body : JSON.stringify(data?.body),
    headers,
  });

  console.log('INI res di handlers', res);
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    console.log('berarti text ya?');
    const text = await res.text();
    throw new Error(`Request failed`);
  }
  const json = await res.json();
  if (res.status > 299) throw new Error(json.message || 'Request failed');
  return json;
};
