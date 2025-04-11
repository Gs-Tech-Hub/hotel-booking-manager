import { allMenuItems } from '../data/menuData';

export type MenuItemPayload = {
    name: string;
    description: {
      type: string;
      children: { text: string; type: string }[];
    }[];
    price: number;
  };
  

/**
 * Transforms the local menu items to match the API format.
 */
export const transformMenuItems = (): MenuItemPayload[] => {
    return allMenuItems.map(item => ({
      name: item.name,
      description: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'No description provided.',
              type: 'text',
            },
          ],
        },
      ],
      price: item.price,
    }));
  };  

/**
 * Posts transformed menu items to the API.
 * @param apiUrl The endpoint where the menu data should be posted.
 * @param token Optional Bearer token for APIs that require it.
 */
export const updateMenuItemsToAPI = async (apiUrl: string, token?: string) => {
  const items = transformMenuItems();

  for (const item of items) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: item }),
    });

    if (!response.ok) {
      console.error(`Failed to post item: ${item.name}`, await response.text());
    }
  }
};
