/* eslint-disable */

type ApiHandlerProps = {
  baseUrl: string;
};

type FetchDataParams = string;
type CreateDataParams = {
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
type UpdateDataParams = {
  endpoint: string;
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const fetchWithAuth = async (endpoint: string) => {
    // Get JWT token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No authentication token found');
    }

    return fetchWithRetry(`${baseUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  

  const fetchData = async (endpoint: FetchDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}`);
  };

  const createData = async ({ endpoint, data }: CreateDataParams) => {
    const isAuth = endpoint === "auth/local";

    return fetchWithRetry(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isAuth ? data : { data }), // unwrapped for auth
    });
  };

  const updateData = async ({ endpoint, id, updatedData }: UpdateDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updatedData })
    });
  };

  const deleteData = async ({ endpoint, id }: DeleteDataParams) => {
    return fetchWithRetry(`${baseUrl}/${endpoint}/${id}`, { method: 'DELETE' });
  };

  return { fetchWithAuth, fetchData, createData, updateData, deleteData };
};

export default ApiHandler;
