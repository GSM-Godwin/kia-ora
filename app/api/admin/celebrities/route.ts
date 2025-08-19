import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          category: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    if (category && category !== "all") {
      where.category = {
        contains: category,
        mode: "insensitive",
      }
    }

    if (status && status !== "all") {
      where.isActive = status === "ACTIVE"
    }

    // Get celebrities with user data and stats
    const [celebrities, total] = await Promise.all([
      prisma.celebrity.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          bookings: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { averageRating: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.celebrity.count({ where }),
    ])

    // Format the response
    const formattedCelebrities = celebrities.map((celebrity) => {
      const totalEarnings = celebrity.bookings
        .filter((booking) => booking.status === "COMPLETED")
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

      return {
        id: celebrity.id,
        name: celebrity.user.name || "Celebrity",
        email: celebrity.user.email || "",
        category: celebrity.category || "Entertainment",
        // basePrice: celebrity.pricePersonal || celebrity.price || 299,
        rating: celebrity.averageRating || 0,
        totalBookings: celebrity._count.bookings || 0,
        totalEarnings: Math.round(totalEarnings / 100), // Convert from cents to dollars
        completionRate: celebrity.completionRate || 0,
        stripeConnectStatus: celebrity.stripeConnectStatus || "NOT_CONNECTED",
        status: celebrity.isActive ? "ACTIVE" : "SUSPENDED",
        featured: celebrity.featured || false,
        createdAt: celebrity.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      celebrities: formattedCelebrities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching celebrities for admin:", error)
    return NextResponse.json({ error: "Failed to fetch celebrities" }, { status: 500 })
  }
}