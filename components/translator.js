const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(text, locale) {
    let translation = text;
    const americanToBritishSpellingArray = Object.entries(americanToBritishSpelling);
    const americanToBritishTitlesArray = Object.entries(americanToBritishTitles);
    if (locale === 'american-to-british') {
      const americanOnlyArray = Object.entries(americanOnly);
      americanOnlyArray.forEach(termPair => {
        const regExp = new RegExp(`\\b${termPair[0]}\\b`, 'gi');
        const spanRegExp = new RegExp(`<span class="highlight">.*${termPair[0]}.*<\/span>`);
        if (!spanRegExp.test(translation)) {
          translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[1] + '</span>');
        }
      });
      
      americanToBritishSpellingArray.forEach(termPair => {
        const regExp = new RegExp(`\\b${termPair[0]}\\b`, 'gi');
        translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[1] + '</span>');
      });

      americanToBritishTitlesArray.forEach(termPair => {
        const regExp = new RegExp(termPair[0].replace('.', '\\.'), 'gi');
        translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[1].slice(0, 1).toUpperCase() + termPair[1].slice(1) + '</span>');
      });

      const regExp = /(\d+):(\d{2})/g;
      for (const match of translation.matchAll(regExp)) {
        translation = translation.replace(match[1] + ':' + match[2], '<span class="highlight">' + match[1] + '.' + match[2] + '</span>');
      }
    }

    if (locale === 'british-to-american') {
      const britishOnlyArray = Object.entries(britishOnly);
      britishOnlyArray.forEach(termPair => {
        const regExp = new RegExp(`\\b${termPair[0]}\\b`, 'gi');
        const spanRegExp = new RegExp(`<span class="highlight">.*${termPair[0]}.*<\/span>`);
        if (!spanRegExp.test(translation)) {
          translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[1] + '</span>');  
        }
      });
      
      americanToBritishSpellingArray.forEach(termPair => {
        const regExp = new RegExp(`\\b${termPair[1]}\\b`, 'gi');
        translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[0] + '</span>');
      });

      americanToBritishTitlesArray.forEach(termPair => {
        const regExp = new RegExp(`\\b${termPair[1]}\\b`, 'gi');
        translation = translation.replaceAll(regExp, '<span class="highlight">' + termPair[0].slice(0, 1).toUpperCase() + termPair[0].slice(1) + '</span>');
      });

      const regExp = /(\d+).(\d{2})/g;
      for (const match of translation.matchAll(regExp)) {
        translation = translation.replace(match[1] + '.' + match[2], '<span class="highlight">' + match[1] + ':' + match[2] + '</span>');
      }
    }
    return translation === text ? 'Everything looks good to me!' : translation;
  }
}

module.exports = Translator;