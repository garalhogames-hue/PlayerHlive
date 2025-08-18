"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Users, Instagram, Home, Loader2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface RadioInfo {
  currentListeners: number
  streamTitle: string
  currentSong: string
  streamGenre: string
}

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [radioInfo, setRadioInfo] = useState<RadioInfo>({
    currentListeners: 0,
    streamTitle: "Carregando...",
    currentSong: "Carregando...",
    streamGenre: "Carregando...",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const streamUrl = "https://sonicpanel.oficialserver.com/8342/;acc"
  const apiUrl = "https://jdhfgjdth.onrender.com/"

  useEffect(() => {
    const fetchRadioInfo = async () => {
      try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        setRadioInfo({
          currentListeners: data.currentListeners || 0,
          streamTitle: data.streamTitle || "Radio HabbLive",
          currentSong: data.currentSong || "Música não identificada",
          streamGenre: data.streamGenre || "Programação Geral",
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao buscar informações da rádio:", error)
        setIsLoading(false)
      }
    }

    fetchRadioInfo()
    const interval = setInterval(fetchRadioInfo, 30000)

    return () => clearInterval(interval)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsAudioLoading(true)
        audioRef.current.load()
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            setIsAudioLoading(false)
          })
          .catch(() => {
            setIsAudioLoading(false)
          })
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
    if (value[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume[0] / 100
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const getHostAvatar = (hostName: string) => {
    if (!hostName || hostName === "Carregando...") return null
    return `https://habblive.in/imager.php?user=${encodeURIComponent(hostName)}&action=wav&size=l&head_direction=3&direction=3&gesture=sml`
  }

  const shouldShowLogo = (hostName: string) => {
    const shouldShow =
      !hostName ||
      hostName === "Carregando..." ||
      hostName.toLowerCase().includes("autodj") ||
      hostName.toLowerCase().includes("auto dj") ||
      hostName === "Radio HabbLive" ||
      hostName === "Rádio Habblive" ||
      hostName.toLowerCase().includes("radio") ||
      hostName.toLowerCase().includes("stream")
    return shouldShow
  }

  const isLiveHost = (hostName: string) => {
    return !shouldShowLogo(hostName)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #0e181f, #0c161d, #0b1b24)" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/hliveequipe.png')" }}
      />

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <img src="/radio-logo-transparent.png" alt="Rádio Habblive" className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white ml-3 sm:ml-4">Rádio Habblive</h1>
          </div>
          <p className="text-gray-300 text-base sm:text-lg">Estamos com você 24/7 — sintonize!</p>
        </div>

        <Card
          className="backdrop-blur-sm border-gray-700 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6"
          style={{ backgroundColor: "#1c2735" }}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              {!shouldShowLogo(radioInfo.streamTitle) ? (
                <div className="mb-3 sm:mb-4">
                  <p className="text-white text-2xl sm:text-3xl font-bold mb-2">{radioInfo.streamTitle}</p>
                  <p className="text-gray-300 text-base sm:text-lg">{radioInfo.streamGenre}</p>
                </div>
              ) : (
                <p className="text-gray-300 mb-3 sm:mb-4 text-lg sm:text-xl">Tocando as Melhores</p>
              )}

              <div className="mb-3 sm:mb-4 relative inline-block">
                {shouldShowLogo(radioInfo.streamTitle) ? (
                  <div className="relative">
                    <img
                      src="/radio-logo-new.png"
                      alt="Logo Rádio Habblive"
                      className="w-24 h-24 sm:w-32 sm:h-32 mx-auto border-2 border-purple-500 rounded-full object-cover"
                    />
                    <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={getHostAvatar(radioInfo.streamTitle)! || "/radio-logo-new.png"}
                      alt={`Avatar de ${radioInfo.streamTitle}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 mx-auto border-2 border-purple-500 rounded-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/radio-logo-new.png"
                      }}
                    />
                    <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-4 sm:mb-6">
                <div
                  className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full"
                  style={{ backgroundColor: "#103146" }}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="text-base sm:text-lg font-medium text-white">
                    {radioInfo.currentListeners} ouvintes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="backdrop-blur-sm border-gray-700 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6"
          style={{ backgroundColor: "#1c2735" }}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                onClick={togglePlay}
                size="lg"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 border-0 flex-shrink-0 shadow-lg"
                disabled={isAudioLoading}
              >
                {isAudioLoading ? (
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
                ) : (
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-0.5 sm:ml-1" />
                )}
              </Button>

              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-gray-700 flex-shrink-0 p-1 sm:p-2"
                >
                  {isMuted || volume[0] === 0 ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={isMuted ? [0] : volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:border-purple-600 [&_.bg-primary]:bg-purple-600"
                  />
                </div>
                <span className="text-base sm:text-lg font-medium text-white w-6 sm:w-8 text-right flex-shrink-0">
                  {isMuted ? 0 : volume[0]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-row gap-2 sm:gap-3 mb-6 sm:mb-8 w-full max-w-sm sm:max-w-md justify-center items-center">
          <Button
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-3 sm:px-6 py-2 rounded-full text-xs sm:text-base shadow-lg flex-1 sm:flex-none"
            onClick={() => window.open("https://habblive.in", "_blank")}
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Entrar no Habblive</span>
            <span className="sm:hidden">Habblive</span>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-3 sm:px-6 py-2 rounded-full text-xs sm:text-base shadow-lg flex-1 sm:flex-none"
            onClick={() => window.open("https://radiohabb.live/", "_blank")}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.076.076 0 0 0 .084.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-3 sm:px-6 py-2 rounded-full text-xs sm:text-base shadow-lg flex-1 sm:flex-none"
            onClick={() => window.open("https://instagram.com/radio.habblive", "_blank")}
          >
            <Instagram className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Instagram</span>
            <span className="sm:hidden">Insta</span>
          </Button>
        </div>

        <div className="text-center px-2">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">PROGRESSO DO FUTURO SITE</h3>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-64 sm:w-80 h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative animate-pulse"
                style={{ width: "5%" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-75"></div>
                <div className="absolute right-0 top-0 h-full w-1 bg-white/50 animate-pulse"></div>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white">5%</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm max-w-xs sm:max-w-md whitespace-nowrap overflow-hidden text-ellipsis">
            Desenvolvido por Michael, Discord: explodido
          </p>
        </div>

        <audio
          ref={audioRef}
          src={streamUrl}
          preload="none"
          onLoadStart={() => setIsAudioLoading(true)}
          onCanPlay={() => setIsAudioLoading(false)}
          onError={() => {
            setIsAudioLoading(false)
            setIsPlaying(false)
          }}
        />
      </div>
    </div>
  )
}
