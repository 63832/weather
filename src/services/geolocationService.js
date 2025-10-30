// Reverse-geocode coordinates (lat, lon) into a country name + ISO code using Nominatim
export async function reverseGeocode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
            lat,
        )}&lon=${encodeURIComponent(lon)}&zoom=10&accept-language=en`;

        const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) return null;

        const data = await res.json();

        let countryCode = data?.address?.country_code
            ? data.address.country_code.toUpperCase()
            : null;
        let country = data?.address?.country ?? null;

        const placeName =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.municipality ||
            data?.address?.county ||
            (data?.display_name ? String(data.display_name).split(',')[0] : null);

        // Åland is part of Finland in OSM, but has its own ISO code (AX)
        const stateName = data?.address?.state?.toLowerCase?.() || '';
        if (countryCode === 'FI' && stateName.includes('åland')) {
            countryCode = 'AX';
            country = 'Åland Islands';
        }

        return { countryCode, country, placeName };
    } catch (err) {
        console.warn('reverseGeocode failed', err);
        return null;
    }
}
