"use client";
import AuthCard from "./AuthCard";

export default function AuthScreen() {
   // const [state, setState] = useState<SignInFlow>("signIn");
   return (
      <div className="h-full flex items-center justify-center bg-[#5c3b58]">
         <div className="md:h-auto md:w-[420px]">
            <AuthCard />
            {/* {state === "signIn" ? (
               <SignInCard setState={setState} />
            ) : (
               <SignUpCard setState={setState} />
            )} */}
         </div>
      </div>
   );
}
