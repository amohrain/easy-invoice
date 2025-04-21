import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton({ link, name, icon }) {
  const currentPath = usePathname();
  const isCurrentPath = currentPath.includes(link);
  return (
    <Link href={link}>
      <div
        className={`flex gap-2 rounded-lg px-2 py-1.5 hover:bg-base-100 ${
          isCurrentPath && "bg-base-200"
        } transition-all duration-200`}
      >
        <div className={`self-center ${isCurrentPath && "text-primary"}`}>
          {icon}
        </div>
        <div>{name}</div>
      </div>
    </Link>
  );
}
