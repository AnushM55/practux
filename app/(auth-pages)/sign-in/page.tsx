import { signInAction, signInWithGithubAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <SubmitButton pendingText="Signing In..." formAction={signInWithGithubAction}>
          Sign in With Github
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
