import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeImage = async (file, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey || "default_api_key");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    - Date of Birth (Date of Birth in the format "DD Month YYYY")
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
