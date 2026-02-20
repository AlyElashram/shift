"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { leadSchema } from "@/lib/validations/shipment";
import type { LeadInput } from "@/lib/validations/shipment";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Public action - no auth required (for contact form)
export async function createLead(input: LeadInput): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = leadSchema.parse(input);

    const lead = await prisma.lead.create({
      data: validated,
    });

    return { success: true, data: { id: lead.id } };
  } catch (error) {
    console.error("Failed to create lead:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit form" };
  }
}

export async function markLeadContacted(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.lead.update({
      where: { id },
      data: { contacted: true },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update lead" };
  }
}

export async function markLeadUncontacted(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.lead.update({
      where: { id },
      data: { contacted: false },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update lead" };
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.lead.delete({
      where: { id },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete lead" };
  }
}

export async function deleteMultipleLeads(ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.lead.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete leads:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete leads" };
  }
}
