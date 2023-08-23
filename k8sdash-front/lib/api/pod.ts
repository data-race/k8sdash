import myCache from "./cache";
import { axios } from "./context";

export interface PodItem {
  name: string;
  namespace: string;
  status: string;
  containers: number;
  readycontainers: number;
  age: number;
  restarts: number;
}

export default async function getPod(context: string): Promise<PodItem[]> {
  var uri = `http://localhost:11223/api/v1/pod?context=${context}`
  var cachedData = myCache.get(uri);
  if (cachedData) {
    const podItems = cachedData.data;
    return podItems;
  }
  try {
    const podItems = axios.get<PodItem[]>(
      uri,
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
