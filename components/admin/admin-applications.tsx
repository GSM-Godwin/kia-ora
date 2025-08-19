"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  DollarSign,
  Share2,
  FileText,
  ExternalLink,
  TrendingUp,
  ImageIcon,
  PlayCircle,
  Link2,
} from "lucide-react"

interface Application {
  id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  category: string
  experience: string
  instagramHandle?: string
  twitterHandle?: string
  tiktokHandle?: string
  youtubeHandle?: string
  otherSocialMedia?: string
  followerCount: string
  basePrice: number
  rushPrice: number
  languages: string[]
  availability: string
  specialRequests?: string
  status: string
  createdAt: string
  reviewNotes?: string
  reviewedAt?: string
  reviewedBy?: string
  merchandiseLink?: string
  hasIdDocumentFront: boolean
  hasIdDocumentBack: boolean
  idDocumentFrontUrl?: string
  idDocumentBackUrl?: string
  hasIntroVideo: boolean
  introVideoUrl?: string
  agreeToTerms: boolean
  profilePhotoUrl?: string
  idDocumentUrl?: string
  verificationDocumentUrl?: string
}

interface ApplicationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  thisMonth: number
  lastMonth: number
}

export function AdminApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("PENDING")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [currentPage, searchTerm, statusFilter, categoryFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
      })

      const response = await fetch(`/api/admin/applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
        setTotalPages(Math.ceil(data.total / 10))
      } else {
        toast.success("Failed to fetch applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast.error("Failed to fetch applications")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/applications/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setReviewNotes(application.reviewNotes || "")
    setShowDetailModal(true)
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      setUpdating(true)
      const endpoint =
        newStatus === "APPROVED"
          ? `/api/admin/applications/${applicationId}/approve`
          : `/api/admin/applications/${applicationId}`

      const response = await fetch(endpoint, {
        method: newStatus === "APPROVED" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          reviewNotes,
        }),
      })

      if (response.ok) {
        if (newStatus === "APPROVED") {
          toast.success("Application approved successfully! Celebrity profile created.")
        } else {
          toast.success(`Application ${newStatus.toLowerCase()} successfully`)
        }
        setShowDetailModal(false)
        fetchApplications()
        fetchStats()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update application")
      }
    } catch (error) {
      console.error("Error updating application:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update application status")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "APPROVED":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "REJECTED":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats?.total || 0,
      change: stats ? `+${stats.thisMonth - stats.lastMonth}` : "+0",
      changeType: stats && stats.thisMonth > stats.lastMonth ? "positive" : "neutral",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pending Review",
      value: stats?.pending || 0,
      change: "Awaiting review",
      changeType: "neutral",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Approved",
      value: stats?.approved || 0,
      change: "Active celebrities",
      changeType: "positive",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "This Month",
      value: stats?.thisMonth || 0,
      change: stats ? `vs ${stats.lastMonth} last month` : "vs 0 last month",
      changeType: stats && stats.thisMonth > stats.lastMonth ? "positive" : "neutral",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Celebrity Applications
        </h1>
        <p className="text-gray-400">Review and manage celebrity applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Actor">Actor</SelectItem>
                <SelectItem value="Musician">Musician</SelectItem>
                <SelectItem value="Athlete">Athlete</SelectItem>
                <SelectItem value="Influencer">Influencer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Applications</CardTitle>
          <CardDescription className="text-gray-400">{applications.length} applications found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.profilePhotoUrl || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {application.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-medium">{application.fullName}</h3>
                      <p className="text-gray-400 text-sm">{application.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                          {application.category}
                        </Badge>
                        <Badge className={`${getStatusColor(application.status)} text-xs`}>{application.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleViewApplication(application)}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 text-purple-300 bg-purple-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Previous
              </Button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Application Review
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and make a decision on this celebrity application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplication.profilePhotoUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-purple-500 text-white text-xl">
                    {selectedApplication.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="break-words overflow-hidden">
                  <h2 className="text-2xl font-bold text-white break-words overflow-hidden text-ellipsis">
                    {selectedApplication.fullName}
                  </h2>
                  <p className="text-gray-400 break-words overflow-hidden text-ellipsis">{selectedApplication.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedApplication.status)}>{selectedApplication.status}</Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {selectedApplication.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white/10 border-white/20">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <User className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents & Media
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experience
                  </TabsTrigger>
                  {/* <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pricing
                  </TabsTrigger> */}
                  <TabsTrigger value="social" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <Share2 className="w-4 h-4 mr-2" />
                    Social Media
                  </TabsTrigger>
                  <TabsTrigger value="review" className="data-[state=active]:bg-purple-500 text-white data-[state=active]:text-black">
                    <FileText className="w-4 h-4 mr-2" />
                    Review
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-white">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400">Full Name</label>
                            <p className="text-white font-medium break-words">{selectedApplication.fullName}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Email</label>
                            <p className="text-white font-medium break-words">{selectedApplication.email}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Phone</label>
                            <p className="text-white font-medium">{selectedApplication.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Date of Birth</label>
                            <p className="text-white font-medium">
                              {new Date(selectedApplication.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Nationality</label>
                            <p className="text-white font-medium">{selectedApplication.nationality}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Category</label>
                            <p className="text-white font-medium">{selectedApplication.category}</p>
                          </div>
                        </div>
                        {selectedApplication.languages && selectedApplication.languages.length > 0 && (
                          <div>
                            <label className="text-sm text-gray-400">Languages</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedApplication.languages.map((language) => (
                                <Badge
                                  key={language}
                                  variant="outline"
                                  className="border-purple-500/30 text-purple-300"
                                >
                                  {language}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-white">Other Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">Special Requests</label>
                          <p className="text-white font-medium break-words">
                            {selectedApplication.specialRequests || "None"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Availability</label>
                          <p className="text-white font-medium">{selectedApplication.availability}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Documents & Media Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-white">Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <ImageIcon className="w-8 h-8 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">Profile Photo</p>
                            <p className="text-gray-400 text-sm">
                              {selectedApplication.profilePhotoUrl ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                          {selectedApplication.profilePhotoUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 text-purple-300 bg-transparent"
                              onClick={() => window.open(selectedApplication.profilePhotoUrl, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-400" />
                            <div className="flex-1">
                              <p className="text-white font-medium">Government ID - Front</p>
                              <p className="text-gray-400 text-sm">
                                {selectedApplication.hasIdDocumentFront ? "Uploaded" : "Not uploaded"}
                              </p>
                            </div>
                            {selectedApplication.idDocumentFrontUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 text-purple-300 bg-transparent"
                                onClick={() => window.open(selectedApplication.idDocumentFrontUrl, "_blank")}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-400" />
                            <div className="flex-1">
                              <p className="text-white font-medium">Government ID - Back</p>
                              <p className="text-gray-400 text-sm">
                                {selectedApplication.hasIdDocumentBack ? "Uploaded" : "Not uploaded"}
                              </p>
                            </div>
                            {selectedApplication.idDocumentBackUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/30 text-purple-300 bg-transparent"
                                onClick={() => window.open(selectedApplication.idDocumentBackUrl, "_blank")}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <PlayCircle className="w-8 h-8 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">Introduction Video</p>
                            <p className="text-gray-400 text-sm">
                              {selectedApplication.hasIntroVideo ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                          {selectedApplication.introVideoUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 text-purple-300 bg-transparent"
                              onClick={() => window.open(selectedApplication.introVideoUrl, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <FileText className="w-8 h-8 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">Verification Document</p>
                            <p className="text-gray-400 text-sm">
                              {selectedApplication.verificationDocumentUrl ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                          {selectedApplication.verificationDocumentUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 text-purple-300 bg-transparent"
                              onClick={() => window.open(selectedApplication.verificationDocumentUrl, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-white">Terms Agreement</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-6">
                        {selectedApplication.agreeToTerms ? (
                          <div className="text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-white font-medium">Agreed to Terms</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <p className="text-white font-medium">Did Not Agree to Terms</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Professional Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">Experience</label>
                          <p className="text-white leading-relaxed whitespace-pre-wrap break-words">
                            {selectedApplication.experience}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-6">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Pricing Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white/5 rounded-lg">
                          <h3 className="text-white font-semibold mb-2">Base Price</h3>
                          <p className="text-3xl font-bold text-purple-300 mb-2">${selectedApplication.basePrice}</p>
                          <p className="text-gray-400 text-sm">Standard delivery time</p>
                        </div>
                        <div className="text-center p-6 bg-white/5 rounded-lg">
                          <h3 className="text-white font-semibold mb-2">Rush Price</h3>
                          <p className="text-3xl font-bold text-purple-300 mb-2">${selectedApplication.rushPrice}</p>
                          <p className="text-gray-400 text-sm">24-hour delivery</p>
                        </div>
                        <div className="text-center p-6 bg-white/5 rounded-lg">
                          <h3 className="text-white font-semibold mb-2">Availability</h3>
                          <p className="text-xl font-bold text-green-400 mb-2">{selectedApplication.availability}</p>
                          <p className="text-gray-400 text-sm">Response time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="space-y-6">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Social Media Presence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.instagramHandle && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">Instagram</p>
                              <p className="text-gray-400 text-sm break-words">{selectedApplication.instagramHandle}</p>
                            </div>
                          </div>
                        )}
                        {selectedApplication.twitterHandle && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">Twitter</p>
                              <p className="text-gray-400 text-sm break-words">{selectedApplication.twitterHandle}</p>
                            </div>
                          </div>
                        )}
                        {selectedApplication.youtubeHandle && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                              <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">YouTube</p>
                              <p className="text-gray-400 text-sm break-words">{selectedApplication.youtubeHandle}</p>
                            </div>
                          </div>
                        )}
                        {selectedApplication.merchandiseLink && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                              <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">Merchandise</p>
                              <p className="text-gray-400 text-sm break-words">{selectedApplication.merchandiseLink}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 p-4 bg-white/5 rounded-lg">
                        <label className="text-sm text-gray-400">Follower Count</label>
                        <p className="text-white font-medium text-lg">{selectedApplication.followerCount}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Review Tab */}
                <TabsContent value="review" className="space-y-6">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Review & Decision</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Review Notes</label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add your review notes here..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                        />
                      </div>
                      {selectedApplication.status === "PENDING" && (
                        <div className="flex gap-4 pt-4">
                          <Button
                            onClick={() => handleStatusUpdate(selectedApplication.id, "APPROVED")}
                            disabled={updating}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {updating ? "Processing..." : "Approve Application"}
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(selectedApplication.id, "REJECTED")}
                            disabled={updating}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            {updating ? "Processing..." : "Reject Application"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
