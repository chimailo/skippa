import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/types";

export default function RoleDetails({
  role,
  pages,
}: {
  role: Role;
  pages: string[];
}) {
  function getRolePerms(permissions?: string[]) {
    const perms: string[] = [];
    permissions &&
      permissions.forEach((perm) => {
        let page = perm.split(":")[0];

        if (!perms.includes(page)) perms.push(page);
      });
    return perms;
  }

  return (
    <section className="w-full pr-5 pl-5 md:pl-0 pb-5 md:pb-0">
      <h1 className="font-bold text-lg">{role.name}</h1>
      <p className="my-2.5">{role.description}</p>
      <div className="bg-zinc-200 mt-6 md:mt-10 rounded p-2 mb-5">
        <h2 className="text-black">This role has access to:</h2>
      </div>
      {pages.map((page) => (
        <div key={page} className="flex items-center space-x-3 my-4 md:my-6">
          <Checkbox
            id={page}
            checked={getRolePerms(role.permissions as string[]).includes(page)}
            disabled
          />
          <label htmlFor={page} className="font-medium capitalize text-base">
            {page === "businesses" ? "partners" : page}
          </label>
        </div>
      ))}
    </section>
  );
}
