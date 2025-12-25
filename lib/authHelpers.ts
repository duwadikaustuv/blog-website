import prisma from "@/lib/prisma";

export async function checkIsSuperAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  return user?.role === "superadmin";
}

export async function checkIsAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  return user?.role === "admin" || user?.role === "superadmin";
}

export async function checkIsAdminOrSuperAdmin(
  email: string
): Promise<boolean> {
  return checkIsAdmin(email);
}

export async function getUserRole(
  email: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  return user?.role || null;
}
