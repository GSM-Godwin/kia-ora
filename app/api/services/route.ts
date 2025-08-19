import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { servicesData } from "@/lib/services-data"

export async function GET() {
  try {
    // Try to fetch services from database first
    const dbServices = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        features: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })

    // If we have services in database, use them
    if (dbServices.length > 0) {
      const formattedServices = dbServices.map((service) => ({
        id: service.id,
        numericId: service.numericId,
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        icon: service.icon,
        color: service.color,
        startingPrice: service.startingPrice,
        asapPrice: service.asapPrice,
        currency: service.currency,
        duration: service.duration,
        deliveryTime: service.deliveryTime,
        asapDeliveryTime: service.asapDeliveryTime,
        popular: service.popular,
        features: service.features.map((f) => f.text),
        samples: Array.isArray(service.samples)
          ? service.samples
          : typeof service.samples === "string"
            ? JSON.parse(service.samples)
            : [],
        talents: Array.isArray(service.talents)
          ? service.talents
          : typeof service.talents === "string"
            ? JSON.parse(service.talents)
            : [],
      }))

      return NextResponse.json({
        services: formattedServices,
        totalServices: formattedServices.length,
        fallbackDataUsed: false,
        stats: {
          total: formattedServices.length,
          active: formattedServices.length,
          verified: formattedServices.filter((s) => s.popular).length,
        },
        source: "database",
      })
    }

    // Fallback to static data if no services in database
    console.log("No services found in database, using fallback data")

    const fallbackServices = servicesData.map((service) => ({
      id: service.id,
      numericId: service.numericId,
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      icon: service.icon,
      color: service.color,
      startingPrice: service.startingPrice,
      asapPrice: service.asapPrice,
      currency: service.currency || "nzd",
      duration: service.duration,
      deliveryTime: service.deliveryTime,
      asapDeliveryTime: service.asapDeliveryTime,
      popular: service.popular,
      features: service.features,
      samples: service.samples,
      talents: service.talents,
    }))

    return NextResponse.json({
      services: fallbackServices,
      totalServices: fallbackServices.length,
      fallbackDataUsed: true,
      stats: {
        total: fallbackServices.length,
        active: fallbackServices.length,
        verified: fallbackServices.filter((s) => s.popular).length,
      },
      source: "fallback",
    })
  } catch (error) {
    console.error("Error in services API:", error)

    // Return fallback data on error
    console.log("Database error, using fallback data")

    const fallbackServices = servicesData.map((service) => ({
      id: service.id,
      numericId: service.numericId,
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      icon: service.icon,
      color: service.color,
      startingPrice: service.startingPrice,
      asapPrice: service.asapPrice,
      currency: service.currency || "nzd",
      duration: service.duration,
      deliveryTime: service.deliveryTime,
      asapDeliveryTime: service.asapDeliveryTime,
      popular: service.popular,
      features: service.features,
      samples: service.samples,
      talents: service.talents,
    }))

    return NextResponse.json({
      services: fallbackServices,
      totalServices: fallbackServices.length,
      fallbackDataUsed: true,
      stats: {
        total: fallbackServices.length,
        active: fallbackServices.length,
        verified: fallbackServices.filter((s) => s.popular).length,
      },
      source: "error-fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
