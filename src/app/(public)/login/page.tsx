import { SignInCard } from "@/features/auth/components/sign-in-card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <SignInCard errorMessage={params.error} />;
}
