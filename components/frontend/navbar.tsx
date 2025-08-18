"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Star, User, LogOut, Settings, Crown, House, LayoutDashboard, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { AuthModal } from "@/components/auth/auth-modal"
import SearchAutocomplete from "@/components/frontend/search-autocomplete"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin")
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Celebrities", href: "/celebrities" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Become Talent", href: "/join-celebrity" },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const handleSignInClick = () => {
    setAuthModalTab("signin")
    setShowAuthModal(true)
  }

  const handleSignUpClick = () => {
    setAuthModalTab("signup")
    setShowAuthModal(true)
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-yellow-500/10"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Kia Ora Kahi
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-64">
                <SearchAutocomplete placeholder="Search celebrities..." className="w-full" />
              </div>

              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {session.user?.role === "CELEBRITY" && (
                        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/10"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                        <p className="text-xs leading-none text-white/60">{session.user?.email}</p>
                        {session.user?.role === "CELEBRITY" && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                            <Crown className="w-3 h-3" />
                            Celebrity
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="text-white hover:bg-white/10">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                    {session.user?.role === "CELEBRITY" && (
                      <DropdownMenuItem className="text-white hover:bg-white/10">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <Link href="/celebrity-dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem className="text-white hover:bg-white/10">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <Link href="/admin">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white cursor-pointer"
                    onClick={handleSignInClick}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={handleSignUpClick}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            className={`lg:hidden overflow-hidden ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}`}
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="py-4 space-y-4 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl border-b border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 space-y-3 border-t border-white/10">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                          {session.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                        <p className="text-xs text-white/60 truncate">{session.user?.email}</p>
                      </div>
                      {session.user?.role === "CELEBRITY" && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => {
                        handleSignInClick()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={() => {
                        handleSignUpClick()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authModalTab} />
    </>
  )
}
