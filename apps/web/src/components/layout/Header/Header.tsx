import Button from "@/ui/Button";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between px-2 w-full max-w-screen-2xl mx-auto py-4">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold">Home</h1>
        </Link>
      </div>
      <div>
        <HeaderUnAuthRightSide />
      </div>
    </header>
  );
};

const HeaderUnAuthRightSide = () => {
  return (
    <div className="flex gap-4 ">
      <Link href="/accounts/login">
        <Button className="px-4 py-2 capitalize font-bold">login</Button>
      </Link>
      <Link href="/accounts/signup">
        <Button className="px-4 py-2 capitalize font-bold">sign up</Button>
      </Link>
    </div>
  );
};

export default Header;
