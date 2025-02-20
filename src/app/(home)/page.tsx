// "use client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/youtubeLogo.svg" alt="logo" width={50} height={50} />
      <p className="text-xl font-semibold  tracking-tight">Youtube</p>
    </div>
  );
}
