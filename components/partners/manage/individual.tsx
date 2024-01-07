import Image from "next/image";
import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

export default function BusinessForm({ merchant }: { merchant: any }) {
  const vehicleNumber = merchant.merchantInformation?.vehicleNumber || "";
  const driversLicense = merchant.merchantInformation?.driversLicense || "";
  const vehiclePapers = merchant.documents || "";
  const image = merchant.contactInformation?.person?.image || "";
  const dateOfBirth = format(
    new Date(merchant.contactInformation?.person.dateOfBirth || 0),
    "dd/MM/yyyy"
  );
  const bank = {
    accountNumber: merchant.paymentDetails?.accountNumber || "",
    bankName: merchant.paymentDetails?.bankName || "",
  };
  const deliveryCategory = Object.entries(merchant.deliveryVehicleInformation)
    .filter(([_, value]) => {
      const val = value as { available: boolean; count: number };
      return val.available;
    })
    .map(([category, _]) => (category === "bike" ? "motorcycle" : category));
  const addressDetail = {
    flatNumber:
      merchant.contactInformation?.officeAddress.flatNumber ||
      merchant.contactInformation?.registeredAddress.flatNumber ||
      "",
    landmark:
      merchant.contactInformation?.officeAddress.landmark ||
      merchant.contactInformation?.registeredAddress.landmark ||
      "",
    buildingNumber:
      merchant.contactInformation?.officeAddress.buildingNumber ||
      merchant.contactInformation?.registeredAddress.buildingNumber ||
      "",
    buildingName:
      merchant.contactInformation?.officeAddress.buildingName ||
      merchant.contactInformation?.registeredAddress.buildingName ||
      "",
    street:
      merchant.contactInformation?.officeAddress.street ||
      merchant.contactInformation?.registeredAddress.street ||
      "",
    subStreet:
      merchant.contactInformation?.officeAddress.subStreet ||
      merchant.contactInformation?.registeredAddress.subStreet ||
      "",
    country:
      merchant.contactInformation?.officeAddress.country ||
      merchant.contactInformation?.registeredAddress.country ||
      "",
    state:
      merchant.contactInformation?.officeAddress.state ||
      merchant.contactInformation?.registeredAddress.state ||
      "",
    city:
      merchant.contactInformation?.officeAddress.city ||
      merchant.contactInformation?.registeredAddress.city ||
      "",
  };
  const directorReport = {
    idType: merchant.merchantInformation.verificationReport.idType || "",
    status: merchant.merchantInformation.verificationReport?.isVerified
      ? "Verified"
      : "Not Verified",
    dob: merchant.merchantInformation.verificationReport.report.birthDate
      ? format(
          new Date(
            merchant.merchantInformation.verificationReport.report.birthDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    expiry: merchant.merchantInformation.verificationReport.report.expiryDate
      ? format(
          new Date(
            merchant.merchantInformation.verificationReport.report.expiryDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    firstName:
      merchant.merchantInformation.verificationReport.report.firstName || "",
    lastName:
      merchant.merchantInformation.verificationReport.report.lastName || "",
    middleName:
      merchant.merchantInformation.verificationReport.report.middleName || "",
    gender: merchant.merchantInformation.verificationReport.report.gender || "",
    licenseNo:
      merchant.merchantInformation.verificationReport.report.licenseNo || "",
    state:
      merchant.merchantInformation.verificationReport?.report.stateOfIssue ||
      "",
    photo: merchant.merchantInformation?.verificationReport?.report.photo || "",
    issuedDate: merchant.merchantInformation.verificationReport.report
      .issuedDate
      ? format(
          new Date(
            merchant.merchantInformation.verificationReport.report.issuedDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    verificationChecks: merchant.verificationChecks,
  };

  return (
    <form className="space-y-8">
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="vehicleNumber">Number Plate</Label>
          <Input id="vehicleNumber" value={vehicleNumber} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="driversLicense">Driver’s License</Label>
          <Input id="driversLicense" value={driversLicense} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input type="text" id="bankName" value={bank.bankName} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="accNumber">Account Number</Label>
          <Input
            type="text"
            id="accNumber"
            value={bank.accountNumber}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="gap-3">
          <Label htmlFor="vehiclePapers">Vehicle Papers</Label>
          {/* @ts-expect-error */}
          {vehiclePapers.map((paper, i) => (
            <Avatar key={i} className="rounded-none relative">
              <AvatarImage asChild src={vehiclePapers}>
                <Image
                  width={40}
                  height={40}
                  src={paper.vehiclePaperImages || ""}
                  alt="Vehicle Papers"
                />
              </AvatarImage>
            </Avatar>
          ))}
        </div>
        <div className="gap-3">
          <Label htmlFor="dob">Passport Photo</Label>
          <Avatar className="rounded-none relative">
            <AvatarImage asChild src={image}>
              <Image
                width={40}
                height={40}
                src={image}
                alt="Director's passport"
              />
            </AvatarImage>
          </Avatar>
        </div>
      </div>
      <div className="block xl:grid xl:grid-cols-2 gap-3 space-y-8 xl:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="dob">Date Of Birth</Label>
          <Input type="text" id="dob" value={dateOfBirth} disabled />
        </div>
        <div className="space-y-4">
          <h4>Category</h4>
          <div className="flex items-center gap-6 space-y-0">
            {CATEGORIES.map((category) => (
              <span key={category} className="flex items-center gap-2">
                <Checkbox checked={deliveryCategory.includes(category)} />
                <Label className="capitalize">{category}</Label>
              </span>
            ))}
          </div>
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
              value={addressDetail.flatNumber}
              disabled
            />
          </div>
          <div className="w-full items-center gap-2">
            <Label htmlFor="buildingName">Building Name</Label>
            <Input
              type="text"
              id="buildingName"
              value={addressDetail.buildingName}
              disabled
            />
          </div>
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="landmark">Landmark</Label>
          <Input
            type="text"
            id="landmark"
            value={addressDetail.landmark}
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
              value={addressDetail.buildingNumber}
              disabled
            />
          </div>
          <div className="w-full items-center gap-2">
            <Label htmlFor="street">Street</Label>
            <Input
              type="text"
              id="street"
              value={addressDetail.street}
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
              value={addressDetail.subStreet}
              disabled
            />
          </div>
          <div className="w-full items-center gap-2">
            <Label htmlFor="city">City</Label>
            <Input type="text" id="city" value={addressDetail.city} disabled />
          </div>
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="state">State</Label>
          <Input type="text" id="state" value={addressDetail.state} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            type="text"
            id="country"
            value={addressDetail.country}
            disabled
          />
        </div>
      </div>
      <h2 className="font-semibold text-sm text-primary">
        Individual Verification Report
      </h2>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="idType">ID Type</Label>
          <Input
            type="text"
            id="idType"
            value={directorReport.idType.replace("_", " ")}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="status">Status</Label>
          <Input
            type="text"
            id="status"
            value={directorReport.status}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input type="text" id="dob" value={directorReport.dob} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="expiry">ID Expiry Date</Label>
          <Input
            type="text"
            id="expiry"
            value={directorReport.expiry}
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
            value={directorReport.firstName}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={directorReport.lastName}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            type="text"
            id="middleName"
            value={directorReport.middleName}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            type="text"
            id="gender"
            value={directorReport.gender}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="license">License No.</Label>
          <Input
            type="text"
            id="license"
            value={directorReport.licenseNo}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="issuesDate">Issued Date</Label>
          <Input
            type="text"
            id="issuesDate"
            value={directorReport.issuedDate}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="issuesDate">State of Issue</Label>
          <Input
            type="text"
            id="issuesDate"
            value={directorReport.state}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="license">Passport Photo</Label>
          <Image
            width={80}
            height={80}
            src={directorReport.photo}
            alt="Director's passport"
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <p className="my-3 text-sm">
            <strong>Verification checks: </strong>
            {directorReport.verificationChecks}
          </p>
        </div>
      </div>
    </form>
  );
}
