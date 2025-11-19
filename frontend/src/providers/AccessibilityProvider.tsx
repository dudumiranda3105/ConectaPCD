import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useTts } from '@/hooks/use-tts'

type ContrastMode = 'default' | 'high-contrast'
type TextSpacing = 'default' | 'medium' | 'large'
type FontFamily = 'default' | 'lexend' | 'arial' | 'opendyslexic' | 'comic-sans' | 'verdana' | 'tahoma'
type ColorBlindMode = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

interface AccessibilityContextType {
  isTtsEnabled: boolean
  toggleTts: () => void
  speak: (text: string) => void
  cancel: () => void
  contrastMode: ContrastMode
  setContrastMode: (mode: ContrastMode) => void
  fontSize: number
  setFontSize: (size: number) => void
  textSpacing: TextSpacing
  setTextSpacing: (spacing: TextSpacing) => void
  fontFamily: FontFamily
  setFontFamily: (font: FontFamily) => void
  showFocusOutline: boolean
  toggleFocusOutline: () => void
  highlightLinks: boolean
  toggleHighlightLinks: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  grayscale: boolean
  toggleGrayscale: () => void
  colorBlindMode: ColorBlindMode
  setColorBlindMode: (mode: ColorBlindMode) => void
  resetAccessibilitySettings: () => void
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined)

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isTtsEnabled, setIsTtsEnabled] = useState(false)
  const [contrastMode, setContrastMode] = useState<ContrastMode>('default')
  const [fontSize, setFontSize] = useState(1)
  const [textSpacing, setTextSpacing] = useState<TextSpacing>('default')
  const [fontFamily, setFontFamily] = useState<FontFamily>('default')
  const [showFocusOutline, setShowFocusOutline] = useState(false)
  const [highlightLinks, setHighlightLinks] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('default')
  const { speak, cancel } = useTts()

  const toggleTts = useCallback(() => {
    setIsTtsEnabled((prev) => {
      if (prev) cancel()
      return !prev
    })
  }, [cancel])

  const speakOnHover = useCallback(
    (event: MouseEvent) => {
      if (isTtsEnabled) {
        const target = event.target as HTMLElement
        const text =
          target.getAttribute('aria-label') ||
          target.innerText ||
          target.getAttribute('title')
        if (text) speak(text)
      }
    },
    [isTtsEnabled, speak],
  )

  useEffect(() => {
    document.body.addEventListener('mouseover', speakOnHover)
    return () => document.body.removeEventListener('mouseover', speakOnHover)
  }, [speakOnHover])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(
      'high-contrast',
      'text-spacing-medium',
      'text-spacing-large',
      'show-focus-outline',
      'highlight-links',
      'reduce-motion',
      'grayscale',
      'colorblind-protanopia',
      'colorblind-deuteranopia',
      'colorblind-tritanopia',
      'colorblind-achromatopsia',
    )
    if (contrastMode === 'high-contrast') root.classList.add('high-contrast')
    if (textSpacing === 'medium') root.classList.add('text-spacing-medium')
    if (textSpacing === 'large') root.classList.add('text-spacing-large')
    if (showFocusOutline) root.classList.add('show-focus-outline')
    if (highlightLinks) root.classList.add('highlight-links')
    if (reducedMotion) root.classList.add('reduce-motion')
    if (grayscale) root.classList.add('grayscale')
    if (colorBlindMode === 'protanopia') root.classList.add('colorblind-protanopia')
    if (colorBlindMode === 'deuteranopia') root.classList.add('colorblind-deuteranopia')
    if (colorBlindMode === 'tritanopia') root.classList.add('colorblind-tritanopia')
    if (colorBlindMode === 'achromatopsia') root.classList.add('colorblind-achromatopsia')

    root.style.setProperty('--font-size-multiplier', `${fontSize}`)

    let fontVar = 'var(--font-sans-default)'
    if (fontFamily === 'lexend') fontVar = 'var(--font-sans-lexend)'
    if (fontFamily === 'arial') fontVar = 'var(--font-sans-arial)'
    if (fontFamily === 'opendyslexic') fontVar = '"OpenDyslexic", sans-serif'
    if (fontFamily === 'comic-sans') fontVar = '"Comic Sans MS", "Comic Sans", cursive'
    if (fontFamily === 'verdana') fontVar = 'Verdana, sans-serif'
    if (fontFamily === 'tahoma') fontVar = 'Tahoma, sans-serif'
    root.style.setProperty('--font-sans', fontVar)
  }, [
    contrastMode,
    fontSize,
    textSpacing,
    fontFamily,
    showFocusOutline,
    highlightLinks,
    reducedMotion,
    grayscale,
    colorBlindMode,
  ])

  const resetAccessibilitySettings = () => {
    setIsTtsEnabled(false)
    setContrastMode('default')
    setFontSize(1)
    setTextSpacing('default')
    setFontFamily('default')
    setShowFocusOutline(false)
    setHighlightLinks(false)
    setReducedMotion(false)
    setGrayscale(false)
    setColorBlindMode('default')
  }

  const value = {
    isTtsEnabled,
    toggleTts,
    speak,
    cancel,
    contrastMode,
    setContrastMode,
    fontSize,
    setFontSize,
    textSpacing,
    setTextSpacing,
    fontFamily,
    setFontFamily,
    showFocusOutline,
    toggleFocusOutline: () => setShowFocusOutline((prev) => !prev),
    highlightLinks,
    toggleHighlightLinks: () => setHighlightLinks((prev) => !prev),
    reducedMotion,
    toggleReducedMotion: () => setReducedMotion((prev) => !prev),
    grayscale,
    toggleGrayscale: () => setGrayscale((prev) => !prev),
    colorBlindMode,
    setColorBlindMode,
    resetAccessibilitySettings,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider',
    )
  }
  return context
}
