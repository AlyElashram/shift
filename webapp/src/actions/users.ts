"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { userSchema, userUpdateSchema } from "@/lib/validations/shipment";
import type { UserInput, UserUpdateInput } from "@/lib/validations/shipment";
import bcrypt from "bcryptjs";

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

export async function createUser(input: UserInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireSuperAdmin();
    const validated = userSchema.parse(input);

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await prisma.user.create({
      data: {
        ...validated,
        password: hashedPassword,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: { id: user.id } };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
  }
}

export async function updateUser(id: string, input: UserUpdateInput): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    const validated = userUpdateSchema.parse(input);

    // Check if trying to change own role
    if (session.user.id === id && validated.role && validated.role !== session.user.role) {
      return { success: false, error: "You cannot change your own role" };
    }

    // Check if email already exists (if changing email)
    if (validated.email) {
      const existing = await prisma.user.findFirst({
        where: { email: validated.email, id: { not: id } },
      });
      if (existing) {
        return { success: false, error: "A user with this email already exists" };
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = { ...validated };

    // Hash new password if provided
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12);
    } else {
      delete updateData.password;
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();

    // Prevent self-deletion
    if (session.user.id === id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { shipmentsCreated: true, statusChanges: true },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Don't allow deletion if user has associated data
    if (user._count.shipmentsCreated > 0 || user._count.statusChanges > 0) {
      return {
        success: false,
        error: "Cannot delete user with associated shipments or status changes. Consider deactivating instead.",
      };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" };
  }
}
