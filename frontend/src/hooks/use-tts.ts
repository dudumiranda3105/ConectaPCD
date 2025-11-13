import { useState, useEffect, useCallback } from 'react'

interface UseTtsReturn {
  speak: (text: string) => void
  cancel: () => void
  isSpeaking: boolean
}

export const useTts = (): UseTtsReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synth = window.speechSynthesis

  const speak = useCallback(
    (text: string) => {
      if (synth.speaking) {
        synth.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      synth.speak(utterance)
    },
    [synth],
  )

  const cancel = useCallback(() => {
    if (synth.speaking) {
      synth.cancel()
      setIsSpeaking(false)
    }
  }, [synth])

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return { speak, cancel, isSpeaking }
}
