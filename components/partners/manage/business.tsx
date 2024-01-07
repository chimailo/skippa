import Image from "next/image";
import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

export default function BusinessForm({ merchant }: { merchant: any }) {
  const billingEmail = merchant.contactInformation?.general?.billingEmail || "";
  const supportEmail = merchant.contactInformation?.general?.supportEmail || "";
  const tin = merchant.merchantInformation?.tin || "";
  const registrationNumber =
    merchant.merchantInformation?.registrationNumber || "";
  const bank = {
    accountNumber: merchant.paymentDetails?.accountNumber || "",
    bankName: merchant.paymentDetails?.bankName || "",
  };
  const director = {
    dateOfBirth: format(
      new Date(merchant.contactInformation?.director.dateOfBirth || 0),
      "dd/MM/yyyy"
    ),
    firstName: merchant.contactInformation?.director?.firstName || "",
    lastName: merchant.contactInformation?.director?.lastName || "",
    image: merchant.contactInformation?.director?.image || "",
    idNumber: merchant.contactInformation?.director?.idNumber || "",
    idType: merchant.contactInformation?.director?.idType || "",
  };
  const socialMedia = {
    twitter: merchant.contactInformation?.general?.twitter || "",
    facebook: merchant.contactInformation?.general?.facebook || "",
    instagram: merchant.contactInformation?.general?.instagram || "",
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
  const businessReport = {
    idType: merchant.merchantInformation.verificationReport.idType || "",
    status: merchant.merchantInformation.verificationReport?.isVerified
      ? "Verified"
      : "Not Verified",
    address:
      merchant.merchantInformation.verificationReport.report?.company_address ||
      "",
    branchAddress:
      merchant.merchantInformation.verificationReport.report?.branchAddress ||
      "",
    name:
      merchant.merchantInformation.verificationReport.report?.company_name ||
      "",
    company_status:
      merchant.merchantInformation.verificationReport.report?.company_status ||
      "",
    company_type:
      merchant.merchantInformation.verificationReport.report?.company_type ||
      "",
    email_address:
      merchant.merchantInformation.verificationReport.report?.email_address ||
      "",
    lga: merchant.merchantInformation.verificationReport.report?.lga || "",
    city: merchant.merchantInformation.verificationReport.report?.city || "",
    state: merchant.merchantInformation.verificationReport.report?.state || "",
    rc_number:
      merchant.merchantInformation.verificationReport.report?.rc_number || "",
    regDate: merchant.merchantInformation.verificationReport.report
      ?.registrationDate
      ? format(
          new Date(
            merchant.merchantInformation.verificationReport.report?.registrationDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    searchScore:
      merchant.merchantInformation.verificationReport.report?.searchScore || "",
  };
  const directorReport = {
    firstName:
      merchant.contactInformation?.director?.verificationReport?.report
        ?.firstName || "",
    lastName:
      merchant.contactInformation?.director?.verificationReport?.report
        ?.lastName || "",
    image:
      merchant.contactInformation?.director?.verificationReport?.report
        ?.image || "",
    idNumber:
      merchant.contactInformation?.director?.verificationReport?.report
        ?.idNumber || "",
    idType:
      merchant.contactInformation?.director?.verificationReport?.idType || "",
    status: merchant.contactInformation.director?.verificationReport?.isVerified
      ? "Verified"
      : "Not Verified",
    dob: merchant.contactInformation?.director?.verificationReport?.report
      ?.dateOfBirth
      ? format(
          new Date(
            merchant.contactInformation?.director?.verificationReport?.report?.dateOfBirth
          ),
          "dd/MM/yyyy"
        )
      : merchant.contactInformation?.director?.verificationReport?.report
          ?.birthDate
      ? format(
          new Date(
            merchant.contactInformation?.director?.verificationReport?.report?.birthDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    expiry: merchant.contactInformation?.director?.verificationReport?.report
      ?.expiryDate
      ? format(
          new Date(
            merchant.contactInformation?.director?.verificationReport?.report?.expiryDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    middleName:
      merchant.contactInformation.director?.verificationReport?.report
        ?.middleName || "",
    gender:
      merchant.contactInformation.director?.verificationReport?.report
        ?.gender || "",
    state:
      merchant.contactInformation.director?.verificationReport?.report
        ?.stateOfIssue || "",
    photo:
      merchant.contactInformation?.director?.verificationReport?.report
        ?.photo || "",
    registrationDate: merchant.contactInformation?.director?.verificationReport
      ?.report?.registrationDate
      ? format(
          new Date(
            merchant.contactInformation?.director?.verificationReport?.report?.registrationDate
          ),
          "dd/MM/yyyy"
        )
      : "",
    licenseNo:
      merchant.contactInformation.director?.verificationReport?.report
        ?.licenseNo || "",
    issued_at:
      merchant.contactInformation.director?.verificationReport?.report
        ?.issued_at || "",
    issuedAddress:
      merchant.contactInformation.director?.verificationReport?.report
        ?.issuedAddress || "",
    issuedDate:
      merchant.contactInformation.director?.verificationReport?.report
        ?.issuedDate ||
      merchant.contactInformation.director?.verificationReport?.report
        ?.issued_date
        ? format(
            new Date(
              merchant.contactInformation.director?.verificationReport?.report
                ?.issuedDate ||
                merchant.contactInformation.director?.verificationReport?.report
                  ?.issued_date
            ),
            "dd/MM/yyyy"
          )
        : "",
    verificationChecks: merchant.verificationChecks,
  };

  const socMedia = Object.entries(socialMedia).filter(([_, value]) => !!value);

  return (
    <form className="space-y-8">
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="billingEmail">Billing Email</Label>
          <Input type="email" id="billingEmail" value={billingEmail} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input type="email" id="supportEmail" value={supportEmail} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="firstName">Director&apos;s First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={director.firstName}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="lastName">Director&apos;s Last Name</Label>
          <Input type="text" id="lastName" value={director.lastName} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="idType">Director’s ID Type</Label>
          <Input
            type="text"
            id="idType"
            value={director.idType.replace("_", " ")}
            className="capitalize"
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="idNumber">ID Number</Label>
          <Input type="text" id="idNumber" value={director.idNumber} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="dob">Date Of Birth</Label>
          <Input type="text" id="dob" value={director.dateOfBirth} disabled />
        </div>
        <div className="gap-3">
          <Label htmlFor="dob">Passport Photo</Label>
          <Avatar className="rounded-none relative">
            <AvatarImage asChild src={director.image}>
              <Image
                width={40}
                height={40}
                src={director.image}
                alt="Director's passport"
              />
            </AvatarImage>
          </Avatar>
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="tin">Tax Identification Number</Label>
          <Input type="text" id="tin" value={tin} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="regNumber">RC Number</Label>
          <Input
            type="text"
            id="regNumber"
            value={registrationNumber}
            disabled
          />
        </div>
      </div>
      <div className="block xl:grid xl:grid-cols-2 gap-3 space-y-8 xl:space-y-0">
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
        <div className="space-y-1 md:space-y-4">
          {socMedia.map(([medium, handle], i) => (
            <div key={i} className="grid grid-cols-3 gap-2 flex-1">
              <div className="col-span-1">
                <h2 className="text-sm font-medium">Social Media</h2>
                <div className="w-full items-center gap-2">
                  <Input type="text" id="socMedia" value={medium} disabled />
                </div>
              </div>
              <div className="col-span-2">
                <h2 className="text-sm font-medium">Social Media Handle</h2>
                <div className="w-full items-center gap-2">
                  <Input
                    type="text"
                    id="socMediaHandle"
                    value={handle}
                    disabled
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input type="text" id="bankName" value={bank.bankName} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="accNumber">RC Number</Label>
          <Input
            type="text"
            id="accNumber"
            value={bank.accountNumber}
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
              id="flatNumber"
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
        Business Verification Report
      </h2>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="idType">ID Type</Label>
          <Input
            type="text"
            id="idType"
            value={businessReport.idType}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="status">Status</Label>
          <Input
            type="text"
            id="status"
            value={businessReport.status}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="name">Company Name</Label>
          <Input type="text" id="name" value={businessReport.name} disabled />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="status">Company Status</Label>
          <Input
            type="text"
            id="status"
            value={businessReport.company_status}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="type">Company Type</Label>
          <Input
            type="text"
            id="type"
            value={businessReport.company_type}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="registrationDate">Registration Date</Label>
          <Input
            type="text"
            id="registrationDate"
            value={businessReport.regDate}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="rcNumber">RC Number</Label>
          <Input
            type="text"
            id="rcNumber"
            value={businessReport.rc_number}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="email">Company Email</Label>
          <Input
            type="email"
            id="email"
            value={businessReport.email_address}
            disabled
          />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="address">Company Address</Label>
          <Input
            type="text"
            id="address"
            value={businessReport.address}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="lga">LGA</Label>
          <Input type="text" id="lga" value={businessReport.lga} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="address">City</Label>
          <Input
            type="text"
            id="address"
            value={businessReport.city}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="lga">State</Label>
          <Input type="text" id="lga" value={businessReport.state} disabled />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="address">Branch Address</Label>
          <Input
            type="text"
            id="address"
            value={businessReport.branchAddress}
            disabled
          />
        </div>
        <div className="w-full items-center gap-2">
          <Label htmlFor="searchScore">Search Score</Label>
          <Input
            type="text"
            id="searchScore"
            value={businessReport.searchScore}
            disabled
          />
        </div>
      </div>
      <h2 className="font-semibold text-sm text-primary">
        Director Verification Report
      </h2>
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="w-full items-center gap-2">
          <Label htmlFor="idType">ID Type</Label>
          <Input
            type="text"
            id="idType"
            className="capitalize"
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
        {directorReport.idType === "bvn" ? (
          <div className="w-full items-center gap-2">
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Input
              type="text"
              id="registrationDate"
              value={directorReport.registrationDate}
              disabled
            />
          </div>
        ) : (
          <div className="w-full items-center gap-2">
            <Label htmlFor="issuesDate">Issued Date</Label>
            <Input
              type="text"
              id="issuesDate"
              value={directorReport.issuedDate}
              disabled
            />
          </div>
        )}
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
      {directorReport.idType !== "bvn" && (
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          {directorReport.idType === "passport" ? (
            <div className="w-full items-center gap-2">
              <Label htmlFor="issuedAddress">Issued address</Label>
              <Input
                type="text"
                id="issuedAddress"
                value={directorReport.issuedAddress}
                disabled
              />
            </div>
          ) : (
            <div className="w-full items-center gap-2">
              <Label htmlFor="license">License No.</Label>
              <Input
                type="text"
                id="license"
                value={directorReport.licenseNo}
                disabled
              />
            </div>
          )}
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
      )}
      <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        {directorReport.idType !== "bvn" && (
          <div className="w-full items-center gap-2">
            <Label htmlFor="issuesDate">State of Issue</Label>
            <Input
              type="text"
              id="issuesDate"
              value={directorReport.state}
              disabled
            />
          </div>
        )}
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
