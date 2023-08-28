import { PodItem } from "./pod";

interface CacheItem {
    data: PodItem[];
    timestamp: number;
}

class Cache {
    get(key:string): CacheItem | null{
        var item =  localStorage.getItem(key);
        if (item != null) {
            var cacheItem = JSON.parse(item) as CacheItem;
            if (cacheItem.timestamp > Date.now() - 1000 * 30) {
                return cacheItem;
            }
        }
        return null;
    }

    set(key:string, data:PodItem[]) {
        var item = {
            data: data,
            timestamp: Date.now()
        }
        localStorage.setItem(key, JSON.stringify(item));
    }

    remove(key:string) {
        localStorage.removeItem(key);
    }
}

const myCache = new Cache();
export default myCache;