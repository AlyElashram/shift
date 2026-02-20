"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { shipmentStatusSchema } from "@/lib/validations/shipment";
import type { ShipmentStatusInput } from "@/lib/validations/shipment";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: Super Admin access required");
  }
  return session;
}

export async function createStatus(input: ShipmentStatusInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireSuperAdmin();
    const validated = shipmentStatusSchema.parse(input);

    // Get max order if not specified
    if (!validated.order) {
      const maxOrder = await prisma.shipmentStatus.aggregate({
        _max: { order: true },
      });
      validated.order = (maxOrder._max.order || 0) + 1;
    }

    const status = await prisma.shipmentStatus.create({
      data: validated,
    });

    revalidatePath("/admin/statuses");
    return { success: true, data: { id: status.id } };
  } catch (error) {
    console.error("Failed to create status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create status" };
  }
}

export async function updateStatus(id: string, input: ShipmentStatusInput): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    const validated = shipmentStatusSchema.parse(input);

    await prisma.shipmentStatus.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/statuses");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}

export async function deleteStatus(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    // Check if status is in use
    const shipmentsUsingStatus = await prisma.shipment.count({
      where: { currentStatusId: id },
    });

    if (shipmentsUsingStatus > 0) {
      return {
        success: false,
        error: `Cannot delete: ${shipmentsUsingStatus} shipment(s) are using this status`,
      };
    }

    await prisma.shipmentStatus.delete({
      where: { id },
    });

    revalidatePath("/admin/statuses");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete status" };
  }
}

export async function reorderStatuses(orderedIds: string[]): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.shipmentStatus.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/admin/statuses");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to reorder statuses:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to reorder statuses" };
  }
}
