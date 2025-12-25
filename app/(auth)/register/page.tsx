import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account - BlogSpace",
  description: "Create your BlogSpace account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
