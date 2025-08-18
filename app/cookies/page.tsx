"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, AlertTriangle, Heart, Scale, Eye, Sparkles, Flag, Lock, Ban } from "lucide-react"
import Navbar from "@/components/frontend/navbar"
import Footer from "@/components/frontend/footer"
import { useEffect, useState } from "react"
import MobileNavbar from "@/components/frontend/mobile-navbar"

const guidelinesSections = [
  {
    id: "mission",
    title: "Our Mission",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    content: [
      {
        text: "Kia Ora Kahi's mission is to create personalised and authentic connections between celebrities and their fans. Connect with your favourite celebrity or social media personality to receive a bespoke video message.",
      },
      {
        text: "We want KOK to be welcoming, fun, and memorable for everyone involved. We've developed these Community Guidelines to help ensure that KOK is a positive and safe experience for all the talent, fans, and businesses who use it.",
      },
    ],
  },
  {
    id: "authentic-accounts",
    title: "Authentic Accounts",
    icon: <Shield className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    content: [
      {
        subtitle: "Be Real",
        text: "Don't provide a false identity or submit any incorrect or misleading information about yourself, including your affiliations with other individuals, entities, or online accounts, when you sign up for a KOK account. Use your name and photographs/videos (or the names or images of characters you own or have the rights to use). Fake accounts will not be tolerated.",
      },
      {
        subtitle: "No Multiple Accounts",
        text: "If you're mid-suspension or have been banned from KOK, please don't try and test our enforcement processes. We also ask that you not create multiple accounts unless you have a legitimate reason for doing so (for example, a talent who portrays different characters).",
      },
      {
        subtitle: "No Account Transfers",
        text: "Your KOK account may not be transferred or sold. If you have questions about your talent account, please contact admin@kiaorakahi.com.",
      },
    ],
  },
  {
    id: "platform-use",
    title: "Proper Platform Use",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    content: [
      {
        subtitle: "Personal Connections",
        text: "KOK is about personal connections, and each KOK video should be tailored to the fan's request. If you're a talent, don't reuse content -- it's boring and not what our service is for.",
      },
      {
        subtitle: "No Financial Advice",
        text: "Don't use KOK to solicit or provide financial advice. Don't book or record videos that reference, support, or critique specific stocks, NFTs, tokens, cryptocurrencies, or other investments.",
      },
      {
        subtitle: "Keep Transactions on Platform",
        text: "Fans and talent must complete all transactions through the KOK platform. For everyone's safety, we require that you keep it on KOK.",
      },
      {
        subtitle: "No Spam or Deception",
        text: "Don't misuse KOK by sending unauthorised advertising or commercial messages, including spam or any other unsolicited communication. Don't use KOK to deceive or mislead others.",
      },
    ],
  },
  {
    id: "illegal-conduct",
    title: "Illegal Conduct",
    icon: <Scale className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    content: [
      {
        subtitle: "Legal Compliance",
        text: "KOK's Terms and Conditions require that you use our Site only in compliance with all applicable laws. You may not promote, encourage, or engage in any illegal conduct on, using, or directed at KOK.",
      },
      {
        subtitle: "Business Endorsements",
        text: "If you are a User who uses KOK to book endorsements of their business, product, or service, you may do so only by booking via the 'Business Endorsement' under our services. Businesses must comply with the Fair Trading Act to ensure advertising is not misleading or deceptive.",
      },
      {
        subtitle: "Honest Endorsements",
        text: "When a Talent appears in a KOK video endorsing a product, service, or business, they must express only their honest opinions, findings, experiences, and beliefs. Talent must not misrepresent that they are an independent user of a product they endorse.",
      },
    ],
  },
  {
    id: "hate-speech",
    title: "Hate Speech & Discrimination",
    icon: <Ban className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    content: [
      {
        text: "We are proud to celebrate the diversity of the celebrities and fans on KOK. We do not tolerate hateful or disparaging speech, slurs, or derogatory terms. The same goes for content that attacks, demeans, dehumanises, discriminates, or threatens violence, including based on any legally protected characteristic, such as race, sex, ethnicity, national origin, religion, sexual orientation, gender identity, age, disability, or veteran status.",
      },
    ],
  },
  {
    id: "violence",
    title: "Violence & Harmful Content",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "from-red-600 to-red-500",
    content: [
      {
        text: "Inciting, encouraging, promoting, threatening, or depicting violence, cruelty, terrorism, or harm, including towards oneself or animals, is prohibited on KOK. Don't post or solicit content that glorifies, advocates, or promotes these things, including in the pursuit of political, religious, ethnic, racial, or ideological objectives.",
      },
    ],
  },
  {
    id: "explicit-content",
    title: "Explicit Content & Minors",
    icon: <Eye className="w-6 h-6" />,
    color: "from-purple-600 to-pink-600",
    content: [
      {
        subtitle: "No Explicit Content",
        text: "KOK is not the place to send or solicit pornographic, indecent, obscene, or sexually explicit content. Nudity on KOK is prohibited, including genitalia, fully-nude buttocks, and female nipples, except in the case of breastfeeding or health-related situations.",
      },
      {
        subtitle: "Protecting Minors",
        text: "Sexualising minors is Strictly Prohibited. Do not distribute, post, send, or solicit any sexually explicit content of minors, or any content that displays or promotes the physical abuse, neglect, endangerment, or psychological disparagement or harm of children.",
      },
    ],
  },
  {
    id: "harassment",
    title: "Harassment & Bullying",
    icon: <Shield className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    content: [
      {
        subtitle: "Play Nice",
        text: "Don't post or solicit content that is (or incites or encourages) illegal, abusive, harassing, hateful, racist, derogatory, or harmful to someone's reputation. Many celebrities on KOK are public figures, but they have feelings, too.",
      },
      {
        subtitle: "Respect Boundaries",
        text: "If you're blocked by someone or they decline contact with you for any reason, just move on. Don't try to contact them elsewhere. We (like most people) consider that to be harassment.",
      },
      {
        subtitle: "No Employee Harassment",
        text: "Do not harass KOK employees. We have no tolerance for that.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: <Lock className="w-6 h-6" />,
    color: "from-teal-500 to-blue-500",
    content: [
      {
        subtitle: "Use Only What You Own",
        text: "Only submit what you own in its entirety (or have the rights to submit following our Terms and Conditions). This goes for music, artwork, written or spoken words, websites, screen shares, and anything else that is part of your content.",
      },
      {
        subtitle: "No Copying Our Service",
        text: "Don't access KOK to try and build a similar or competitive service, and don't attempt to decipher, decompile, disassemble, or reverse engineer any of the software or other underlying computer code used by us to provide our service.",
      },
    ],
  },
  {
    id: "enforcement",
    title: "How We Enforce Guidelines",
    icon: <Flag className="w-6 h-6" />,
    color: "from-gray-500 to-slate-500",
    content: [
      {
        subtitle: "Enforcement Actions",
        text: "Depending on the severity of the violation, KOK may enforce these Guidelines by: issuing a warning, removing content from KOK, temporarily suspending account access for a specified period, permanently suspending account access, or other action in KOK's sole discretion.",
      },
      {
        subtitle: "Appeals Process",
        text: "If you believe that an enforcement decision against you was incorrect, you may request an appeal in writing to admin@kiaorakahi.com. You must use the email address associated with the KOK account connected to our decision and include detailed reasons why you believe the decision was incorrect.",
      },
      {
        subtitle: "Cooperation Required",
        text: "In the spirit of keeping KOK safe and welcoming for all, you agree to cooperate with investigations conducted by KOK and promptly provide any information requested by KOK.",
      },
    ],
  },
]

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

export default function CommunityGuidelinesPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <SubtleLuxuryStarfield />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Community Guidelines
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
              Creating a safe, welcoming, and positive experience for all talent, fans, and businesses on our platform.
            </p>
            <div className="text-purple-300">
              <p>Last updated: August 8, 2025</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-red-200">Important Notice</h3>
              </div>
              <p className="text-red-200 leading-relaxed">
                <strong>
                  Any of the behaviors listed below may result in KOK taking action on your account or content, up to
                  and including a permanent suspension of your account.
                </strong>{" "}
                Encouraging or assisting the violation of any of these Guidelines is also a violation of them. We rely
                on both human review and automated screening to find potential violations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reporting Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-lg mb-12">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Flag className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Report Violations</h2>
                </div>
                <div className="space-y-4 text-purple-200 leading-relaxed">
                  <p>
                    If you have a concern about something on KOK, including a violation of these Guidelines or our Terms
                    and Conditions, please let us know by reporting the issue using the tools we provide on our
                    platforms (typically by selecting the report option).
                  </p>
                  <p>
                    To report an issue or misuse of a Business KOK video, please email us at{" "}
                    <strong className="text-white">admin@kiaorakahi.com</strong> with the subject heading,{" "}
                    <strong className="text-white">"KOK Video Issue!"</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Guidelines Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {guidelinesSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-full flex items-center justify-center`}
                      >
                        <div className="text-white">{section.icon}</div>
                      </div>
                      <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, idx) => (
                        <div key={idx}>
                          {"subtitle" in item && item.subtitle && (
                            <h3 className="text-xl font-semibold text-white mb-3">{item.subtitle}</h3>
                          )}
                          <p className="text-purple-200 leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
            <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Questions About Our Guidelines?</h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Community Guidelines or need to report a violation, please don't
              hesitate to contact us.
            </p>
            <div className="space-y-4">
              <p className="text-purple-200">
                <strong>Email:</strong> admin@kiaorakahi.com
              </p>
              <p className="text-purple-200">
                <strong>Subject for Reports:</strong> "KOK Video Issue!"
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
