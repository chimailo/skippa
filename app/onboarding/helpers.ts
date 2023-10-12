import { z } from "zod";

export const iVInitialValues = {
  driversLicense: "",
  vehicleNumber: "",
  dateOfBirth: new Date(),
  guarantorDetail: {
    lastName: "",
    firstName: "",
    email: "",
  },
  addressDetail: {
    flatNumber: "",
    buildingName: "",
    landmark: "",
    buildingNumber: "",
    street: "",
    subStreet: "",
    country: "",
    state: "",
    city: "",
  },
  bankAccountDetail: {
    bankName: "",
    accountNumber: "",
  },
  deliveryCategory: [],
};

export const bVinitialValues = {
  billingEmail: "",
  supportEmail: "",
  tin: "",
  registrationNumber: "",
  // socialMedia: {},
  deliveryCategory: [],
  bankAccountDetail: {
    bankName: "",
    accountNumber: "",
  },
  directorDetail: {
    idNumber: "",
    idType: "",
    firstName: "",
    lastName: "",
    dob: new Date(),
  },
  addressDetail: {
    flatNumber: "",
    landmark: "",
    buildingNumber: "",
    buildingName: "",
    street: "",
    subStreet: "",
    country: "",
    state: "",
    city: "",
  },
};

export const BVFormSchema = z.object({
  billingEmail: z
    .string()
    .nonempty({ message: "Billing Email is required" })
    .email({ message: "Invalid email" }),
  supportEmail: z.string().email({ message: "Invalid email" }),
  tin: z
    .string()
    .nonempty({ message: "Tax Identification Number is required" })
    .min(2, "Tax Identification Number must be at least 2 characters long")
    .max(
      64,
      "Tax Identification Number cannot be more than 64 characters long"
    ),
  registrationNumber: z
    .string()
    .nonempty({ message: "Registration Number is required" })
    .min(2, "Registration Number must be at least 2 characters long")
    .max(64, "Registration Number cannot be more than 64 characters"),
  deliveryCategory: z
    .string()
    .array()
    .nonempty("You have to select at least one item."),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z.string(),
  }),
  directorDetail: z.object({
    idNumber: z
      .string()
      .nonempty({ message: "The director's ID number is required" }),
    idType: z
      .string()
      .nonempty({ message: "The director's ID type is required" }),
    firstName: z
      .string()
      .nonempty({ message: "First Name is required" })
      .min(2, "First Name must be at least 2 characters long")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .nonempty({ message: "Last Name is required" })
      .min(2, "Last Name must be at least 2 characters long")
      .max(64, "Last Name cannot be more than 64 characters"),
    dob: z.date({
      required_error: "Date of birth is required.",
    }),
  }),
  addressDetail: z.object({
    flatNumber: z.string(),
    buildingName: z.string(),
    landmark: z.string().nonempty({ message: "Landmark is required" }),
    buildingNumber: z
      .string()
      .nonempty({ message: "Building Number is required" }),
    street: z
      .string()
      .nonempty({ message: "Street is required" })
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string(),
    country: z.string().nonempty({ message: "Country is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    city: z.string().nonempty({ message: "LGA is required" }),
  }),
});

export const IVFormSchema = z.object({
  driversLicense: z
    .string()
    .nonempty({ message: "Drivier's license id is required" })
    .min(2, "Drivier's license id must be at least 2 characters long")
    .max(64, "Drivier's license id cannot be more than 32 characters"),
  vehicleNumber: z
    .string()
    .nonempty({ message: "Vehicle number is required" })
    .min(2, "Vehicle Number must be at least 2 characters long")
    .max(64, "Vehicle Number cannot be more than 16 characters"),
  dateOfBirth: z.date(),
  guarantorDetail: z.object({
    email: z
      .string()
      .nonempty({ message: "Guarantor email is required" })
      .email("Invalid email"),
    firstName: z
      .string()
      .nonempty({ message: "First Name is required" })
      .min(2, "First Name must be at least 2 characters long")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .nonempty({ message: "Last Name is required" })
      .min(2, "Last Name must be at least 2 characters long")
      .max(64, "Last Name cannot be more than 64 characters"),
  }),
  addressDetail: z.object({
    flatNumber: z.string(),
    buildingName: z.string(),
    landmark: z.string().nonempty({ message: "Landmark is required" }),
    buildingNumber: z
      .string()
      .nonempty({ message: "Building Number is required" }),
    street: z
      .string()
      .nonempty({ message: "Street is required" })
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string(),
    country: z.string().nonempty({ message: "Country is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    city: z.string().nonempty({ message: "LGA is required" }),
  }),
  deliveryCategory: z
    .string()
    .array()
    .nonempty("You have to select at least one item."),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z.string(),
  }),
});
