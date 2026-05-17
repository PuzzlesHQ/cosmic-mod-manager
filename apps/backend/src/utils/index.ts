export function isExpired(expiryDate: Date, validity_ms: number) {
    return Date.now() <= new Date(expiryDate).getTime() + validity_ms;
}
