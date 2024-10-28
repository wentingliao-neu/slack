"use client";

import React from "react";
import Toolbar from "./Toolbar";

type Props = { children: React.ReactNode };

export default function layout({ children }: Props) {
   return (
      <div className=" h-full ">
         <Toolbar />
         {children}
      </div>
   );
}
