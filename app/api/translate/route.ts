import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text, from, to } = await req.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ translated: text }, { status: 200 });
        }

        // Detect if text is Devanagari (Hindi/Marathi)
        const sourceLang = from || (isDevanagari(text) ? 'hi' : 'en');
        const targetLang = to || 'en';

        // If already English, skip translation
        if (sourceLang === 'en' || !isDevanagari(text)) {
            return NextResponse.json({ translated: text, detected: 'en' }, { status: 200 });
        }

        // Try MyMemory API (free, no key needed)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const data = await res.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translated = data.responseData.translatedText;
            return NextResponse.json({
                translated,
                original: text,
                detected: sourceLang,
            });
        }

        // If MyMemory fails, try with Marathi (mr) as source
        if (sourceLang === 'hi') {
            const urlMr = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=mr|${targetLang}`;
            const resMr = await fetch(urlMr, { signal: AbortSignal.timeout(5000) });
            const dataMr = await resMr.json();

            if (dataMr.responseStatus === 200 && dataMr.responseData?.translatedText) {
                return NextResponse.json({
                    translated: dataMr.responseData.translatedText,
                    original: text,
                    detected: 'mr',
                });
            }
        }

        // Fallback: return original text
        return NextResponse.json({ translated: text, detected: sourceLang });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ translated: '', error: 'Translation failed' }, { status: 500 });
    }
}

function isDevanagari(text: string): boolean {
    // Check if text contains Devanagari Unicode characters (U+0900 – U+097F)
    return /[\u0900-\u097F]/.test(text);
}
