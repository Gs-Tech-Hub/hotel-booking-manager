'use client';
// import { useState } from 'react';

type ApiHandlerProps = {
  baseUrl: string;
};

type FetchDataParams = string;
type CreateDataParams = {
  endpoint: string;
  data: any;
};
type UpdateDataParams = {
  endpoint: string;
  id: string | number;
  updatedData: any;
};
type DeleteDataParams = {
  endpoint: string;
  id: string | number;
};

const ApiHandler = ({ baseUrl }: ApiHandlerProps) => {
  // const [error, setError] = useState<Error | null>(null);

  const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 5, delay = 1000): Promise<any> => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error: unknown) {
        attempt++;
        if (attempt >= retries) {
          // setError(error instanceof Error ? error : new Error('An unknown error occurred'));
          throw error;
        }
        const waitTime = Math.min(delay * Math.pow(2, attempt), 10000); // Max 10s delay
        console.warn(`Retrying API call (${attempt}/${retries}) in ${waitTime}ms...`);
        await new Promise((res) => setTimeout(res, waitTime));
      }
    }
  };

  const fetchData = async (endpoint: FetchDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}`);
  };

  const createData = async ({ endpoint, data }: CreateDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }), 
    });
  };

  const updateData = async ({ endpoint, id, updatedData }: UpdateDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedData }), 
    });
  };

  const uploadToStrapi = async ({ endpoint, data }: { endpoint: string; data: FormData }) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      body: data, // Let the browser handle multipart headers
    });
  };

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('files', file);
  
    const response = await uploadToStrapi({
      endpoint: 'upload',
      data: formData,
    });
  
    return response?.[0]; // Return full metadata (or adjust to return .id only if preferred)
  };
  
  
  
  const deleteData = async ({ endpoint, id }: DeleteDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}/${id}`, { method: 'DELETE' });
  };

  return { fetchData, createData, updateData, uploadToStrapi, uploadFile, deleteData };
};

export default ApiHandler;
