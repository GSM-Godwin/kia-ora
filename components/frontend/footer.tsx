"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, Heart } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const footerSections = [
    // {
    //   title: "Platform",
    //   links: [
    //     { name: "Browse Talent", href: "/celebrities" },
    //     { name: "Categories", href: "/categories" },
    //     { name: "How It Works", href: "/how-it-works" },
    //     { name: "Pricing", href: "/pricing" },
    //   ],
    // },
    {
      title: "Services",
      links: [
        { name: "Quick shout-outs", href: "/services?service=shoutouts" },
        { name: "Personalised and Motivational video messages", href: "/services?service=personal" },
        { name: "Roast someone", href: "/services?service=roast" },
        { name: "Live interaction", href: "/services?service=live" },
        { name: "Business endorsements", href: "/services?service=business" },
        // { name: "Motivational video messages", href: "/services?service=motivation" },
      ],
    },
    //     {
    //   title: "Company",
    //   links: [
    //     { name: "Terms and Conditions", href: "/terms" },
    //     { name: "Privacy Policy", href: "/privacy" },
    //     { name: "Community Guidelines", href: "/safety" },
    //   ],
    // },
    {
      title: "Support",
      links: [
        // { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Safety Guidelines", href: "/safety" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/people/Kia-Ora-Kahi/61579284869536", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/kiaorakahi", label: "Instagram" },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-black border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(138,43,226,0.1),transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 text-center border-b border-white/10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay Updated with Talent News</h2>
          <p className="text-xl text-yellow-200 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new talent, exclusive offers, and platform features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-yellow-500"
            />
            <Button className="bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-black font-bold px-8">
              Subscribe
            </Button>
          </div>
        </motion.div> */}

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-black" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Kia Ora Kahi
                </span>
              </Link>
              <p className="text-yellow-200 mb-6 leading-relaxed">
                Connect with your favorite talent for personalised messages, birthday greetings, and exclusive
                experiences. Making dreams come true, one message at a time.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-yellow-200">
                  <Mail className="w-5 h-5" />
                  <span>hello@kiaora.com</span>
                </div>
                {/* <div className="flex items-center space-x-3 text-yellow-200">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div> */}
                {/* <div className="flex items-center space-x-3 text-yellow-200">
                  <MapPin className="w-5 h-5" />
                  <span>Los Angeles, CA</span>
                </div> */}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-yellow-200 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-yellow-200">
              <span>© 2025 Kia Ora Kahi.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-yellow-200 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-yellow-200 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-yellow-200 hover:text-white transition-colors duration-200">
                Community Guidelines
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-yellow-200 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}