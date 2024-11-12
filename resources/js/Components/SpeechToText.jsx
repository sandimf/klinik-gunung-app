// File: src/components/SpeechToText.js
import React, { useState } from 'react';
import axios from 'axios';

function SpeechToText({ onTextCaptured }) {
   const [isListening, setIsListening] = useState(false);

   const startListening = () => {
      if ('webkitSpeechRecognition' in window) {
         const recognition = new webkitSpeechRecognition();
         recognition.lang = 'id-ID'; // Bahasa Indonesia
         recognition.continuous = false;

         recognition.onstart = () => setIsListening(true);
         recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            onTextCaptured(speechText);  // Kirim teks untuk diproses
         };
         recognition.onend = () => setIsListening(false);

         recognition.start();
      } else {
         alert('Browser tidak mendukung fitur Speech-to-Text.');
      }
   };

   return (
      <div>
         <button onClick={startListening}>
            {isListening ? 'Mendengarkan...' : 'Mulai Rekam'}
         </button>
      </div>
   );
}

export default SpeechToText;
