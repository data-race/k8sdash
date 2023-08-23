import { PodItem } from "./pod";

const TTL = 60 * 1000; // 1 minute


export interface CacheItem {
    timestamp: number;
    data: PodItem[];
}

export class Cache {
    
    // get data from cache
    get(key: string): CacheItem|null {
        const item = localStorage.getItem(key);
        if (item) {
            const parsedItem = JSON.parse(item);
            if (parsedItem.timestamp + TTL > Date.now()) {
                return parsedItem;
            }
        }
        return null;
    }

    // set data in cache
    set(key: string, data: any) {
        var item = {
            timestamp: Date.now(),
            data: data
        }
        localStorage.setItem(key, JSON.stringify(item));
    }

    // remove data from cache
    remove(key: string) {
        localStorage.removeItem(key);
    }
}

var myCache = new Cache();

export default myCache;