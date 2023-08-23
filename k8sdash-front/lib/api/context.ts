import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
// Same object, new types.
export const axios = setupCache(Axios);

interface ContextItem {
  cluster: string;
}

export default async function getContext(): Promise<ContextItem[]> {
  try {
    const contextItems = axios
      .get<ContextItem[]>(
        "http://localhost:11223/api/v1/context",
        {
          cache: { ttl: 1000 * 30 },
        }
      )
      .then((resp) => {
        return resp.data;
      });
    return contextItems;
  } catch (error) {
    console.error(error);
    return [];
  }
}

