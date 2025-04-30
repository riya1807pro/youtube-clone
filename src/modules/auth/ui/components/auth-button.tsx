"use client";
<<<<<<< HEAD
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  {
    /*add different auth status */
  }
=======

import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export const AuthButton = () => {
>>>>>>> 9f21a4b (internal structure improvements)
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
<<<<<<< HEAD
=======
              label="My profile"
              href="/users/current"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Link
>>>>>>> 9f21a4b (internal structure improvements)
              label="Studio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
<<<<<<< HEAD
            variant={"outline"}
            className="px-py-4 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20
      rounded-full shadow-none [] "
          >
            <UserCircleIcon className="size-4" />
=======
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/50 rounded-full shadow-none "
          >
            <UserCircleIcon />
>>>>>>> 9f21a4b (internal structure improvements)
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
