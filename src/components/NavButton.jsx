import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton({ link, name, icon }) {
  const currentPath = usePathname();
  const isCurrentPath = currentPath.includes(link);
  return (
    <Link href={link}>
      <div
        className={`flex w-full h-11 items-center justify-between gap-2 rounded-xl px-4 py-1.5 hover:bg-base-100/50 ${
          isCurrentPath && "bg-primary/10"
        } transition-all duration-200`}
      >
        <div className="flex gap-2">
          <div className={`self-center ${isCurrentPath && "text-primary"}`}>
            {icon}
          </div>
          <div className="text-lg">{name}</div>
        </div>
      </div>
    </Link>
  );
}
