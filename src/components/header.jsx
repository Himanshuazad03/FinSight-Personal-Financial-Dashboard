
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/logo.png";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PenBoxIcon } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

async function Header() {
  await checkUser()
  return (
    <div className="fixed top-0 bg-white/80 backdrop-blur-md z-50  border-b w-full">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src={logo}
            width={100}
            height={100}
            alt="logo"
            className=" h-8 sm:h-14 object-contain w-auto"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/transaction/create"
              className="text-gray-600 hover:text-blue-600"
            >
              <Button variant="default">
                <PenBoxIcon size={18} />
                <span className="hidden md:inline cursor-pointer">Add Transactions</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline cursor-pointer">Dashboard</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Log In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                   userButtonAvatarBox: "w-20 h-20",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default Header;
