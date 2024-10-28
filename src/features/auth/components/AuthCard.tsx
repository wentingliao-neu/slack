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

const ERROR_SIGN_IN = "Invalid email or password";
const ERROR_SIGN_UP = "Something went wrong";

export default function AuthCard() {
   const [state, setState] = useState<SignInFlow>("signIn");
   const { signIn } = useAuthActions();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [name, setName] = useState("");

   const [pending, setPending] = useState(false);
   const [error, setError] = useState<string>("");

   const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (state === "signUp" && password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      setPending(true);
      if (state === "signUp")
         signIn("password", { name, email, password, flow: state })
            .catch((error) => {
               console.error(error);
               setError(ERROR_SIGN_UP);
            })
            .finally(() => {
               setPending(false);
            });
      else
         signIn("password", { email, password, flow: state })
            .catch((error) => {
               console.error(error);
               setError(ERROR_SIGN_IN);
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
            <CardTitle>
               {state === "signIn" ? "Login" : "Sign up"} to continue
            </CardTitle>
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
               {state === "signUp" && (
                  <>
                     <Input
                        disabled={pending}
                        value={confirmPassword}
                        placeholder="Confirm the password"
                        type="password"
                        required
                        onChange={(e) => {
                           setConfirmPassword(e.target.value);
                        }}
                     />
                     <Input
                        disabled={pending}
                        value={name}
                        placeholder="UserName"
                        required
                        onChange={(e) => {
                           setName(e.target.value);
                        }}
                     />
                  </>
               )}
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
               {state === "signIn" ? "Don't" : "Already"} have an account?
               <span
                  onClick={() => {
                     if (state === "signIn") setState("signUp");
                     else setState("signIn");
                  }}
                  className=" text-sky-700 hover:underline  cursor-pointer"
               >
                  {state === "signIn" ? "Sign up" : "Sign in"}
               </span>
            </p>
         </CardContent>
      </Card>
   );
}
