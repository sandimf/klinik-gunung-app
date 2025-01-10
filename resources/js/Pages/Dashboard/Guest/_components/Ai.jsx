import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBfiwWwXE3Q8v0JuTPDb4xvNjh9SuvpWDE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeImage = async (file) => {
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
            Analyze this KTP (Indonesian ID card) image and extract the following information:
            - NIK (ID Number)
            - Nama (Name)
            - Tempat Lahir (Place of Birth)
            - Tanggal Lahir (Date of Birth in the format "DD Month YYYY")
            - Jenis Kelamin (Gender female, male, other)
            - Alamat (Address)
            - RT/RW (Neighborhood/Community Unit)
            - Kelurahan/Desa (Village)
            - Kecamatan (District)
            - Agama (Religion)
            - Status Perkawinan (Marital Status)
            - Pekerjaan (Occupation)
            - Kewarganegaraan (Nationality)
            - Berlaku Hingga (Valid Until)
            - Golongan Darah (Blood Type)

            Present the extracted information in a JSON format with these fields as keys.
        `;
        
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image.split(",")[1], mimeType: file.type } }
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