import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserForm({ merchant }: { merchant: any }) {
  const user = merchant.contactInformation.person;

  return (
    <form className="space-y-8">
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input type="text" id="firstName" value={user.firstName} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input type="text" id="lastName" value={user.lastName} disabled />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={user.email} disabled />
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="phone">First Name</Label>
          <Input type="text" id="phone" value={user.mobile} disabled />
        </div>
      </div>
    </form>
  );
}
