"use client";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  {
    /*add different auth status */
  }
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link 
            label="Studio"
            href="/studio"
            labelIcon={<ClapperboardIcon className="size-4"/>}
            />
            <UserButton.Action onClick={() => console.log("Managing accounts")} labelIcon={<UserCircleIcon className="size-4" />} label="manage Accounts"/>
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant={"outline"}
            className="px-py-4 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20
      rounded-full shadow-none [] "
          >
            <UserCircleIcon className="size-4" />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
