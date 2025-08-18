"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Video, Briefcase, Sparkles, Zap, Laugh, Gift, Clock, DollarSign } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Navbar from "@/components/frontend/navbar"
import MobileNavbar from "@/components/frontend/mobile-navbar"
import Footer from "@/components/frontend/footer"
import LiveChatWidget from "@/components/frontend/live-chat-widget"
import { useRouter } from "next/navigation"
import { formatPrice, heroGreetings } from "@/lib/services-data"
import type { EnhancedServiceData, ServicesApiResponse } from "@/types/services"

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Zap":
      return <Zap className="w-8 h-8" />
    case "MessageCircle":
      return <MessageCircle className="w-8 h-8" />
    case "Laugh":
      return <Laugh className="w-8 h-8" />
    case "Video":
      return <Video className="w-8 h-8" />
    case "Briefcase":
      return <Briefcase className="w-8 h-8" />
    case "Gift":
      return <Gift className="w-8 h-8" />
    default:
      return <Sparkles className="w-8 h-8" />
  }
}

const talents = [
  {
    id: 1,
    name: "Emma Stone",
    category: "Actor",
    rating: 4.9,
    price: "$299",
    image: "/placeholder.svg?height=400&width=300&text=Emma+Stone",
    badge: "Trending",
    discount: "20% OFF",
  },
  {
    id: 2,
    name: "John Legend",
    category: "Musician",
    rating: 5.0,
    price: "$599",
    image: "/placeholder.svg?height=400&width=300&text=John+Legend",
    badge: "New",
    discount: "Limited Time",
  },
  {
    id: 3,
    name: "Tony Robbins",
    category: "Motivator",
    rating: 4.8,
    price: "$899",
    image: "/placeholder.svg?height=400&width=300&text=Tony+Robbins",
    badge: "Popular",
    discount: "15% OFF",
  },
  {
    id: 4,
    name: "MrBeast",
    category: "Influencer",
    rating: 4.9,
    price: "$1299",
    image: "/placeholder.svg?height=400&width=300&text=MrBeast",
    badge: "Hot",
    discount: "New Offer",
  },
  {
    id: 5,
    name: "Oprah Winfrey",
    category: "Motivator",
    rating: 5.0,
    price: "$1999",
    image: "/placeholder.svg?height=400&width=300&text=Oprah+Winfrey",
    badge: "Premium",
    discount: "Exclusive",
  },
  {
    id: 6,
    name: "Ryan Reynolds",
    category: "Actor",
    rating: 4.7,
    price: "$799",
    image: "/placeholder.svg?height=400&width=300&text=Ryan+Reynolds",
    badge: "Comedy",
    discount: "25% OFF",
  },
]

const hasTalentWithImage = (service: EnhancedServiceData) => {
  return service.talents.some(talent => talent?.image && talent.image !== "/placeholder.svg");
};

const categories = ["All", "Actors", "Musicians", "Motivators", "Influencers"]

// Animated Hero Title Component
const AnimatedHeroTitle = () => {
  const greetings = heroGreetings
  const [currentGreeting, setCurrentGreeting] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [greetings.length])

  return (
    <motion.h1
      className="relative text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold bg-gradient-to-r from-white via-yellow-200 to-purple-200 bg-clip-text text-transparent mb-2"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
        filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))",
      }}
    >
      <motion.span
        key={currentGreeting}
        initial={{ opacity: 0, y: 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        animate={{
          opacity: 1,
          y: 0,
          textShadow: [
            "0 0 20px rgba(255, 215, 0, 0.5)",
            "0 0 40px rgba(138, 43, 226, 0.5)",
            "0 0 20px rgba(255, 215, 0, 0.5)",
          ],
        }}
      >
        {greetings[currentGreeting]}
      </motion.span>
    </motion.h1>
  )
}

// Subtle starfield component with fewer, more elegant stars
const SubtleLuxuryStarfield = () => {
  useEffect(() => {
    // Remove any existing starfield
    const existingStarfield = document.querySelector(".starfield")
    if (existingStarfield) {
      existingStarfield.remove()
    }

    const createStar = () => {
      const star = document.createElement("div")
      const size = Math.random() * 2 + 1
      const type = Math.random()

      if (type > 0.97) {
        star.className = "star diamond"
        star.style.width = `${size * 1.5}px`
        star.style.height = `${size * 1.5}px`
      } else if (type > 0.93) {
        star.className = "star sapphire"
        star.style.width = `${size * 1.2}px`
        star.style.height = `${size * 1.2}px`
      } else {
        star.className = "star"
        star.style.width = `${size}px`
        star.style.height = `${size}px`
      }

      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 5}s`

      return star
    }

    const starfield = document.createElement("div")
    starfield.className = "starfield"

    for (let i = 0; i < 60; i++) {
      starfield.appendChild(createStar())
    }

    document.body.appendChild(starfield)

    return () => {
      const starfieldToRemove = document.querySelector(".starfield")
      if (starfieldToRemove && document.body.contains(starfieldToRemove)) {
        document.body.removeChild(starfieldToRemove)
      }
    }
  }, [])

  return null
}

export default function KiaOraHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [currentTalentIndex, setCurrentTalentIndex] = useState(0)
  const [services, setServices] = useState<EnhancedServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [fallbackDataUsed, setFallbackDataUsed] = useState(false)
  const router = useRouter()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch services data from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/services")

        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }

        const data: ServicesApiResponse = await response.json()
        setServices(data.services)
        setFallbackDataUsed(data.fallbackDataUsed)

        if (data.fallbackDataUsed) {
          console.log("Using fallback data - no services in database yet")
          toast.info("Using demo data", {
            description: "Real service data will appear once services are added to the database",
          })
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services", {
          description: "Please refresh the page to try again",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Rotate through talent images to show variety
  useEffect(() => {
    const talentInterval = setInterval(() => {
      setCurrentTalentIndex((prev) => (prev + 1) % 3)
    }, 4000)

    return () => {
      clearInterval(talentInterval)
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(talents.length / 3))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const filteredTalents =
    selectedCategory === "All" ? talents : talents.filter((talent) => talent.category === selectedCategory.slice(0, -1))

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(talents.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(talents.length / 3)) % Math.ceil(talents.length / 3))
  }

  const handleBookNow = (talent: any) => {
    toast.success("Booking Started!", {
      description: `Starting booking process for ${talent.name}`,
      action: {
        label: "View Details",
        onClick: () => (window.location.href = `/celebrities/${talent.id}`),
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-200">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Subtle Luxury Starfield Background */}
      <SubtleLuxuryStarfield />

      {/* Conditional Navbar */}
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <div className="overflow-hidden relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20">
          {/* Luxury Glow Around Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-96 h-96 rounded-full bg-gradient-to-r from-yellow-400/10 via-purple-500/10 to-blue-500/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            {/* Animated Logo/Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8 relative"
            >
              {/* Animated Hero Title */}
              <AnimatedHeroTitle />

              {/* Personalised Videos Stamp - Directly under the text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ delay: 1.5, duration: 0.8, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  {/* Stamp background with border */}
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg border-2 border-white/30 shadow-lg transform">
                    <div className="text-sm sm:text-base lg:text-lg font-bold tracking-wider uppercase leading-tight text-center">
                      PERSONALISED VIDEOS
                    </div>
                  </div>
                  {/* Stamp glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-lg blur-md -z-10"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center justify-center gap-2 text-lg sm:text-xl lg:text-2xl text-yellow-200"
              >
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
                <span>
                  Connect with your favourite celebrity or social media personality to receive a bespoke video message
                  especially for you or as a special gift for someone else
                </span>
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.div>
            </motion.div>

            {/* Premium Services Circles */}
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
  transition={{ duration: 1, delay: 0.4 }}
  className="relative mb-12"
>
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
    <h2 className="text-2xl font-bold text-white mb-8">Featured Talents</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
      {services
        .filter(service => hasTalentWithImage(service)) // Only services with image talents
        .slice(0, 6) // Limit to first 6 that meet criteria
        .map((service, index) => {
          // Show different talents for variety - cycle through all 3 talents per service
          const talentIndex = (currentTalentIndex + index) % service.talents.length;
          const currentTalent = service.talents[talentIndex];

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => router.push(`/services?service=${service.id}`)}
            >
              {/* Service Circle with Rotating Talent */}
              <div className="relative mb-4">
                <div
                  className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                >
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={currentTalent?.image || "/placeholder.svg"}
                      alt={currentTalent?.name || "Talent"}
                      fill
                      className="object-cover rounded-full"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
                      priority={index < 3}
                    />
                  </div>
                  {/* Service Icon Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">{getIconComponent(service.icon)}</div>
                  </div>
                </div>
                {/* Sparkle Effect */}
                <motion.div
                  className="absolute -inset-2 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255, 215, 0, 0)",
                      "0 0 0 4px rgba(255, 215, 0, 0.3)",
                      "0 0 0 0 rgba(255, 215, 0, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                />
              </div>
              {/* Current Talent Name */}
              <p className="text-yellow-200 text-xs mt-1 opacity-75">{currentTalent?.name}</p>
            </motion.div>
          );
        })}
    </div>
  </div>
</motion.div>
          </div>
        </section>

        {/* Services Section with Pricing */}
        <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Our Services
              </h2>
              <p className="text-lg sm:text-xl text-yellow-200 max-w-3xl mx-auto">
                From shout-outs to live interactions, we offer personalised experiences for every occasion
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: isMobile ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group touch-manipulation cursor-pointer"
                  onClick={() => {
                    router.push(`/services?service=${service.id}`)
                  }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 h-full">
                    <CardContent className="p-6 sm:p-8">
                      {/* Service Icon */}
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="text-white">{getIconComponent(service.icon)}</div>
                      </div>

                      {/* Popular Badge */}
                      {service.popular && (
                        <Badge className="mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                          Most Popular
                        </Badge>
                      )}

                      {/* Service Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{service.title}</h3>

                      {/* Service Description */}
                      <p className="text-yellow-200 leading-relaxed mb-6">{service.description}</p>

                      {/* Pricing Information */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-300 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Starting Price:
                          </span>
                          <span className="text-white font-semibold">{formatPrice(service.startingPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-300 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Duration:
                          </span>
                          <span className="text-white">{service.duration}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-300">Delivery:</span>
                          <span className="text-white">{service.deliveryTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3">
                          <span className="text-orange-300 font-semibold">ASAP Price:</span>
                          <span className="text-orange-200 font-semibold">
                            {formatPrice(service.asapPrice)} within {service.asapDeliveryTime}
                          </span>
                        </div>
                      </div>

                      {/* Sample Talents Preview */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-3 text-sm">Featured Talents</h4>
                        <div className="flex -space-x-2">
                          {service.talents.slice(0, 3).map((talent, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden"
                            >
                              <Image
                                src={talent.image || "/placeholder.svg"}
                                alt={talent.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">+</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Live Chat Widget */}
      {/* <LiveChatWidget /> */}
    </div>
  )
}
