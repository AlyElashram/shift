"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { carShowcaseSchema } from "@/lib/validations/shipment";
import type { CarShowcaseInput } from "@/lib/validations/shipment";

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

export async function createShowcaseCar(input: CarShowcaseInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireSuperAdmin();
    const validated = carShowcaseSchema.parse(input);

    const car = await prisma.carShowcase.create({
      data: validated,
    });

    revalidatePath("/admin/showcase");
    revalidatePath("/");
    return { success: true, data: { id: car.id } };
  } catch (error) {
    console.error("Failed to create showcase car:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create showcase car" };
  }
}

export async function updateShowcaseCar(id: string, input: CarShowcaseInput): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    const validated = carShowcaseSchema.parse(input);

    await prisma.carShowcase.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/showcase");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update showcase car:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update showcase car" };
  }
}

export async function deleteShowcaseCar(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    await prisma.carShowcase.delete({
      where: { id },
    });

    revalidatePath("/admin/showcase");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete showcase car:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete showcase car" };
  }
}

export async function toggleShowcaseCarActive(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    const car = await prisma.carShowcase.findUnique({ where: { id } });
    if (!car) {
      return { success: false, error: "Car not found" };
    }

    await prisma.carShowcase.update({
      where: { id },
      data: { isActive: !car.isActive },
    });

    revalidatePath("/admin/showcase");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to toggle showcase car:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to toggle showcase car" };
  }
}

export async function reorderShowcaseCars(ids: string[]): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.carShowcase.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/admin/showcase");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to reorder showcase cars:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to reorder showcase cars" };
  }
}
