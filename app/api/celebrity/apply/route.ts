import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendApplicationStatusEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "dateOfBirth", "category", "experience", "languages"]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate experience length
    if (body.experience.length < 50) {
      return NextResponse.json({ error: "Experience description must be at least 50 characters" }, { status: 400 })
    }

    // Validate languages array
    if (!Array.isArray(body.languages) || body.languages.length === 0) {
      return NextResponse.json({ error: "At least one language must be selected" }, { status: 400 })
    }

    // Validate required documents
    if (!body.hasProfilePhoto) {
      return NextResponse.json({ error: "Profile photo is required" }, { status: 400 })
    }

    if (!body.hasIdDocumentFront) {
      return NextResponse.json({ error: "Front of government ID is required" }, { status: 400 })
    }

    if (!body.hasIdDocumentBack) {
      return NextResponse.json({ error: "Back of government ID is required" }, { status: 400 })
    }

    if (!body.hasIntroVideo) {
      return NextResponse.json({ error: "Introduction video is required" }, { status: 400 })
    }

    // Validate terms agreement
    if (!body.agreeToTerms) {
      return NextResponse.json({ error: "You must agree to the Terms of Service and Privacy Policy" }, { status: 400 })
    }

    // Check if application already exists
    const existingApplication = await prisma.celebrityApplication.findUnique({
      where: { email: body.email },
    })

    if (existingApplication) {
      return NextResponse.json({ error: "An application with this email already exists" }, { status: 400 })
    }

    // Extract social media data
    const socialMedia = body.socialMedia || {}

    // Create the application with all new fields
    const application = await prisma.celebrityApplication.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth,
        nationality: body.nationality || null,
        category: body.category,
        experience: body.experience,
        merchandiseLink: body.merchandiseLink || null, // New field
        instagramHandle: socialMedia.instagram || null,
        twitterHandle: socialMedia.twitter || null,
        tiktokHandle: socialMedia.tiktok || null,
        youtubeHandle: socialMedia.youtube || null,
        otherSocialMedia: socialMedia.other || null,
        languages: body.languages,
        specialRequests: body.specialRequests || null,
        hasProfilePhoto: body.hasProfilePhoto || false,
        hasIdDocument: body.hasIdDocumentFront || false, // Keep for backward compatibility
        hasIdDocumentFront: body.hasIdDocumentFront || false, // New field
        hasIdDocumentBack: body.hasIdDocumentBack || false, // New field
        hasIntroVideo: body.hasIntroVideo || false, // New field
        profilePhotoUrl: body.profilePhotoUrl || null,
        idDocumentUrl: body.idDocumentFrontUrl || null, // Keep for backward compatibility
        idDocumentFrontUrl: body.idDocumentFrontUrl || null, // New field
        idDocumentBackUrl: body.idDocumentBackUrl || null, // New field
        introVideoUrl: body.introVideoUrl || null, // New field
        agreeToTerms: body.agreeToTerms || false, // New field
        status: "PENDING",
      },
    })

    console.log("✅ Celebrity application created:", application.id)

    // Send confirmation email
    try {
      await sendApplicationStatusEmail(
        application.email,
        application.fullName,
        "PENDING",
        "Thank you for applying to become talent on Kia Ora Kahi! We've received your application and will review it within 2-3 business days.",
      )
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError)
      // Don't fail the application if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! We'll review it and get back to you within 2-3 business days.",
      applicationId: application.id,
    })
  } catch (error) {
    console.error("❌ Celebrity application error:", error)
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
  }
}
