import { SignInCard } from "@/features/auth/components/sign-in-card";
import { MagicLinkHandler } from "@/features/auth/components/magic-link-handler";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <MagicLinkHandler />
      <SignInCard errorMessage={params.error} />
    </>
  );
}