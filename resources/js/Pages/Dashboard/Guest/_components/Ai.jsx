import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeImage = async (file, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey || "default_api_key");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    try {
        const base64Image = await fileToBase64(file);
        const prompt = `
                Analyze this KTP (Indonesian Identity Card) image and extract the following information:
    - NIK (Identity Number)
    - Name (Name)
    - Place of Birth (Place of Birth)
    - Date of Birth (Date of Birth in the format "DD Maret YYYY")
    - Gender (Gender female, male, other)
    - Address (Address)
    - RT/RW (Neighborhood/Community Unit)
    - Village/Village (Village)
    - District (Regency)
    - Religion (Religion)
    - Marital Status (Marital Status)
    - Occupation (Occupation)
    - Citizenship (Nationality)
    - Valid Until (Valid Until)
    - Blood Group (Blood Group)

    Serve the extracted information in JSON format with these fields as keys and use Indonesian for the results.
    Pastikan nama bulan pada tanggal lahir selalu diawali huruf besar dan sisanya huruf kecil (contoh: "Maret").
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image.split(",")[1],
                    mimeType: file.type,
                },
            },
        ]);

        const extractedText = result.response.text();
        const jsonStart = extractedText.indexOf("{");
        const jsonEnd = extractedText.lastIndexOf("}") + 1;
        const jsonString = extractedText.slice(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (err) {
        throw new Error("Error during image analysis. Please try again.");
    }
};

// Fungsi konversi tanggal lahir ke format YYYY-MM-DD
export function parseTanggalLahir(str) {
    if (!str) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const bulan = {
        'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 'mei': '05', 'juni': '06',
        'juli': '07', 'agustus': '08', 'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };
    const match = str.match(/(\d{1,2})\s([A-Za-z]+)\s(\d{4})/);
    if (match) {
        const day = match[1].padStart(2, '0');
        const monthName = match[2].toLowerCase();
        const month = bulan[monthName] || '01';
        const year = match[3];
        return `${year}-${month}-${day}`;
    }
    const dash = str.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (dash) {
        return `${dash[3]}-${dash[2]}-${dash[1]}`;
    }
    return str;
}
