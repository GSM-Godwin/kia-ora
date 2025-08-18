"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Users,
  Star,
  Zap,
  Sparkles,
  Calendar,
  Globe,
  X,
  Copy,
  ExternalLink,
  PhoneCall,
} from "lucide-react"
import Navbar from "@/components/frontend/navbar"
import Footer from "@/components/frontend/footer"
import LiveChatWidget from "@/components/frontend/live-chat-widget"
import MobileNavbar from "@/components/frontend/mobile-navbar"

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

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email Support",
    description: "Get detailed help via email",
    contact: "support@kiaora.com",
    responseTime: "Within 24 hours",
    color: "from-blue-500 to-cyan-500",
    availability: "24/7",
    action: "email",
  },
  // {
  //   icon: <MessageCircle className="w-8 h-8" />,
  //   title: "Live Chat",
  //   description: "Instant help from our team",
  //   contact: "Available on website",
  //   responseTime: "Usually instant",
  //   color: "from-green-500 to-emerald-500",
  //   availability: "9 AM - 9 PM PST",
  //   action: "chat",
  // },
  // {
  //   icon: <Phone className="w-8 h-8" />,
  //   title: "Phone Support",
  //   description: "Speak directly with our team",
  //   contact: "+1 (555) 123-4567",
  //   responseTime: "Immediate",
  //   color: "from-purple-500 to-indigo-500",
  //   availability: "Mon-Fri, 9 AM - 6 PM PST",
  //   action: "phone",
  // },
  // {
  //   icon: <Calendar className="w-8 h-8" />,
  //   title: "Schedule a Call",
  //   description: "Book a personalized consultation",
  //   contact: "Book online",
  //   responseTime: "Same day",
  //   color: "from-pink-500 to-rose-500",
  //   availability: "Flexible scheduling",
  //   action: "schedule",
  // },
]

const supportCategories = [
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "General Questions",
    description: "How Kia Ora works, pricing, and platform features",
    action: "general",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Account Support",
    description: "Login issues, profile updates, and account management",
    action: "account",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Booking Help",
    description: "Celebrity selection, custom requests, and order status",
    action: "booking",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Technical Issues",
    description: "Website problems, video playback, and app support",
    action: "technical",
  },
]

const officeLocations = [
  {
    city: "Los Angeles",
    address: "1234 Hollywood Blvd, Suite 567",
    zipCode: "Los Angeles, CA 90028",
    phone: "+1 (555) 123-4567",
    email: "la@kiaora.com",
    isHeadquarters: true,
  },
  {
    city: "New York",
    address: "456 Broadway, Floor 12",
    zipCode: "New York, NY 10013",
    phone: "+1 (555) 987-6543",
    email: "ny@kiaora.com",
    isHeadquarters: false,
  },
  {
    city: "London",
    address: "789 Oxford Street",
    zipCode: "London W1C 1JN, UK",
    phone: "+44 20 7123 4567",
    email: "london@kiaora.com",
    isHeadquarters: false,
  },
]

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)

  // Schedule state
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [scheduleData, setScheduleData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    callType: "phone",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        subject: "",
        message: "",
        priority: "normal",
      })
    }, 3000)
  }

  const handleContactMethodClick = (action: string) => {
    switch (action) {
      case "email":
        setShowEmailModal(true)
        break
      case "chat":
        // Remove this case - chat will be handled by the widget
        break
      case "phone":
        setShowPhoneModal(true)
        break
      case "schedule":
        setShowScheduleModal(true)
        break
    }
  }

  const handleSupportCategoryClick = (action: string) => {
    setFormData((prev) => ({ ...prev, category: action }))
    // Scroll to form
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle schedule submission
    console.log("Schedule data:", { ...scheduleData, date: selectedDate, time: selectedTime })
    setShowScheduleModal(false)
    // Reset form
    setScheduleData({ name: "", email: "", phone: "", reason: "", callType: "phone" })
    setSelectedDate("")
    setSelectedTime("")
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "chat":
        // Remove this case - chat will be handled by the widget
        break
      case "faq":
        setShowFAQModal(true)
        break
      case "schedule":
        setShowScheduleModal(true)
        break
    }
  }

  const handleEmergencyContact = (type: string) => {
    if (type === "phone") {
      window.open("tel:+15559114357")
    } else if (type === "email") {
      window.open("mailto:urgent@kiaora.com")
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <SubtleLuxuryStarfield />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Contact Support
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              We're Here to Help
            </h1>
            <p className="text-xl sm:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              Get in touch with our support team through your preferred method. We're committed to providing you with
              the best possible experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Choose Your Preferred Contact Method</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              We offer multiple ways to get in touch, so you can reach us however works best for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => handleContactMethodClick(method.action)}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{method.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                    <p className="text-purple-200 mb-4">{method.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2 text-purple-300">
                        <Globe className="w-4 h-4" />
                        <span>{method.contact}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-purple-300">
                        <Clock className="w-4 h-4" />
                        <span>{method.responseTime}</span>
                      </div>
                      <div className="text-green-400 font-medium">{method.availability}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Form and Support Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5" id="contact-form">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6">Send us a Message</h3>
                  <p className="text-purple-200 mb-8">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                      <p className="text-purple-200">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-white mb-2 block">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-500"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white mb-2 block">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-500"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      {/* <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone" className="text-white mb-2 block">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-500"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-white mb-2 block">
                            Support Category *
                          </Label>
                          <select
                            id="category"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:border-purple-500"
                          >
                            <option value="" className="bg-slate-800">
                              Select a category
                            </option>
                            <option value="general" className="bg-slate-800">
                              General Questions
                            </option>
                            <option value="account" className="bg-slate-800">
                              Account Support
                            </option>
                            <option value="booking" className="bg-slate-800">
                              Booking Help
                            </option>
                            <option value="technical" className="bg-slate-800">
                              Technical Issues
                            </option>
                            <option value="billing" className="bg-slate-800">
                              Billing & Payments
                            </option>
                            <option value="celebrity" className="bg-slate-800">
                              Celebrity Partnership
                            </option>
                          </select>
                        </div>
                      </div> */}

                      {/* <div>
                        <Label htmlFor="priority" className="text-white mb-2 block">
                          Priority Level
                        </Label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:border-purple-500"
                        >
                          <option value="low" className="bg-slate-800">
                            Low - General inquiry
                          </option>
                          <option value="normal" className="bg-slate-800">
                            Normal - Standard support
                          </option>
                          <option value="high" className="bg-slate-800">
                            High - Urgent issue
                          </option>
                          <option value="critical" className="bg-slate-800">
                            Critical - Service disruption
                          </option>
                        </select>
                      </div> */}

                      <div>
                        <Label htmlFor="subject" className="text-white mb-2 block">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-500"
                          placeholder="Brief description of your inquiry"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-white mb-2 block">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-500 resize-none"
                          placeholder="Please provide as much detail as possible about your inquiry..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Categories & Quick Help */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Support Categories */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">What can we help you with?</h3>
                  <div className="space-y-4">
                    {supportCategories.map((category, index) => (
                      <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleSupportCategoryClick(category.action)}
                      >
                        <div className="text-purple-400 mt-1">{category.icon}</div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">{category.title}</h4>
                          <p className="text-purple-200 text-sm">{category.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {/* <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleQuickAction("chat")}
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Start Live Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleQuickAction("faq")}
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      Browse FAQ
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleQuickAction("schedule")}
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Schedule a Call
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

              {/* Emergency Contact */}
              {/* <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 backdrop-blur-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-bold text-white">Urgent Issues?</h3>
                  </div>
                  <p className="text-red-200 mb-4">
                    For critical issues affecting your account or urgent booking problems, contact us immediately:
                  </p>
                  <div className="space-y-2">
                    <div
                      className="flex items-center gap-2 text-red-200 cursor-pointer hover:text-red-100 transition-colors"
                      onClick={() => handleEmergencyContact("phone")}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold">+1 (555) 911-HELP</span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-red-200 cursor-pointer hover:text-red-100 transition-colors"
                      onClick={() => handleEmergencyContact("email")}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="font-semibold">urgent@kiaora.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Our Global Offices</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              We have offices around the world to better serve our global community of fans and celebrities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{office.city}</h3>
                      {office.isHeadquarters && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Headquarters</Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-purple-200">
                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{office.address}</div>
                          <div>{office.zipCode}</div>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-3 text-purple-200 cursor-pointer hover:text-purple-100 transition-colors"
                        onClick={() => window.open(`tel:${office.phone}`)}
                      >
                        <Phone className="w-5 h-5" />
                        <span>{office.phone}</span>
                      </div>
                      <div
                        className="flex items-center gap-3 text-purple-200 cursor-pointer hover:text-purple-100 transition-colors"
                        onClick={() => window.open(`mailto:${office.email}`)}
                      >
                        <Mail className="w-5 h-5" />
                        <span>{office.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Guarantee */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
            <Clock className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Our Response Time Guarantee</h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              We're committed to providing fast, helpful support. Here's what you can expect:
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">{"< 1 hour"}</div>
                <div className="text-purple-200">Live Chat Response</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{"< 24 hours"}</div>
                <div className="text-purple-200">Email Response</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">Same Day</div>
                <div className="text-purple-200">Phone Call Back</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Email Support</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowEmailModal(false)}>
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div className="flex-1">
                    <div className="text-white font-medium">support@kiaora.com</div>
                    <div className="text-purple-200 text-sm">General support inquiries</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("support@kiaora.com")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
                  <Mail className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <div className="text-white font-medium">billing@kiaora.com</div>
                    <div className="text-purple-200 text-sm">Billing and payment issues</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard("billing@kiaora.com")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={() => window.open("mailto:support@kiaora.com")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Email App
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPhoneModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Phone Support</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowPhoneModal(false)}>
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">+1 (555) 123-4567</div>
                  <div className="text-purple-200">Available Mon-Fri, 9 AM - 6 PM PST</div>
                </div>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={() => window.open("tel:+15551234567")}
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => copyToClipboard("+1 (555) 123-4567")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Number
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Schedule a Call</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowScheduleModal(false)}>
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Full Name *</Label>
                    <Input
                      required
                      value={scheduleData.name}
                      onChange={(e) => setScheduleData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={scheduleData.email}
                      onChange={(e) => setScheduleData((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Phone Number *</Label>
                    <Input
                      type="tel"
                      required
                      value={scheduleData.phone}
                      onChange={(e) => setScheduleData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Call Type *</Label>
                    <select
                      required
                      value={scheduleData.callType}
                      onChange={(e) => setScheduleData((prev) => ({ ...prev, callType: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2"
                    >
                      <option value="phone" className="bg-slate-800">
                        Phone Call
                      </option>
                      <option value="video" className="bg-slate-800">
                        Video Call
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Preferred Date *</Label>
                    <Input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Preferred Time *</Label>
                    <select
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2"
                    >
                      <option value="" className="bg-slate-800">
                        Select a time
                      </option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time} className="bg-slate-800">
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Reason for Call *</Label>
                  <Textarea
                    required
                    rows={4}
                    value={scheduleData.reason}
                    onChange={(e) => setScheduleData((prev) => ({ ...prev, reason: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 resize-none"
                    placeholder="Please describe what you'd like to discuss..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {showFAQModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFAQModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFAQModal(false)}>
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white/10 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">How do I book a celebrity?</h4>
                  <p className="text-purple-200 text-sm">
                    Browse our celebrity list, select your favorite, fill out the request form with your details, and
                    complete payment. You'll receive your personalized video within the promised timeframe.
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">What if I'm not satisfied with my video?</h4>
                  <p className="text-purple-200 text-sm">
                    We offer a 100% satisfaction guarantee. If you're not happy with your video, we'll work with the
                    celebrity to make it right or provide a full refund.
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">How long does delivery take?</h4>
                  <p className="text-purple-200 text-sm">
                    Most celebrities deliver within 7 days, though some may be faster. You'll see the expected delivery
                    time on each celebrity's profile before booking.
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Can I request specific content?</h4>
                  <p className="text-purple-200 text-sm">
                    Yes! You can provide detailed instructions about what you'd like the celebrity to say, including
                    specific names, occasions, and personal touches.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => {
                    setShowFAQModal(false)
                    // Navigate to full FAQ page
                    window.location.href = "/faq"
                  }}
                >
                  View All FAQs
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveChatWidget />
      <Footer />
    </div>
  )
}