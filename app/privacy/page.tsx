"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Users, Database, Globe, Sparkles, Cookie, Baby, AlertTriangle, Mail } from "lucide-react"
import Navbar from "@/components/frontend/navbar"
import Footer from "@/components/frontend/footer"
import { useEffect, useState } from "react"
import MobileNavbar from "@/components/frontend/mobile-navbar"

const privacySections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    icon: <Database className="w-6 h-6" />,
    content: [
      {
        subtitle: "When you set up an account or make a purchase",
        text: "We may collect Personal Information such as your name, address, phone number, email address, social media information, payment information and other similar information when you set up an account or make a purchase. This may include sensitive information such as racial or ethnic origin or health information. We may also collect Personal Information belonging to the recipient of a video, including the name of the recipient. KOK also collects instructions for a video, which may include Personal Information.",
      },
      {
        subtitle: "When you provide content to our Websites",
        text: "Our Websites may allow you to submit content to us, such as a video, review, photo, bio, social media post, or other communication, which may be considered sensitive information. Our Websites also allow celebrities to submit content and data. Any content submitted to our Websites is subject to the applicable Terms and Conditions.",
      },
      {
        subtitle: "When you use our Websites",
        text: "We receive and store certain types of information from you when you interact with our Websites to process transactions and help improve your overall online experience. This includes data on the pages you access, your computer IP address, device identifiers, the type of operating system you are using, your location, mobile network information, standard web log data, and other information.",
      },
      {
        subtitle: "Third parties",
        text: "We may obtain information about you from third parties who you have approved giving us information. This may include Personal Information relating to any third-party account that you link to your KOK account.",
      },
      {
        subtitle: "Other ways",
        text: "We may also collect additional information from or about you in other ways, such as through contact with our customer support team, suppliers, or service providers, your responses to a survey, competitions, employment applications, or as otherwise notified to you at the time.",
      },
    ],
  },
  {
    id: "information-use",
    title: "Using Personal Information",
    icon: <Eye className="w-6 h-6" />,
    content: [
      {
        text: "KOK only collects, holds, and handles information about you that is necessary for us to perform the services you request from us, that is otherwise reasonably necessary for our business activities, or if required by law, court, or tribunal order. We may use Personal Information we collect about you for purposes including:",
      },
      {
        subtitle: "Service provision",
        text: "Provide (or assess whether to provide) KOK products or services to you, such as the processing of orders and service notifications by email or SMS; manage our business relationship with you, including profile creation, customer support, administrative matters, and dispute resolution.",
      },
      {
        subtitle: "Video creation",
        text: "Create personalised videos as instructed by you (note, unless you opt out, some Personal Information, including your name, the recipient's name and the video itself may be publicly displayed on our Websites and may be shared, used or accessed by other people).",
      },
      {
        subtitle: "Business improvement",
        text: "Research for improvement of our products and services, understand your personal preferences, and understand your level of customer satisfaction; improve our Websites and for other internal business purposes, such as record keeping and document retention.",
      },
      {
        subtitle: "Security and compliance",
        text: "Investigate and prevent potentially prohibited or illegal activities; enforce our agreement with you for the provision of our services.",
      },
      {
        subtitle: "Marketing and analytics",
        text: "Market to you, including delivering targeted marketing, service update notices, and promotional offers; perform data analytics, including the use of Google Analytics.",
      },
    ],
  },
  {
    id: "information-sharing",
    title: "Disclosing Personal Information to Other Parties",
    icon: <Users className="w-6 h-6" />,
    content: [
      {
        text: "We may share your Personal Information with:",
      },
      {
        subtitle: "Our business partners",
        text: "Our affiliates and related companies; our partners, advisors, suppliers, and service providers who help with our business operations, including fraud prevention, payment processing, marketing (including online ads), customer service, and technology services.",
      },
      {
        subtitle: "Celebrities",
        text: "Celebrity, so that they can create personalised videos for you following your instructions.",
      },
      {
        subtitle: "Business transactions",
        text: "Companies that we plan to merge with or be acquired by, or that may invest in us.",
      },
      {
        subtitle: "Legal requirements",
        text: "Law enforcement, government agencies or officials, or other third parties under a subpoena, court order, or other legal process or requirement applicable to KOK; or when we believe, in our sole discretion, that the disclosure of Personal Information is necessary to prevent physical harm, fraud or financial loss, to report suspected illegal activity or to investigate suspected violations of our agreements.",
      },
      {
        subtitle: "Safety and protection",
        text: "Third parties, when we believe the disclosure is necessary to protect the rights, property, or safety of another, including a Star; your nominated referees so that we may check your references if you are applying for a position with KOK.",
      },
      {
        text: "Please note that these third parties may be in other countries, including but not limited to New Zealand, where the laws on processing Personal Information may be less stringent than in your jurisdiction. When we disclose your Personal Information overseas, we will take all reasonable measures to ensure that your information is held, managed, and accessed under appropriate standards.",
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    icon: <Mail className="w-6 h-6" />,
    content: [
      {
        text: "KOK may send marketing materials from time to time to those who have provided KOK with Personal Information. If you signed up to receive newsletters or other marketing communications from us, you can opt out at any time by clicking the unsubscribe link at the bottom of the message.",
      },
      {
        subtitle: "Opt-out processing time",
        text: "Even after you opt out or update your marketing preferences, please allow us sufficient time to process your marketing preferences. Unless otherwise required to process your requests earlier by law, it may take up to 5 business days to process your opt-out requests in relation to receipt of electronic marketing materials such as emails and SMS, and up to 30 days for all other marketing-related requests.",
      },
      {
        subtitle: "Transactional communications",
        text: "Even after you opt out of receiving marketing communications from us, we may still contact you for transactional or informational purposes. These include, for example, customer service issues, inquiries relating to videos, account maintenance, or any questions regarding a specific order.",
      },
    ],
  },
  {
    id: "cookies-tracking",
    title: "Cookies and Tracking Tools",
    icon: <Cookie className="w-6 h-6" />,
    content: [
      {
        subtitle: "Cookie usage",
        text: "We may use cookies and track IP addresses via our Websites so we can improve our services provided by our Websites and enhance your user experience. When you access our Websites, we may place small data files on your computer or other device. These data files may be cookies, pixel tags, 'Flash cookies,' or other local storage provided by your browser.",
      },
      {
        subtitle: "Cookie control",
        text: "Your browser may give you the ability to control cookies. How you do so, however, depends on your browser and the type of cookie. Certain browsers can be set to reject all browser cookies. If you configure your computer to block all cookies, you may disrupt certain web page features and limit the functionality we can provide.",
      },
      {
        subtitle: "Google Analytics",
        text: "Google and other third parties collect data about traffic to this site. Google Analytics uses Cookies to monitor traffic to and use of the Websites. We will not identify you to Google, and will not merge personal and non-personal information collected through this service. You can prevent the use of Google Analytics Cookies by downloading and installing a Browser Plugin available at https://tools.google.com/dlpage/gaoptout?hl=en.",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    icon: <Baby className="w-6 h-6" />,
    content: [
      {
        text: "You confirm that you are either more than 18 years of age, or you are a parent or legal guardian who consents and is responsible for obtaining the necessary consents from your child for handling their personal information as set out in this Privacy Policy. You also agree that you will ensure your child's compliance with this Privacy Policy.",
      },
      {
        subtitle: "Parental control",
        text: "Parents or legal guardians who obtain an account on behalf of a child will be able to access and amend all that child's information. Children will not be able to delete or amend certain information or content in their account without such parent's or guardian's consent. How parents or guardians exercise their parental control is their decision, and KOK does not control or restrict parental decisions to amend or delete information or content.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Protecting Personal Information",
    icon: <Lock className="w-6 h-6" />,
    content: [
      {
        text: "KOK takes commercially reasonable security efforts to keep your Personal Information secure and protect it from loss, misuse, unauthorised access, disclosure, and alteration.",
      },
      {
        subtitle: "Security measures",
        text: "We protect your Personal Information using physical, technical, and administrative security measures to reduce the risks of loss, misuse, unauthorised access, disclosure, and alteration. We take reasonable steps to destroy or de-identify your Personal Information when we no longer need it (except as required by law to retain the information).",
      },
      {
        subtitle: "Ongoing security",
        text: "We also review our security procedures periodically to consider appropriate new technology and updated methods. Only properly authorised people who have a need to access Personal Information to perform their job will be able to see or use that information. Even so, despite our reasonable efforts, no security measure is 100% secure.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Accessing and Requesting Correction of Personal Information",
    icon: <Shield className="w-6 h-6" />,
    content: [
      {
        text: "We will strive to ensure that information about you is accurate when we collect or use it. Subject to some exceptions under privacy laws in your jurisdiction, we invite you to access, correct, or update any Personal Information we hold about you. We may charge a small fee to cover our costs of supplying the information.",
      },
      {
        subtitle: "Access requests",
        text: "Unless we do not agree to your request for access to Personal Information, in most cases, KOK will provide you with access as soon as reasonably possible following receipt of your request. If you request corrections to your Personal Information and KOK agrees with your request, these changes will be made as soon as practicable.",
      },
      {
        subtitle: "Data retention",
        text: "If you wish to delete certain information from our systems, please note that we may need to retain certain information for record-keeping purposes, to complete purchases, resolve disputes, or to comply with our legal obligations.",
      },
    ],
  },
  {
    id: "international-sms",
    title: "International Phone Numbers",
    icon: <Globe className="w-6 h-6" />,
    content: [
      {
        text: "KOK operates a campaign that sends opted-in subscribers video messages via text messages. Message frequency will vary. Reply HELP for more information or email admin@kiaorakahi.com to seek more information. Message and data rates may apply. Carriers are not liable for delayed or undelivered messages. Reply STOP to opt out.",
      },
      {
        subtitle: "Information sharing",
        text: "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.",
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

export default function PrivacyPage() {
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
              Privacy Policy
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
              Your privacy is important to us, and so is being open and transparent about how we collect, manage, and
              use information about you. This Privacy Policy covers the Personal Information we collect and how we
              handle it.
            </p>
            <div className="text-purple-300">
              <p>Last updated: 08 August 2025</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-200 mb-2">Important Information</h3>
                    <p className="text-blue-100 leading-relaxed">
                      In this Privacy Policy, "Personal Information" covers information about an identified individual
                      or a reasonably identifiable individual. Personal Information may also include sensitive
                      information about a specific person, such as racial or ethnic origin. Personal Information does
                      not include information that has been made anonymous and cannot reasonably identify a specific
                      person.
                    </p>
                    <p className="text-blue-100 leading-relaxed mt-3">
                      The Websites may contain links to third-party websites or apps. These linked sites are not under
                      our control, and we are not responsible for the content on these sites, nor are these sites
                      subject to this Privacy Policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {privacySections.map((section, index) => (
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
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
            <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Questions About Privacy?</h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              If you have any questions, comments, or concerns about this Privacy Policy, or wish to make a complaint
              regarding KOK's management of your Personal Information, please contact us.
            </p>
            <div className="space-y-4">
              <p className="text-purple-200">
                <strong>Email:</strong> admin@kiaorakahi.com
              </p>
              <p className="text-purple-200">
                <strong>Address:</strong> Counter Delivery Service, Lake Rotoma
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
