"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  FileText,
  Crown,
  Zap,
  Shield,
  TrendingUp,
  Camera,
  BadgeIcon as IdCard,
  Loader2,
  CheckCircle,
  Video,
  Play,
  ExternalLink,
  ShoppingBag,
} from "lucide-react"
import { toast } from "sonner"
import Navbar from "@/components/frontend/navbar"
import Footer from "@/components/frontend/footer"
import MobileNavbar from "@/components/frontend/mobile-navbar"
import Link from "next/link"

interface SocialMedia {
  instagram: string
  twitter: string
  tiktok: string
  youtube: string
  other: string
}

interface FormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string

  // Professional Information
  category: string
  experience: string
  merchandiseLink: string

  // Social Media
  socialMedia: SocialMedia

  // Additional Info
  languages: string[]
  specialRequests: string

  // Documents
  hasProfilePhoto: boolean
  hasIdDocumentFront: boolean
  hasIdDocumentBack: boolean
  hasIntroVideo: boolean
  profilePhotoUrl?: string
  idDocumentFrontUrl?: string
  idDocumentBackUrl?: string
  introVideoUrl?: string

  // Terms Agreement
  agreeToTerms: boolean
}

interface UploadedFile {
  filename: string
  url: string
  type: string
  size: number
}

// Subtle starfield component
const SubtleLuxuryStarfield = () => {
  useEffect(() => {
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

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "About You", icon: Briefcase },
  { id: 3, title: "Documents", icon: FileText },
]

const categories = [
  "Actor/Actress",
  "Musician/Singer",
  "Athlete",
  "Influencer",
  "Comedian",
  "Author/Writer",
  "Chef",
  "Entrepreneur",
  "TV Personality",
  "Model",
  "Other",
]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Other",
]

export default function JoinCelebrityPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    category: "",
    experience: "",
    merchandiseLink: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      tiktok: "",
      youtube: "",
      other: "",
    },
    languages: [],
    specialRequests: "",
    hasProfilePhoto: false,
    hasIdDocumentFront: false,
    hasIdDocumentBack: false,
    hasIntroVideo: false,
    profilePhotoUrl: undefined,
    idDocumentFrontUrl: undefined,
    idDocumentBackUrl: undefined,
    introVideoUrl: undefined,
    agreeToTerms: false,
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const updateFormData = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, any>),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleFileUpload = async (file: File, type: string) => {
    setUploadingFiles((prev) => ({ ...prev, [type]: true }))
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadedFiles((prev) => ({ ...prev, [type]: result }))

        // Update form data based on upload type
        if (type === "profile") {
          updateFormData("hasProfilePhoto", true)
          updateFormData("profilePhotoUrl", result.url)
        } else if (type === "id-front") {
          updateFormData("hasIdDocumentFront", true)
          updateFormData("idDocumentFrontUrl", result.url)
        } else if (type === "id-back") {
          updateFormData("hasIdDocumentBack", true)
          updateFormData("idDocumentBackUrl", result.url)
        } else if (type === "intro-video") {
          updateFormData("hasIntroVideo", true)
          updateFormData("introVideoUrl", result.url)
        }

        toast.success(`${type.replace("-", " ")} uploaded successfully!`)
      } else {
        toast.error(result.error || "Upload failed")
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [type]: false }))
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.dateOfBirth)
      case 2:
        return !!(formData.category && formData.experience.length >= 50 && formData.languages.length > 0)
      case 3:
        return (
          formData.hasProfilePhoto &&
          formData.hasIdDocumentFront &&
          formData.hasIdDocumentBack &&
          formData.hasIntroVideo &&
          formData.agreeToTerms
        )
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    } else {
      toast.error("Please complete all required fields before proceeding.")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Please complete all required fields and agree to the terms.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/celebrity/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        toast.success("Application submitted successfully!")
      } else {
        toast.error(result.error || "Submission failed")
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / 3) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        {/* Starfield Background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  Application Submitted Successfully! 🎉
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 text-lg mb-8"
                >
                  Thank you for applying to become talent on Kia Ora Kahi! Our team will review your application within
                  1-3 business days and get back to you via email.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Our team reviews your application and documents</li>
                      <li>• We may contact you for additional information</li>
                      <li>• Upon approval, we'll help you set up your profile</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                  >
                    Return to Home
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {/* Starfield Background */}
      <SubtleLuxuryStarfield />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative mb-12"
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.5),transparent)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Become Talent
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of celebrities and creators earning money through personalized video messages
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-purple-600 border-purple-600 text-white"
                          : isActive
                            ? "bg-purple-600/20 border-purple-500 text-purple-400"
                            : "bg-gray-800 border-gray-600 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive ? "text-purple-400" : isCompleted ? "text-purple-300" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                          isCompleted ? "bg-purple-600" : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
          </motion.div>

          {/* Form Steps */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                        <p className="text-gray-400">Tell us about yourself</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-white">
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => updateFormData("fullName", e.target.value)}
                            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => updateFormData("phone", e.target.value)}
                            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-white">
                            Date of Birth *
                          </Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="nationality" className="text-white">
                            Nationality
                          </Label>
                          <Input
                            id="nationality"
                            value={formData.nationality}
                            onChange={(e) => updateFormData("nationality", e.target.value)}
                            className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                            placeholder="Enter your nationality (optional)"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: About You */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">About You</h2>
                        <p className="text-gray-400">Share your background and connect your social media</p>
                      </div>

                      <div className="space-y-8">
                        {/* Professional Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Professional Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="category" className="text-white">
                                Category *
                              </Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) => updateFormData("category", value)}
                              >
                                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white focus:border-purple-500">
                                  <SelectValue placeholder="Select your category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category}
                                      value={category}
                                      className="text-white hover:bg-gray-800"
                                    >
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-white">Languages Spoken *</Label>
                              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                {languages.map((language) => (
                                  <label key={language} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.languages.includes(language)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          updateFormData("languages", [...formData.languages, language])
                                        } else {
                                          updateFormData(
                                            "languages",
                                            formData.languages.filter((l) => l !== language),
                                          )
                                        }
                                      }}
                                      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-white">{language}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="experience" className="text-white">
                                Tell us about yourself * (minimum 50 characters)
                              </Label>
                              <Textarea
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => updateFormData("experience", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 min-h-[120px]"
                                placeholder="Share your background, experience, what makes you unique, and why you'd like to create personalized videos for fans..."
                              />
                              <div className="text-right text-sm text-gray-400">
                                {formData.experience.length}/50 characters
                              </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="merchandiseLink" className="text-white flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" />
                                Merchandise/Product Link (Optional)
                              </Label>
                              <Input
                                id="merchandiseLink"
                                value={formData.merchandiseLink}
                                onChange={(e) => updateFormData("merchandiseLink", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="Link to your products, merchandise, or store"
                              />
                              <p className="text-gray-400 text-sm">
                                Share a link to your merchandise, products, or online store (optional)
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        {/* Social Media */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Social Media (Optional)</h3>
                          <p className="text-gray-400 text-sm">
                            Connect your social media to help us verify your identity
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="instagram" className="text-white">
                                Instagram
                              </Label>
                              <Input
                                id="instagram"
                                value={formData.socialMedia.instagram}
                                onChange={(e) => updateFormData("socialMedia.instagram", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="@username"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="twitter" className="text-white">
                                Twitter/X
                              </Label>
                              <Input
                                id="twitter"
                                value={formData.socialMedia.twitter}
                                onChange={(e) => updateFormData("socialMedia.twitter", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="@username"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tiktok" className="text-white">
                                TikTok
                              </Label>
                              <Input
                                id="tiktok"
                                value={formData.socialMedia.tiktok}
                                onChange={(e) => updateFormData("socialMedia.tiktok", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="@username"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="youtube" className="text-white">
                                YouTube
                              </Label>
                              <Input
                                id="youtube"
                                value={formData.socialMedia.youtube}
                                onChange={(e) => updateFormData("socialMedia.youtube", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="Channel name or URL"
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="other" className="text-white">
                                Other Social Media
                              </Label>
                              <Input
                                id="other"
                                value={formData.socialMedia.other}
                                onChange={(e) => updateFormData("socialMedia.other", e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                                placeholder="LinkedIn, Twitch, etc."
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        {/* Additional Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                          <div className="space-y-2">
                            <Label htmlFor="specialRequests" className="text-white">
                              Special Requests or Notes
                            </Label>
                            <Textarea
                              id="specialRequests"
                              value={formData.specialRequests}
                              onChange={(e) => updateFormData("specialRequests", e.target.value)}
                              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                              placeholder="Any special requirements, limitations, or notes..."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Document Verification</h2>
                        <p className="text-gray-400">Upload required documents for verification</p>
                      </div>

                      <div className="space-y-6">
                        {/* Profile Photo */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Camera className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">Profile Photo *</h3>
                            {formData.hasProfilePhoto && <CheckCircle className="w-5 h-5 text-green-400" />}
                          </div>
                          <p className="text-gray-400 text-sm">
                            Upload a clear, professional headshot that will be used on your profile
                          </p>
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            <input
                              type="file"
                              id="profile-photo"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, "profile")
                              }}
                              className="hidden"
                            />
                            <label htmlFor="profile-photo" className="cursor-pointer">
                              {uploadingFiles.profile ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                  <span className="text-white">Uploading...</span>
                                </div>
                              ) : formData.hasProfilePhoto ? (
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                  <span className="text-green-400">Profile photo uploaded</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="w-8 h-8 text-gray-400" />
                                  <span className="text-white">Click to upload profile photo</span>
                                  <span className="text-gray-400 text-sm">PNG, JPG, WEBP up to 5MB</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Government ID - Front */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <IdCard className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">Government ID *</h3>
                            {formData.hasIdDocumentFront && formData.hasIdDocumentBack && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            Upload clear photos of both the front and back of your government-issued ID (passport,
                            driver's license, etc.)
                          </p>

                          {/* Front of ID */}
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Front of ID *</Label>
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                              <input
                                type="file"
                                id="id-document-front"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload(file, "id-front")
                                }}
                                className="hidden"
                              />
                              <label htmlFor="id-document-front" className="cursor-pointer">
                                {uploadingFiles["id-front"] ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                    <span className="text-white">Uploading...</span>
                                  </div>
                                ) : formData.hasIdDocumentFront ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400">Front of ID uploaded</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="text-white">Click to upload front of ID</span>
                                    <span className="text-gray-400 text-sm">PNG, JPG, PDF up to 5MB</span>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>

                          {/* Back of ID */}
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Back of ID *</Label>
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                              <input
                                type="file"
                                id="id-document-back"
                                accept="image/*,application/pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload(file, "id-back")
                                }}
                                className="hidden"
                              />
                              <label htmlFor="id-document-back" className="cursor-pointer">
                                {uploadingFiles["id-back"] ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                    <span className="text-white">Uploading...</span>
                                  </div>
                                ) : formData.hasIdDocumentBack ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400">Back of ID uploaded</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="text-white">Click to upload back of ID</span>
                                    <span className="text-gray-400 text-sm">PNG, JPG, PDF up to 5MB</span>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Introduction Video */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">Introduction Video *</h3>
                            {formData.hasIntroVideo && <CheckCircle className="w-5 h-5 text-green-400" />}
                          </div>
                          <p className="text-gray-400 text-sm">
                            Upload a 15-30 second introduction video to help us get to know you better
                          </p>

                          {/* Example Video */}
                          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Play className="w-5 h-5 text-blue-400 mt-0.5" />
                              <div>
                                <h4 className="text-white font-semibold mb-1">Example Introduction Video</h4>
                                <p className="text-blue-200 text-sm mb-3">
                                  Here's an example of what your introduction video should look like:
                                </p>
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <Play className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">Sample Introduction</p>
                                      <p className="text-gray-400 text-sm">0:25 duration</p>
                                    </div>
                                  </div>
                                  <p className="text-gray-300 text-sm mt-3">
                                    "Hi! I'm [Your Name], and I'm excited to join Kia Ora Kahi! I love connecting with
                                    fans and creating personalized messages. I can't wait to make something special just
                                    for you!"
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            <input
                              type="file"
                              id="intro-video"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, "intro-video")
                              }}
                              className="hidden"
                            />
                            <label htmlFor="intro-video" className="cursor-pointer">
                              {uploadingFiles["intro-video"] ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                  <span className="text-white">Uploading...</span>
                                </div>
                              ) : formData.hasIntroVideo ? (
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                  <span className="text-green-400">Introduction video uploaded</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="w-8 h-8 text-gray-400" />
                                  <span className="text-white">Click to upload introduction video</span>
                                  <span className="text-gray-400 text-sm">
                                    MP4, MOV, AVI up to 50MB (15-30 seconds)
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Terms and Conditions Agreement */}
                        <div className="space-y-4">
  <Separator className="bg-gray-700" />
  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
    <div className="flex items-center gap-3">
      <Checkbox
        id="agree-terms"
        checked={formData.agreeToTerms}
        onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
        className="border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
      />
      <Label
        htmlFor="agree-terms"
        className="text-white text-sm cursor-pointer flex flex-wrap gap-1"
      >
        By clicking here, you agree to the{" "}
        <Link
          href="/terms"
          className="text-blue-400 hover:text-blue-300 underlin"
          target="_blank"
        >
          Kia Ora Kahi Terms and Conditions
        </Link>
        and acknowledge you have read the{" "}
        <Link
          href="/privacy"
          className="text-blue-400 hover:text-blue-300 underline"
          target="_blank"
        >
          Kia Ora Kahi Privacy Policy
        </Link>
        to learn how we collect, use and share your data.
      </Label>
    </div>
  </div>
</div>


                        {/* Privacy Notice */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div>
                              <h4 className="text-white font-semibold mb-1">Privacy & Security</h4>
                              <p className="text-gray-300 text-sm">
                                All uploaded documents are encrypted and stored securely. They will only be used for
                                verification purposes and will not be shared with third parties.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-700">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !validateStep(3)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Crown,
                  title: "Premium Platform",
                  description: "Join an exclusive platform for verified celebrities and creators",
                },
                {
                  icon: Zap,
                  title: "Easy Setup",
                  description: "Quick onboarding process with dedicated support team",
                },
                {
                  icon: Shield,
                  title: "Secure & Safe",
                  description: "Advanced security measures to protect your privacy and earnings",
                },
                {
                  icon: TrendingUp,
                  title: "Grow Your Brand",
                  description: "Expand your reach and connect with fans in a meaningful way",
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 shadow-lg shadow-purple-500/10 h-full">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
