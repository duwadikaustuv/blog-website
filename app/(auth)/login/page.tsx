import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In - BlogSpace",
  description: "Sign in to your BlogSpace account",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-white dark:bg-black">
      <LoginForm />
    </div>
  );
}
