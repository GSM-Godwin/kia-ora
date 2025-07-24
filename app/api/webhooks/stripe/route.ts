import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, transferTipPayment } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  console.log("🎣 WEBHOOK CALLED - Starting webhook processing...")

  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    console.log("📋 Webhook Details:")
    console.log("   - Body length:", body.length)
    console.log("   - Has signature:", !!signature)
    console.log("   - Webhook secret exists:", !!process.env.STRIPE_WEBHOOK_SECRET)

    if (!signature) {
      console.log("❌ CRITICAL: No Stripe signature found in headers")
      console.log("📋 Available headers:", Object.fromEntries(headersList.entries()))
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("❌ CRITICAL: STRIPE_WEBHOOK_SECRET environment variable not set")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    let event: Stripe.Event
    try {
      console.log("🔐 Verifying webhook signature...")
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
      console.log("✅ Webhook signature verified successfully")
    } catch (err) {
      console.log("❌ CRITICAL: Webhook signature verification failed")
      console.log("📋 Error details:", err)
      console.log("📋 Signature received:", signature?.substring(0, 50) + "...")
      console.log("📋 Webhook secret (first 10 chars):", process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + "...")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🎣 WEBHOOK EVENT RECEIVED:")
    console.log("   - Type:", event.type)
    console.log("   - ID:", event.id)
    console.log("   - Created:", new Date(event.created * 1000).toISOString())

    // Handle regular booking payments
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("✅ PAYMENT SUCCEEDED EVENT:")
      console.log("   - Payment Intent ID:", paymentIntent.id)
      console.log("   - Amount:", paymentIntent.amount, "cents")
      console.log("   - Currency:", paymentIntent.currency)
      console.log("   - Status:", paymentIntent.status)
      console.log("   - Metadata:", JSON.stringify(paymentIntent.metadata, null, 2))

      try {
        // Check if this is a tip payment
        if (paymentIntent.metadata?.type === "tip") {
          console.log("💝 Processing as TIP payment...")
          await handleTipPaymentSuccess(paymentIntent)
        } else {
          console.log("🎬 Processing as BOOKING payment...")
          await handleBookingPaymentSuccess(paymentIntent)
        }
        console.log("✅ Payment processing completed successfully")
      } catch (error) {
        console.error("❌ CRITICAL ERROR processing payment success:")
        console.error("📋 Error message:", error instanceof Error ? error.message : "Unknown error")
        console.error("📋 Error stack:", error instanceof Error ? error.stack : "No stack trace")
        console.error("📋 Payment Intent ID:", paymentIntent.id)
        console.error("📋 Payment Intent metadata:", paymentIntent.metadata)
        // Don't return error to Stripe - we want to investigate
        // return NextResponse.json({ error: "Processing failed" }, { status: 500 })
      }
    }

    // Handle payment failures
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("❌ PAYMENT FAILED EVENT:")
      console.log("   - Payment Intent ID:", paymentIntent.id)
      console.log("   - Last payment error:", paymentIntent.last_payment_error)

      try {
        if (paymentIntent.metadata?.type === "tip") {
          await handleTipPaymentFailure(paymentIntent)
        } else {
          await handleBookingPaymentFailure(paymentIntent)
        }
      } catch (error) {
        console.error("❌ Error updating failed payment:", error)
      }
    }

    // Handle Connect account updates
    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account
      console.log("🔄 Connect account updated:", account.id)
      try {
        await handleConnectAccountUpdate(account)
      } catch (error) {
        console.error("❌ Error updating Connect account:", error)
      }
    }

    // Handle transfer events - FIX: Use switch statement to avoid TypeScript issues
    switch (event.type) {
      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer
        console.log("🔄 Transfer created:", transfer.id)
        try {
          await handleTransferCreated(transfer)
        } catch (error) {
          console.error("❌ Error handling transfer created:", error)
        }
        break
      }

      case "transfer.paid": {
        const transfer = event.data.object as Stripe.Transfer
        console.log("✅ Transfer completed:", transfer.id)
        try {
          await handleTransferCompleted(transfer)
        } catch (error) {
          console.error("❌ Error handling transfer completion:", error)
        }
        break
      }

      case "transfer.failed": {
        const transfer = event.data.object as Stripe.Transfer
        console.log("❌ Transfer failed:", transfer.id)
        try {
          await handleTransferFailed(transfer)
        } catch (error) {
          console.error("❌ Error handling transfer failure:", error)
        }
        break
      }
    }

    console.log("✅ WEBHOOK PROCESSING COMPLETED SUCCESSFULLY")
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ CRITICAL WEBHOOK ERROR:")
    console.error("📋 Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("📋 Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

// ==========================================
// BOOKING PAYMENT HANDLERS
// ==========================================

async function handleBookingPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log("🔄 STARTING BOOKING PAYMENT SUCCESS HANDLER")
  console.log("   - Payment Intent ID:", paymentIntent.id)

  try {
    // Find and update the order
    console.log("🔍 Searching for order with payment intent ID:", paymentIntent.id)
    const order = await prisma.order.findUnique({
      where: { paymentIntentId: paymentIntent.id },
      include: {
        booking: true,
        celebrity: {
          include: { user: true },
        },
        user: true,
      },
    })

    if (!order) {
      console.log("❌ CRITICAL: Order not found for payment intent:", paymentIntent.id)
      console.log("🔍 Debugging: Searching all recent orders...")
      // Debug: Find all orders to see what's in the database
      const allOrders = await prisma.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          paymentIntentId: true,
          paymentStatus: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
      console.log("📋 Recent orders in database:")
      allOrders.forEach((o, i) => {
        console.log(`   ${i + 1}. Order: ${o.orderNumber}`)
        console.log(`      - ID: ${o.id}`)
        console.log(`      - Payment Intent: ${o.paymentIntentId || "NULL"}`)
        console.log(`      - Payment Status: ${o.paymentStatus}`)
        console.log(`      - Order Status: ${o.status}`)
        console.log(`      - Created: ${o.createdAt}`)
      })

      // Also search by metadata if available
      if (paymentIntent.metadata?.orderId) {
        console.log("🔍 Trying to find order by metadata orderId:", paymentIntent.metadata.orderId)
        const orderByMetadata = await prisma.order.findUnique({
          where: { id: paymentIntent.metadata.orderId },
        })
        if (orderByMetadata) {
          console.log("✅ Found order by metadata, but paymentIntentId doesn't match:")
          console.log("   - Order paymentIntentId:", orderByMetadata.paymentIntentId)
          console.log("   - Webhook paymentIntentId:", paymentIntent.id)
        }
      }

      throw new Error(`Order not found for payment intent: ${paymentIntent.id}`)
    }

    console.log("✅ ORDER FOUND:")
    console.log("   - Order Number:", order.orderNumber)
    console.log("   - Order ID:", order.id)
    console.log("   - Current Payment Status:", order.paymentStatus)
    console.log("   - Current Order Status:", order.status)
    console.log("   - User:", order.user.name, `(${order.user.email})`)
    console.log("   - Celebrity:", order.celebrity.user.name)
    console.log("   - Has existing booking:", !!order.booking)
    console.log("   - Total Amount:", order.totalAmount)

    console.log("🔄 UPDATING ORDER STATUS...")
    // 🔥 NEW FLOW: Only update payment status, DON'T calculate splits yet
    // Money stays with platform until order is COMPLETED
    const updatedOrder = await prisma.order.update({
      where: { paymentIntentId: paymentIntent.id },
      data: {
        paymentStatus: "SUCCEEDED",
        status: "PENDING", // Order is pending until celebrity accepts
        paidAt: new Date(),
        // 🔥 REMOVED: Don't calculate splits yet - only when COMPLETED
      },
    })

    console.log("✅ ORDER UPDATED SUCCESSFULLY:")
    console.log("   - Payment Status:", updatedOrder.paymentStatus)
    console.log("   - Order Status:", updatedOrder.status)
    console.log("   - Paid At:", updatedOrder.paidAt)
    console.log("   - 💰 MONEY HELD BY PLATFORM until delivery")

    // Create booking ONLY after payment succeeds (if it doesn't exist)
    // Booking starts as PENDING until celebrity accepts it
    if (!order.booking) {
      console.log("🎬 CREATING BOOKING AFTER SUCCESSFUL PAYMENT...")
      console.log("   - Booking will be PENDING until celebrity accepts")
      const newBooking = await prisma.booking.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          celebrityId: order.celebrityId,
          message: order.personalMessage,
          recipientName: order.recipientName,
          occasion: order.occasion,
          instructions: order.specialInstructions || null,
          specialInstructions: order.specialInstructions || null,
          status: "PENDING", // Booking starts as PENDING, not ACCEPTED
          price: order.totalAmount,
          totalAmount: order.totalAmount,
          scheduledDate: order.scheduledDate,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      })

      console.log("✅ BOOKING CREATED SUCCESSFULLY:")
      console.log("   - Booking ID:", newBooking.id)
      console.log("   - Status:", newBooking.status, "(PENDING - waiting for celebrity acceptance)")
      console.log("   - Order Number:", newBooking.orderNumber)
    } else {
      console.log("🔄 BOOKING ALREADY EXISTS - NOT CHANGING STATUS")
      console.log("   - Existing booking status:", order.booking.status)
      console.log("   - Booking will remain in current status until celebrity takes action")
    }

    // 🔥 NEW FLOW: NO TRANSFER YET - money stays with platform
    console.log("💰 PAYMENT FLOW - NEW APPROACH:")
    console.log("   - ✅ Customer payment: SUCCEEDED")
    console.log("   - 🏦 Money held by: PLATFORM")
    console.log("   - ⏳ Transfer when: ORDER COMPLETED (after video delivery)")
    console.log("   - 📊 Earnings count: ONLY after COMPLETED")

    // Update transfer status to pending (waiting for completion)
    await prisma.order.update({
      where: { id: order.id },
      data: { transferStatus: "PENDING" }, // Will change when order is COMPLETED
    })

    console.log("✅ BOOKING PAYMENT SUCCESS HANDLER COMPLETED")
    console.log("   - Order: PENDING (payment succeeded, waiting for celebrity)")
    console.log("   - Booking: PENDING (waiting for celebrity acceptance)")
    console.log("   - Transfer: DEFERRED (until delivery)")
  } catch (error) {
    console.error("❌ CRITICAL ERROR IN BOOKING PAYMENT SUCCESS HANDLER:")
    console.error("📋 Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("📋 Error stack:", error instanceof Error ? error.stack : "No stack trace")
    throw error // Re-throw to be caught by main webhook handler
  }
}

async function handleBookingPaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log("🔄 Processing booking payment failure:", paymentIntent.id)
  try {
    // Update order status to failed
    const updatedOrder = await prisma.order.update({
      where: { paymentIntentId: paymentIntent.id },
      data: {
        paymentStatus: "FAILED",
        status: "CANCELLED",
        transferStatus: "FAILED",
      },
    })
    console.log("✅ Booking payment failure processed for order:", updatedOrder.orderNumber)
  } catch (error) {
    console.error("❌ Error processing booking payment failure:", error)
    throw error
  }
}

// ==========================================
// TIP PAYMENT HANDLERS
// ==========================================

async function handleTipPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log("🔄 Processing tip payment success:", paymentIntent.id)

  // Find and update the tip
  const tip = await prisma.tip.findUnique({
    where: { paymentIntentId: paymentIntent.id },
    include: {
      celebrity: {
        include: { user: true },
      },
      order: true,
      user: true,
    },

    
  })

  if (!tip) {
    console.log("⚠️ Tip not found for payment intent:", paymentIntent.id)
    return
  }

  // Update tip status
  await prisma.tip.update({
    where: { paymentIntentId: paymentIntent.id },
    data: {
      paymentStatus: "SUCCEEDED",
      paidAt: new Date(),
    },
  })

  console.log("🔍 Connect Account Debug Info:", {
    accountId: tip.celebrity.stripeConnectAccountId,
    payoutsEnabled: tip.celebrity.stripePayoutsEnabled,
    accountStatus: tip.celebrity.stripeAccountStatus,
    onboardingComplete: tip.celebrity.stripeOnboardingComplete
  });

  // Initiate transfer to celebrity (100% of tip) - Tips transfer immediately
  if (tip.celebrity.stripeConnectAccountId && tip.celebrity.stripePayoutsEnabled) {
    try {
      console.log("🔄 Initiating tip transfer to celebrity:", tip.celebrity.user.name)
      const transferResult = await transferTipPayment({
        accountId: tip.celebrity.stripeConnectAccountId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        tipId: tip.id,
        orderId: tip.orderId,
        orderNumber: tip.order.orderNumber,
        celebrityName: tip.celebrity.user.name || "Celebrity",
        customerName: tip.user.name || "Customer",
      })

      // Update tip with transfer info
      await prisma.tip.update({
        where: { id: tip.id },
        data: {
          transferId: transferResult.transferId,
          transferStatus: "IN_TRANSIT",
        },
      })

      // Create transfer record
      await prisma.transfer.create({
        data: {
          stripeTransferId: transferResult.transferId,
          celebrityId: tip.celebrityId,
          tipId: tip.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          type: "TIP",
          status: "IN_TRANSIT",
          description: `Tip from ${tip.user.name} for order ${tip.order.orderNumber}`,
        },
      })

      // Update celebrity total tips
      await prisma.celebrity.update({
        where: { id: tip.celebrityId },
        data: {
          totalTips: {
            increment: paymentIntent.amount / 100, // Convert from cents
          },
        },
      })

      console.log("✅ Tip transfer initiated successfully")
    } catch (error) {
      console.error("❌ Failed to initiate tip transfer:", error)
      // Update transfer status to failed
      await prisma.tip.update({
        where: { id: tip.id },
        data: { transferStatus: "FAILED" },
      })
    }
  } else {
    console.log("⚠️ Celebrity doesn't have Connect account for tip transfer")
    // Update transfer status to pending
    await prisma.tip.update({
      where: { id: tip.id },
      data: { transferStatus: "PENDING" },
    })
  }

  console.log("✅ Tip payment processed successfully")
}

async function handleTipPaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log("🔄 Processing tip payment failure:", paymentIntent.id)
  // Update tip status to failed
  await prisma.tip.update({
    where: { paymentIntentId: paymentIntent.id },
    data: {
      paymentStatus: "FAILED",
      transferStatus: "FAILED",
    },
  })
  console.log("✅ Tip payment failure processed")
}

// ==========================================
// CONNECT ACCOUNT HANDLERS
// ==========================================

async function handleConnectAccountUpdate(account: Stripe.Account) {
  console.log("🔄 Processing Connect account update:", account.id)

  // Find celebrity with this Connect account
  const celebrity = await prisma.celebrity.findUnique({
    where: { stripeConnectAccountId: account.id },
    include: { user: true },
  })

  if (!celebrity) {
    console.log("⚠️ Celebrity not found for Connect account:", account.id)
    return
  }

  // Determine account status using correct Prisma enum values
  let accountStatus: "PENDING" | "RESTRICTED" | "ACTIVE" | "REJECTED" = "PENDING"
  if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
    accountStatus = "ACTIVE"
  } else if (account.requirements?.disabled_reason) {
    accountStatus = "REJECTED"
  } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
    accountStatus = "RESTRICTED"
  }

  // Update celebrity record with correct enum value
  await prisma.celebrity.update({
    where: { id: celebrity.id },
    data: {
      stripeAccountStatus: accountStatus,
      stripeOnboardingComplete: account.details_submitted || false,
      stripeChargesEnabled: account.charges_enabled || false,
      stripePayoutsEnabled: account.payouts_enabled || false,
      preferredCurrency: account.default_currency || "nzd",
      bankCountry: account.country || null,
    },
  })

  console.log(`✅ Celebrity ${celebrity.user.name} Connect status updated to: ${accountStatus}`)
}

// ==========================================
// TRANSFER HANDLERS
// ==========================================

async function handleTransferCreated(transfer: Stripe.Transfer) {
  console.log("🔄 Processing transfer created:", transfer.id)

  // Update transfer record status
  await prisma.transfer.updateMany({
    where: { stripeTransferId: transfer.id },
    data: {
      status: "IN_TRANSIT",
      initiatedAt: new Date(transfer.created * 1000),
    },
  })

  console.log("✅ Transfer created status updated")
}

async function handleTransferCompleted(transfer: Stripe.Transfer) {
  console.log("🔄 Processing transfer completion:", transfer.id)

  // Update transfer record
  const transferRecord = await prisma.transfer.findUnique({
    where: { stripeTransferId: transfer.id },
    include: { celebrity: true },
  })

  if (!transferRecord) {
    console.log("⚠️ Transfer record not found:", transfer.id)
    return
  }

  await prisma.transfer.update({
    where: { stripeTransferId: transfer.id },
    data: {
      status: "PAID",
      completedAt: new Date(),
    },
  })

  // Update related order or tip
  if (transferRecord.orderId) {
    await prisma.order.update({
      where: { id: transferRecord.orderId },
      data: {
        transferStatus: "PAID",
        transferredAt: new Date(),
      },
    })
  }

  if (transferRecord.tipId) {
    await prisma.tip.update({
      where: { id: transferRecord.tipId },
      data: {
        transferStatus: "PAID",
        transferredAt: new Date(),
      },
    })
  }

  // Update celebrity earnings
  await prisma.celebrity.update({
    where: { id: transferRecord.celebrityId },
    data: {
      totalEarnings: {
        increment: transfer.amount / 100, // Convert from cents
      },
      lastPayoutAt: new Date(),
    },
  })

  console.log("✅ Transfer completion processed successfully")
}

async function handleTransferFailed(transfer: Stripe.Transfer) {
  console.log("🔄 Processing transfer failure:", transfer.id)

  // Update transfer record
  await prisma.transfer.update({
    where: { stripeTransferId: transfer.id },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      failureReason: "Transfer failed - check Connect account status",
    },
  })

  // Update related order or tip
  const transferRecord = await prisma.transfer.findUnique({
    where: { stripeTransferId: transfer.id },
  })

  if (transferRecord?.orderId) {
    await prisma.order.update({
      where: { id: transferRecord.orderId },
      data: { transferStatus: "FAILED" },
    })
  }

  if (transferRecord?.tipId) {
    await prisma.tip.update({
      where: { id: transferRecord.tipId },
      data: { transferStatus: "FAILED" },
    })
  }

  console.log("✅ Transfer failure processed")
}
