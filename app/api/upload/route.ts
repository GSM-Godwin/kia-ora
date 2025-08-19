import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    const type: string = data.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large. Maximum 5MB allowed." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "video/mp4",
      "video/webm",
      "video/x-msvideo",   // AVI
      "video/quicktime",   // MOV
      "video/x-matroska"   // MKV
    ];    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only videos, images and PDFs are allowed." }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `celebrity-applications/${type}-${timestamp}-${sanitizedFileName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("✅ File uploaded to Vercel Blob:", blob.url)

    return NextResponse.json({
      message: "File uploaded successfully",
      filename: blob.pathname,
      url: blob.url,
      type,
      size: file.size,
    })
  } catch (error) {
    console.error("❌ Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}