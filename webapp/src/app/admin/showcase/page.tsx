import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ShowcaseManager } from "./ShowcaseManager";

export default async function ShowcasePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/admin");

  const cars = await prisma.carShowcase.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--shift-cream)] uppercase">
          Car Showcase
        </h1>
        <p className="text-[var(--shift-gray-light)]">
          Manage the car gallery displayed on the homepage
        </p>
      </div>

      <ShowcaseManager cars={cars} />
    </div>
  );
}
