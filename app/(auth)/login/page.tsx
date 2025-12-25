import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - BlogSpace",
  description: "Sign in to your BlogSpace account",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
