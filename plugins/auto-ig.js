import fetch from 'node-fetch';

const apiURL = 'https://www.guruapi.tech/api/igdlv1';

export async function before(m) {
    if (!m.text || !m.text.match(/instagram\.com/i)) return false;

    const url = m.text.match(/(https?:\/\/[^\s]+)/)?.[0];
    if (!url) return;

    const apiUrl = `${apiURL}?url=${encodeURIComponent(url)}`;
    m.reply(wait);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error('Error al buscar el contenido de Instagram:', response.statusText);
            throw 'Ocurrió un error al buscar el contenido de Instagram';
        }

        const api_response = await response.json();

        if (!api_response || !api_response.data) {
            throw 'No video or image found or Invalid response from API.';
        }

        const mediaArray = api_response.data;

        for (const mediaData of mediaArray) {
            const mediaType = mediaData.type;
            const mediaURL = mediaData.url_download;
            let cap = `> TÉLÉCHARGÉ ✅ ${mediaType.toUpperCase()}`;

            if (mediaType === 'video') {
                await this.sendFile(m.chat, mediaURL, 'instagram.mp4', cap, m, null);
            } else if (mediaType === 'image') {
                await this.sendFile(m.chat, mediaURL, 'instagram.jpg', cap, m, null);
            }
        }
    } catch (error) {
        await m.reply(`حدث خطأ في هذه 👉🏻: ${error.message}`);
    }
}
