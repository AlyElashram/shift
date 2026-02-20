"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { templateSchema } from "@/lib/validations/shipment";
import type { TemplateInput } from "@/lib/validations/shipment";
import { replacePlaceholders, type PlaceholderData } from "@/lib/pdf";

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

export async function createTemplate(input: TemplateInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireSuperAdmin();
    const validated = templateSchema.parse(input);

    // If setting as default, unset other defaults of same type
    if (validated.isDefault) {
      await prisma.template.updateMany({
        where: { type: validated.type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.template.create({
      data: validated,
    });

    revalidatePath("/admin/templates");
    return { success: true, data: { id: template.id } };
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create template" };
  }
}

export async function updateTemplate(id: string, input: TemplateInput): Promise<ActionResult> {
  try {
    await requireSuperAdmin();
    const validated = templateSchema.parse(input);

    // If setting as default, unset other defaults of same type
    if (validated.isDefault) {
      await prisma.template.updateMany({
        where: { type: validated.type, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    await prisma.template.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/templates");
    revalidatePath(`/admin/templates/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update template:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update template" };
  }
}

export async function deleteTemplate(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    await prisma.template.delete({
      where: { id },
    });

    revalidatePath("/admin/templates");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete template:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete template" };
  }
}

export async function previewTemplate(content: string): Promise<ActionResult<string>> {
  try {
    await requireSuperAdmin();

    // Sample data for preview
    const sampleData: PlaceholderData = {
      ownerName: "Ahmed Hassan",
      ownerEmail: "ahmed@example.com",
      ownerPhone: "+20 123 456 7890",
      manufacturer: "Toyota",
      model: "Land Cruiser",
      vin: "JTDKN3DU1A1234567",
      year: 2024,
      color: "Pearl White",
      trackingUrl: "https://shiftbyjoe.com/track/sample-id",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      trackingId: "clp1234567890",
    };

    const preview = replacePlaceholders(content, sampleData);
    return { success: true, data: preview };
  } catch (error) {
    console.error("Failed to preview template:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to preview template" };
  }
}

export async function getDefaultTemplate(type: "CONTRACT" | "BILL" | "EMAIL") {
  try {
    const template = await prisma.template.findFirst({
      where: { type, isDefault: true },
    });
    return template;
  } catch (error) {
    console.error("Failed to get default template:", error);
    return null;
  }
}
