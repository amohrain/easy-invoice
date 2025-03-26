import React from "react";
import Link from "next/link";

function LeftBar() {
  return (
    <div className="flex flex-col px-10 py-2 gap-2 bg-base-300">
      <Link href="/" className="">
        <button className="btn btn-primary w-full">Create new</button>
      </Link>
      <Link href="/" className="">
        <button className="btn btn-primary w-full">Invoice Database</button>
      </Link>
      <button className="btn btn-primary">Your Company</button>
      <button className="btn btn-primary">Manage Templates</button>
    </div>
  );
}

export default LeftBar;
