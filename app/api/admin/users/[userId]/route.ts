import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH - Update user role (superadmin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkIsSuperAdmin(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Only superadmins can modify user roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!["user", "admin", "superadmin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent superadmin from demoting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (currentUser?.id === userId && role !== "superadmin") {
      return NextResponse.json(
        { error: "Cannot change your own superadmin role" },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (superadmin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const { userId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkIsSuperAdmin(session.user.email);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Only superadmins can delete users" },
        { status: 403 }
      );
    }

    // Prevent superadmin from deleting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (currentUser?.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

async function checkIsSuperAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  return user?.role === "superadmin";
}
