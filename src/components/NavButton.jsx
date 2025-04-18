import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome } from "react-icons/hi";

export default function NavButton({ link, name, icon }) {
  const currentPath = usePathname();
  return (
    <Link href={link}>
      <div
        className={`flex gap-2 rounded-lg px-2 py-1.5 hover:bg-base-100 ${
          link === currentPath && "bg-base-200"
        } transition-all duration-200`}
      >
        <div
          className={`self-center ${link === currentPath && "text-primary"}`}
        >
          {icon}
        </div>
        <div>{name}</div>
      </div>
    </Link>
  );
}
