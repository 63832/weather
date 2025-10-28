
// Convert an ISO 3166-1 alpha-2 country code (e.g. "FI") to a flag emoji

export function countryCodeToFlag(code) {
    if (!code) return ''
    const cc = String(code).toUpperCase()
    if (cc.length !== 2) return ''
    return cc
        .split('')
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join('')
}