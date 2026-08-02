export function mapObjectList<T extends object, K extends keyof T>(list: T[], key: K) {
    const items: T[K][] = [];
    for (const item of list) {
        items.push(item[key]);
    }
    return items;
}
