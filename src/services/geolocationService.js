
// Reverse-geocode coordinates (lat, lon) into a country name + ISO code using Nominatim

export async function reverseGeocode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
            lat,
        )}&lon=${encodeURIComponent(lon)}&zoom=10&accept-language=en`
        const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
        if (!res.ok) return null
        const data = await res.json()
        const countryCode = data?.address?.country_code ? data.address.country_code.toUpperCase() : null
        const country = data?.address?.country ?? null
        const placeName =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.municipality ||
            data?.address?.county ||
            (data?.display_name ? String(data.display_name).split(',')[0] : null)
        return { countryCode, country, placeName }
    } catch (err) {
        console.warn('reverseGeocode failed', err)
        return null
    }
}