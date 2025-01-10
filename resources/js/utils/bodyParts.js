export const getBodyPart = (lang) => [
    // Anterior body parts
    { face: "ant", name: bpa[lang].pecD, id: 0, d: "M129.9 225a39.6 39.6 0 0022 8 34.6 34.6 0 0020-5c1.8-1.2 11.3-7.2 14-18 2.7-11.4-5.5-13.5-4-29a70.1 70.1 0 000-17 18 18 0 00-3-8 19.3 19.3 0 00-4-4c-4.7-3.5-15.8-4.4-29-1-5.9 1.4-20 5-29 18a35.5 35.5 0 00-7 19c-.5 10.7 4.7 18.8 8 24a45.4 45.4 0 0012 13z"},
    // ... (include all other body parts here)
  ];
  
  const bpa = { 
      fr: {
          tete: "Tête (ant.)",
          couG: "Cou (G)",
          // ... (include all French translations)
      },
      en: {
          tete: "Head (ant.)",
          couG: "Neck (L)",
          // ... (include all English translations)
      }
  };
  
  const bpp = {
      fr: {
          tete: "Tête (post.)",
          trapG: "Trapèze gauche",
          // ... (include all French translations)
      },
      en: {
          tete: "Head (post.)",
          trapG: "Left trapezius",
          // ... (include all English translations)
      }
  };
  
  export { bpa, bpp };
  
  