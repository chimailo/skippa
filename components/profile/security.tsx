import Link from "next/link";
import { User } from "@/types";

export default function Security({ user }: { user: User }) {
  const dateAdded = user.role.createdAt as string;
  const permissions = user.role.permissions as string[];

  return (
    <div className="py-5 space-y-5">
      <div className="grid grid-cols-3 gap-4 sm:px-5 max-w-lg">
        <p className="font-semibold text-sm">Password</p>
        <span className="font-semibold leading-none text-xl">***********</span>
        <Link
          href="/profile/change-password"
          className="text-white text-xs bg-primary w-fit px-3 py-1 font-bold rounded-2xl"
        >
          Change
        </Link>
      </div>
      <hr className="bg-zinc-300 h-0.5" />
      <div className="grid grid-cols-3 gap-4 sm:px-5 max-w-lg">
        <p className="font-semibold text-sm">Date Added</p>
        <p className="text-sm col-span-2">
          {new Intl.DateTimeFormat("en-ng").format(new Date(dateAdded))}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:px-5 max-w-lg">
        <p className="font-semibold text-sm">Role</p>
        <p className="text-sm col-span-2 break-words">{user.role.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:px-5 max-w-lg">
        <p className="font-semibold text-sm">Access</p>
        <p className="text-sm capitalize col-span-2 break-words">
          {permissions.map((perm: string) => perm.split(":").join(" ") + ", ")}
        </p>
      </div>
    </div>
  );
}
