import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: celebrityId } = await params

    const celebrity = await prisma.celebrity.findUnique({
      where: {
        id: celebrityId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        sampleVideos: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    })

    if (!celebrity) {
      return NextResponse.json({ error: "Celebrity not found" }, { status: 404 })
    }

    // Format the response to match the expected structure
    const formattedCelebrity = {
      id: celebrity.id,
      name: celebrity.user.name || "Celebrity",
      email: celebrity.user.email || "",
      image: celebrity.user.image || "/placeholder.svg?height=400&width=400",
      coverImage: celebrity.coverImage || celebrity.user.image || "/placeholder.svg?height=400&width=1200",
      category: celebrity.category || "Entertainment",
      rating: celebrity.averageRating || 4.5,
      reviewCount: celebrity._count.reviews || 0,
      responseTime: celebrity.responseTime || "24 hours",
      verified: celebrity.verified || false,
      featured: celebrity.featured || false,
      bio: celebrity.bio || "Professional celebrity",
      longBio: celebrity.longBio || celebrity.bio || "Professional celebrity with years of experience",
      tags: celebrity.tags || [],
      achievements: celebrity.achievements || [],
      sampleVideos: celebrity.sampleVideos.map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail || "/placeholder.svg?height=200&width=300",
        duration: video.duration || "0:30",
        videoUrl: video.videoUrl,
      })),
      availability: {
        nextAvailable: celebrity.nextAvailable || "2024-01-15",
        completionRate: celebrity.completionRate || 95,
        totalOrders: celebrity._count.bookings || 0,
      },
      reviews: celebrity.reviews.map((review) => ({
        id: review.id,
        user: review.user.name || "Anonymous",
        rating: review.rating,
        date: new Date(review.createdAt).toLocaleDateString(),
        comment: review.comment || "",
        verified: review.verified,
        occasion: review.occasion || "General",
      })),
    }

    return NextResponse.json(formattedCelebrity)
  } catch (error) {
    console.error("Error fetching celebrity:", error)
    return NextResponse.json({ error: "Failed to fetch celebrity" }, { status: 500 })
  }
}
