"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { shipmentSchema, shipmentUpdateSchema, statusUpdateSchema } from "@/lib/validations/shipment";
import type { ShipmentInput, ShipmentUpdateInput, StatusUpdateInput } from "@/lib/validations/shipment";
import { sendEmail, generateStatusUpdateEmail } from "@/lib/email";

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

export async function createShipment(input: ShipmentInput): Promise<ActionResult<{ id: string; trackingId: string }>> {
  try {
    const session = await requireAuth();
    const validated = shipmentSchema.parse(input);

    const shipment = await prisma.shipment.create({
      data: {
        ...validated,
        ownerEmail: validated.ownerEmail || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/admin/shipments");
    revalidatePath("/admin");

    return { success: true, data: { id: shipment.id, trackingId: shipment.trackingId } };
  } catch (error) {
    console.error("Failed to create shipment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create shipment" };
  }
}

export async function updateShipment(id: string, input: ShipmentUpdateInput): Promise<ActionResult> {
  try {
    await requireAuth();
    const validated = shipmentUpdateSchema.parse(input);

    await prisma.shipment.update({
      where: { id },
      data: {
        ...validated,
        ownerEmail: validated.ownerEmail || null,
      },
    });

    revalidatePath("/admin/shipments");
    revalidatePath(`/admin/shipments/${id}`);
    revalidatePath("/admin");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update shipment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update shipment" };
  }
}

export async function deleteShipment(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    await prisma.shipment.delete({
      where: { id },
    });

    revalidatePath("/admin/shipments");
    revalidatePath("/admin");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete shipment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete shipment" };
  }
}

export async function updateShipmentStatus(shipmentId: string, input: StatusUpdateInput): Promise<ActionResult> {
  try {
    const session = await requireAuth();
    const validated = statusUpdateSchema.parse(input);

    // Get the status to check if we need to send email
    const status = await prisma.shipmentStatus.findUnique({
      where: { id: validated.statusId },
    });

    if (!status) {
      return { success: false, error: "Status not found" };
    }

    // Get the shipment for email
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return { success: false, error: "Shipment not found" };
    }

    // Update shipment and create history entry
    await prisma.$transaction([
      prisma.shipment.update({
        where: { id: shipmentId },
        data: { currentStatusId: validated.statusId },
      }),
      prisma.shipmentStatusHistory.create({
        data: {
          shipmentId,
          statusId: validated.statusId,
          changedById: session.user.id,
          notes: validated.notes,
        },
      }),
    ]);

    // Send email if status.notifyEmail is true and shipment has email
    if (status.notifyEmail && shipment.ownerEmail) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const trackingUrl = `${appUrl}/track/${shipment.trackingId}`;

        const html = generateStatusUpdateEmail({
          ownerName: shipment.ownerName,
          manufacturer: shipment.manufacturer,
          model: shipment.model,
          statusName: status.name,
          trackingUrl,
        });

        await sendEmail({
          to: shipment.ownerEmail,
          subject: `Shipment Update: ${shipment.manufacturer} ${shipment.model} - ${status.name}`,
          html,
        });
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
        // Don't fail the status update if email fails
      }
    }

    revalidatePath("/admin/shipments");
    revalidatePath(`/admin/shipments/${shipmentId}`);
    revalidatePath("/admin");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update shipment status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}

export async function getShipment(id: string) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        currentStatus: true,
        statusHistory: {
          include: {
            status: true,
            changedBy: {
              select: { name: true },
            },
          },
          orderBy: { changedAt: "desc" },
        },
        customer: true,
        createdBy: {
          select: { name: true },
        },
      },
    });

    return shipment;
  } catch (error) {
    console.error("Failed to get shipment:", error);
    return null;
  }
}

export async function getShipments(options?: {
  search?: string;
  statusId?: string;
  limit?: number;
}) {
  try {
    const where: NonNullable<Parameters<typeof prisma.shipment.findMany>[0]>["where"] = {};

    if (options?.search) {
      const search = options.search.toLowerCase();
      where.OR = [
        { vin: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { ownerName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (options?.statusId) {
      where.currentStatusId = options.statusId;
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        currentStatus: true,
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
    });

    return shipments;
  } catch (error) {
    console.error("Failed to get shipments:", error);
    return [];
  }
}

export async function getStatuses() {
  try {
    return await prisma.shipmentStatus.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to get statuses:", error);
    return [];
  }
}
