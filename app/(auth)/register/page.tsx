import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account - BlogSpace",
  description: "Create your BlogSpace account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12 bg-white dark:bg-black">
      <RegisterForm />
    </div>
  );
}
