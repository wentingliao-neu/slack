import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
   setState: (state: SignInFlow) => void;
}

export default function SignInCard({ setState }: SignInCardProps) {
   const { signIn } = useAuthActions();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [pending, setPending] = useState(false);
   const [error, setError] = useState<string>("");
   const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);
      signIn("password", { email, password, flow: "signIn" })
         .catch((error) => {
            console.error(error);
            setError("Invalid email or password");
         })
         .finally(() => {
            setPending(false);
         });
   };

   const handleProviderSignIn = (value: "google" | "github") => {
      setPending(true);
      signIn(value).finally(() => {
         setPending(false);
      });
   };
   return (
      <Card className=" w-full h-full p-8">
         <CardHeader className=" px-0 pt-0">
            <CardTitle>Login to continue</CardTitle>
            <CardDescription>
               Use your email or another service to continue
            </CardDescription>
         </CardHeader>
         {!!error && (
            <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-sm text-red-500">
               <TriangleAlert className=" size-4" />
               <p>{error}</p>
            </div>
         )}
         <CardContent className=" space-y-5 px-0 pb-0">
            <form className=" space-y-2.5" onSubmit={onPasswordSignIn}>
               <Input
                  disabled={pending}
                  value={email}
                  placeholder="Email"
                  type="email"
                  required
                  onChange={(e) => {
                     setEmail(e.target.value);
                  }}
               />
               <Input
                  disabled={pending}
                  value={password}
                  placeholder="Password"
                  type="password"
                  required
                  onChange={(e) => {
                     setPassword(e.target.value);
                  }}
               />
               <Button
                  type="submit"
                  className=" w-full"
                  size="lg"
                  disabled={pending}
               >
                  Continue
               </Button>
            </form>
            <Separator />
            <div className=" flex flex-col gap-y-2.5">
               <Button
                  disabled={pending}
                  onClick={() => {
                     handleProviderSignIn("google");
                  }}
                  variant="outline"
                  size="lg"
                  className=" w-full relative"
               >
                  <FcGoogle className=" size-5 absolute top-3.5 left-2.5" />
                  Continue with Google
               </Button>
               <Button
                  disabled={pending}
                  onClick={() => {
                     handleProviderSignIn("github");
                  }}
                  variant="outline"
                  size="lg"
                  className=" w-full relative"
               >
                  <FaGithub className=" size-5 absolute top-3.5 left-2.5" />
                  Continue with Github
               </Button>
            </div>
            <p className=" text-xs text-muted-foreground">
               Don&apos;t have an account?{" "}
               <span
                  onClick={() => setState("signUp")}
                  className=" text-sky-700 hover:underline  cursor-pointer"
               >
                  Sign up
               </span>
            </p>
         </CardContent>
      </Card>
   );
}
