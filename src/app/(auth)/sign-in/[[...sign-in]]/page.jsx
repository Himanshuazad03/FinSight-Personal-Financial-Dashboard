import { SignIn } from "@clerk/nextjs";
import React from "react";

function Page() {
  return (
    <div className="mb-20">
      <SignIn />
    </div>
  );
}

export default Page;
