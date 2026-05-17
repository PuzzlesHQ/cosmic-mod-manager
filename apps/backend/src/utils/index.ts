export function isConfirmationCodeValid(dateCreated: Date, validity_ms: number) {
    return Date.now() <= new Date(dateCreated).getTime() + validity_ms;
}
