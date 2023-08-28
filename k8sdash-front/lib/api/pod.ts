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

export default  async function getPod(context: string): Promise<PodItem[]> {
  // use timestamp to disable cache
  var uri = `http://localhost:11223/api/v1/pod?context=${context}&timestamp=${new Date().getTime()}`
  var cachedData = myCache.get(uri);
  if (cachedData) {
    console.log("Pod cache hit");
    const podItems = cachedData.data;
    console.log(podItems);
    return podItems;
  }
  console.log("Pod cache miss");
  try {
    const podItems = await axios.get<PodItem[]>(
      uri,
    ).then((resp)=>{
        return resp.data
    });
    myCache.set(uri, podItems)
    return podItems;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function refreshPodCache(context:string) {
  var uri = `http://localhost:11223/api/v1/pod?context=${context}`
  myCache.remove(uri);
  console.log("Pod cache refreshed");
}
