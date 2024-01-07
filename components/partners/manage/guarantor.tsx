import format from "date-fns/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NoData from "@/components/nodata";

export default function GuarantorForm({ merchant }: { merchant: any }) {
  const guarantor = merchant.guarantorDetails.length
    ? merchant.guarantorDetails[merchant.guarantorDetails.length - 1]
    : null;

  return (
    <>
      {guarantor ? (
        <form className="space-y-8">
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={guarantor.firstName || ""}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={guarantor.lastName || ""}
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={guarantor.email || ""}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="idType">ID Type</Label>
              <Input
                type="text"
                id="idType"
                value={
                  guarantor.idType ? guarantor.idType.replace("_", " ") : ""
                }
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                type="text"
                id="idNumber"
                value={guarantor.idNumber || ""}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="employment">Employment Status</Label>
              <Input
                type="text"
                id="employment"
                value={guarantor.employmentStatus || ""}
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="employer">
                Employer (Ignore if self-employed)
              </Label>
              <Input
                type="text"
                id="employer"
                value={guarantor.employer || ""}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="text"
                id="phone"
                value={guarantor.mobile || ""}
                disabled
              />
            </div>
          </div>
          <h3 className="font-semibold text-sm">Address Details</h3>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="sm:grid sm:grid-cols-2 gap-2 space-y-8 sm:space-y-0">
              <div className="w-full items-center gap-2">
                <Label htmlFor="flstNumber">Flat Number</Label>
                <Input
                  type="text"
                  id="flstNumber"
                  value={guarantor.residentialAddress.flatNumber || ""}
                  disabled
                />
              </div>
              <div className="w-full items-center gap-2">
                <Label htmlFor="buildingName">Building Name</Label>
                <Input
                  type="text"
                  id="buildingName"
                  value={guarantor.residentialAddress.buildingname || ""}
                  disabled
                />
              </div>
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                type="text"
                id="landmark"
                value={guarantor.residentialAddress.landmark || ""}
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
              <div className="w-full items-center gap-2">
                <Label htmlFor="buildingNo">Building No.</Label>
                <Input
                  type="text"
                  id="buildingNo"
                  value={guarantor.residentialAddress.buildingNumber || ""}
                  disabled
                />
              </div>
              <div className="w-full items-center gap-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  type="text"
                  id="street"
                  value={guarantor.residentialAddress.street || ""}
                  disabled
                />
              </div>
            </div>
            <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
              <div className="w-full items-center gap-2">
                <Label htmlFor="substreet">Substreet</Label>
                <Input
                  type="text"
                  id="substreet"
                  value={guarantor.residentialAddress.subStreet || ""}
                  disabled
                />
              </div>
              <div className="w-full items-center gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={guarantor.residentialAddress.city || ""}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                value={guarantor.residentialAddress.state || ""}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                value={guarantor.residentialAddress.country || ""}
                disabled
              />
            </div>
          </div>
          <h2 className="font-semibold text-sm text-primary">
            Guarantor Verification Report
          </h2>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="idType">ID Type</Label>
              <Input
                type="text"
                id="idType"
                value={guarantor.verificationReport.idType.replace("_", " ")}
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="status">Status</Label>
              <Input
                type="text"
                id="status"
                value={
                  guarantor.verificationReport.isVerified
                    ? "Verified"
                    : guarantor.verificationReport.isRejected
                    ? "Rejected"
                    : "Not Verified"
                }
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                type="text"
                id="dob"
                value={
                  guarantor.verificationReport.report.dob ||
                  guarantor.verificationReport.report?.dateOfBirth
                    ? format(
                        new Date(
                          guarantor.verificationReport.report?.dob ||
                            guarantor.verificationReport.report?.dateOfBirth
                        ),
                        "dd/MM/yyyy"
                      )
                    : ""
                }
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input
                type="text"
                id="mobile"
                value={
                  guarantor.verificationReport.report.mobile ||
                  guarantor.verificationReport.report.phoneNumber ||
                  ""
                }
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={
                  guarantor.verificationReport.report.first_name ||
                  guarantor.verificationReport.report.firstName ||
                  ""
                }
                disabled
              />
            </div>
            <div className="w-full items-center gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={
                  guarantor.verificationReport.report.last_name ||
                  guarantor.verificationReport.report.lastName ||
                  ""
                }
                disabled
              />
            </div>
          </div>
          <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <div className="w-full items-center gap-2">
              <Label htmlFor="firstName">Middle Name</Label>
              <Input
                type="text"
                id="middleName"
                value={
                  guarantor.verificationReport.report.middle_name ||
                  guarantor.verificationReport.report.middleName ||
                  ""
                }
                disabled
              />
            </div>
          </div>
          <p className="font-semibold text-sm">
            Verification Checks: {guarantor.verificationChecks || ""}
          </p>
          <p className="font-semibold text-sm">
            No. of Guarantors Provided: {merchant.guarantorDetails.length}
          </p>
        </form>
      ) : (
        <NoData message="There is currently no verified guarantor for this business" />
      )}
    </>
  );
}
