"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendEmail, generateStatusUpdateEmail, generateThankYouEmail } from "@/lib/email";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function sendStatusUpdateEmail(shipmentId: string): Promise<ActionResult> {
  try {
    await requireAuth();

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { currentStatus: true },
    });

    if (!shipment) {
      return { success: false, error: "Shipment not found" };
    }

    if (!shipment.ownerEmail) {
      return { success: false, error: "No email address for this shipment" };
    }

    if (!shipment.currentStatus) {
      return { success: false, error: "No status set for this shipment" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const trackingUrl = `${appUrl}/track/${shipment.trackingId}`;

    const html = generateStatusUpdateEmail({
      ownerName: shipment.ownerName,
      manufacturer: shipment.manufacturer,
      model: shipment.model,
      statusName: shipment.currentStatus.name,
      trackingUrl,
    });

    await sendEmail({
      to: shipment.ownerEmail,
      subject: `Shipment Update: ${shipment.manufacturer} ${shipment.model} - ${shipment.currentStatus.name}`,
      html,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to send status update email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}

export async function sendThankYouEmail(shipmentId: string): Promise<ActionResult> {
  try {
    await requireAuth();

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return { success: false, error: "Shipment not found" };
    }

    if (!shipment.ownerEmail) {
      return { success: false, error: "No email address for this shipment" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const trackingUrl = `${appUrl}/track/${shipment.trackingId}`;

    const html = generateThankYouEmail({
      ownerName: shipment.ownerName,
      manufacturer: shipment.manufacturer,
      model: shipment.model,
      trackingUrl,
    });

    await sendEmail({
      to: shipment.ownerEmail,
      subject: `Thank You for Choosing SHIFT By Joe - ${shipment.manufacturer} ${shipment.model}`,
      html,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to send thank you email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}

export async function sendCustomEmail(
  shipmentId: string,
  subject: string,
  htmlContent: string
): Promise<ActionResult> {
  try {
    await requireAuth();

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return { success: false, error: "Shipment not found" };
    }

    if (!shipment.ownerEmail) {
      return { success: false, error: "No email address for this shipment" };
    }

    await sendEmail({
      to: shipment.ownerEmail,
      subject,
      html: htmlContent,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to send custom email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}
