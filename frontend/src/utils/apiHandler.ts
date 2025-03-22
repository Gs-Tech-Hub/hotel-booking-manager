'use client'
import { useState } from 'react';

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
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (endpoint: FetchDataParams) => {
    const constructedUrl = `${baseUrl}/${endpoint}`;
    
    console.log('Fetching data from:', constructedUrl);
    
    try {
      const response = await fetch(constructedUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  };

  const createData = async ({ endpoint, data }: CreateDataParams) => {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  };

  const updateData = async ({ endpoint, id, updatedData }: UpdateDataParams) => {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  };

  const deleteData = async ({ endpoint, id }: DeleteDataParams) => {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  };

  return { fetchData, createData, updateData, deleteData, error };
};

export default ApiHandler;
