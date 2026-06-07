const _IP = require("ip");

/**
 * Converts a string representation of an IP address to an IPv6 address.
 * If the input is an IPv4 address, it converts it to an IPv6-mapped address.
 * @param src The IP address as a string.
 * @returns The IPv6 address as a string.
 */
export function convertToIPv6(src: string): string | null {
    if (_IP.isV4Format(src)) {
        // Convert IPv4 to IPv6-mapped address
        const buffer = _IP.toBuffer(src);
        return `::ffff:${buffer.readUInt8(0)}.${buffer.readUInt8(1)}.${buffer.readUInt8(2)}.${buffer.readUInt8(3)}`;
    }

    // Check if it's a valid IPv6 address by attempting to parse it
    try {
        const buffer = _IP.toBuffer(src);
        return _IP.toString(buffer); // Return normalized IPv6
    } catch {
        return null;
    }
}

/**
 * Strips the IP address to a 64-bit representation.
 * @param ip The IPv6 address as a string.
 * @returns A 64-bit number representing the significant octets of the IP.
 */
export function stripIp(ip: string): bigint {
    const buffer = _IP.toBuffer(ip) as Buffer;

    if (ip.startsWith("::ffff:")) {
        // IPv4-mapped address
        return BigInt(buffer.readUInt32BE(12)) << BigInt(32);
    }
    // Full IPv6 address
    return (BigInt(buffer.readUInt32BE(0)) << BigInt(32)) | BigInt(buffer.readUInt32BE(4));
}
