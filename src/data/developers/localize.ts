import traditionalPhrases from './ui.tw.json'

// UI copy only: API paths, code identifiers and example payloads are not converted.
export function localizeDeveloperText(text: string, lng: string): string {
  if (lng !== 'zh-TW') return text
  return text.replace(
    /[\u3400-\u9fff]+/g,
    (phrase) => traditionalPhrases[phrase as keyof typeof traditionalPhrases] ?? phrase,
  )
}
