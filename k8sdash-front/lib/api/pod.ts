import { axios } from "./context";

interface PodItem {
  name: string;
  namespace: string;
  status: string;
  containers: number;
  readycontainers: number;
  age: number;
  restarts: number;
}

//TODO: add cache for the fetch data functions.
//!The function should periodically fetch data and update the cache.
//!If the cached data is not outdated, using the cached data.

export default async function fetchPod(context: string): Promise<PodItem[]> {
  try {
    const podItems = axios.get<PodItem[]>(
      `http://localhost:11223/api/v1/pod?context=${context}`,
      {
        cache: { ttl: 1000 * 30 },
      }
    ).then((resp)=>{
        return resp.data
    });
    return podItems;
  } catch (error) {
    console.error(error);
    return [];
  }
}
