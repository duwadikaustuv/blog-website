import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkIsSuperAdmin } from "@/lib/authHelpers";
import UserActions from "@/components/admin/UserActions";

export const dynamic = "force-dynamic";

interface UserWithCount {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  _count: {
    articles: number;
  };
}

export default async function AdminUsersPage() {
  const session = await auth();
  const isSuperAdmin = session?.user?.email
    ? await checkIsSuperAdmin(session.user.email)
    : false;

  const users: UserWithCount[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: { articles: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          All registered users ({users.length} total)
        </p>
        {isSuperAdmin && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>SuperAdmin Access:</strong> You can change user roles and
              delete users. Click on a role badge to change it.
            </p>
          </div>
        )}
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 border border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No users registered yet
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                {isSuperAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {(user.name || user.email)?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-black dark:text-white">
                        {user.name || "No name"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <UserActions
                      userId={user.id}
                      currentRole={user.role}
                      userEmail={user.email}
                      isSuperAdmin={isSuperAdmin}
                      isCurrentUser={session?.user?.email === user.email}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user._count.articles}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
