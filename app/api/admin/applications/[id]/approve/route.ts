import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendApplicationStatusEmail } from "@/lib/email"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applicationId = params.id

    // Get the application
    const application = await prisma.celebrityApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    if (application.status !== "PENDING") {
      return NextResponse.json({ error: "Application already processed" }, { status: 400 })
    }

    console.log("🔍 Processing application approval for:", application.fullName)
    console.log("📸 Profile photo URL:", application.profilePhotoUrl)

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists
      let user = await tx.user.findUnique({
        where: { email: application.email },
      })

      if (!user) {
        // Create new user account with the uploaded profile photo
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10)

        user = await tx.user.create({
          data: {
            name: application.fullName,
            email: application.email,
            role: "CELEBRITY",
            isVerified: true,
            password: hashedPassword,
            image: application.profilePhotoUrl,
          },
        })
        console.log("✅ Created new user with image:", user.image)
      } else {
        // Update existing user to celebrity role and set profile image
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            role: "CELEBRITY",
            isVerified: true,
            image: application.profilePhotoUrl,
          },
        })
        console.log("✅ Updated existing user with image:", user.image)
      }

      // Create celebrity profile with ALL required fields
      const celebrity = await tx.celebrity.create({
        data: {
          userId: user.id,
          bio: `${application.experience}`,
          category: application.category,
          rating: 4.5,
          averageRating: 4.5,
          totalReviews: 0,
          completionRate: 95,
          isActive: true,
          verified: true,
          featured: false,
          tags: application.languages || [],
          nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          coverImage: application.profilePhotoUrl || null,
          // Social media handles
          // instagramHandle: application.instagramHandle,
          // twitterHandle: application.twitterHandle,
          // tiktokHandle: application.tiktokHandle,
          // youtubeHandle: application.youtubeHandle,
          // followerCount: application.followerCount || 0,
          // languages: application.languages || ["English"],
          // availability: application.availability || "24 hours",
        },
      })
      console.log("✅ Created celebrity profile with image:", celebrity.coverImage)

      // Update application status
      await tx.celebrityApplication.update({
        where: { id: applicationId },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
          reviewNotes: "Application approved and celebrity profile created",
        },
      })

      return { user, celebrity }
    })

    // Send approval email using the existing function
    try {
      await sendApplicationStatusEmail(
        application.email,
        application.fullName,
        "APPROVED",
        `Congratulations! Your application has been approved. You can now access your celebrity dashboard and start receiving booking requests. Welcome to the Kia Ora family!`,
      )
      console.log("✅ Approval email sent successfully")
    } catch (emailError) {
      console.error("❌ Failed to send approval email:", emailError)
    }

    return NextResponse.json({
      message: "Application approved successfully",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        image: result.user.image,
      },
      celebrity: {
        id: result.celebrity.id,
        category: result.celebrity.category,
        image: result.celebrity.coverImage,
      },
    })
  } catch (error) {
    console.error("❌ Error approving application:", error)
    return NextResponse.json(
      {
        error: "Failed to approve application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
