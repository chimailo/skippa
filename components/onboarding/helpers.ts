import { z } from "zod";

export const iVInitialValues = {
  driversLicense: "",
  vehicleNumber: "",
  dateOfBirth: undefined,
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
  image: undefined,
  vehiclePapers: undefined,
};

export const bVinitialValues = {
  billingEmail: "",
  supportEmail: "",
  tin: "",
  registrationNumber: "",
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
    dateOfBirth: undefined,
    image: undefined,
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
    .min(1, "Billing Email is required")
    .email({ message: "Invalid email" }),
  supportEmail: z.string().optional(), //.email({ message: "Invalid email" }),
  tin: z
    .string()
    .min(1, "Tax Identification Number is required")
    .max(64, "Tax ID Number cannot be more than 64 characters long"),
  registrationNumber: z
    .string()
    .min(1, "Registration Number is required")
    .max(64, "Registration Number cannot be more than 64 characters"),
  deliveryCategory: z
    .string()
    .array()
    .min(1, "You have to select at least one item."),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z
      .string()
      .length(10, { message: "Account number must be exactly 10 digits" }),
  }),
  directorDetail: z.object({
    idNumber: z.string().min(1, "The director's ID number is required"),
    idType: z.string().min(1, "The director's ID type is required"),
    firstName: z
      .string()
      .min(1, "First Name is required")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .min(1, "Last Name is required")
      .max(64, "Last Name cannot be more than 64 characters"),
    dateOfBirth: z
      .date()
      .refine((val) => Boolean(val), "Date of birth is required"),
    image: z.string(),
  }),
  addressDetail: z.object({
    flatNumber: z.string().optional(),
    buildingName: z.string().optional(),
    landmark: z.string().min(1, "Landmark is required"),
    buildingNumber: z.string().min(1, "Building Number is required"),
    street: z
      .string()
      .min(1, "Street is required")
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  }),
});

export const IVFormSchema = z.object({
  driversLicense: z
    .string()
    .min(1, "Drivier's license id is required")
    .max(64, "Drivier's license id cannot be more than 32 characters"),
  vehicleNumber: z
    .string()
    .min(1, "Vehicle number is required")
    .max(64, "Vehicle Number cannot be more than 16 characters"),
  dateOfBirth: z
    .date()
    .refine((val) => Boolean(val), "Date of birth is required"),
  guarantorDetail: z.object({
    email: z
      .string()
      .min(1, "Guarantor email is required")
      .email("Invalid email"),
    firstName: z
      .string()
      .min(1, "First Name is required")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .min(1, "Last Name is required")
      .max(64, "Last Name cannot be more than 64 characters"),
  }),
  image: z.string(),
  vehiclePapers: z
    .object({
      vehiclePaperImages: z.string().url(),
      type: z.string(),
      name: z.string(),
    })
    .array()
    .nonempty({ message: "Vehicle papers must contain at least one document" }),
  addressDetail: z.object({
    flatNumber: z.string().optional(),
    buildingName: z.string().optional(),
    landmark: z.string().min(1, "Landmark is required"),
    buildingNumber: z.string().min(1, "Building Number is required"),
    street: z
      .string()
      .min(1, "Street is required")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  }),
  deliveryCategory: z
    .string()
    .array()
    .min(1, "You have to select at least one item."),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z
      .string()
      .length(10, { message: "Account number must be exactly 10 digits" }),
  }),
});

export const IProfileFormSchema = z.object({
  driversLicense: z
    .string()
    .min(1, "Drivier's license id is required")
    .max(64, "Drivier's license id cannot be more than 32 characters"),
  vehicleNumber: z
    .string()
    .min(1, "Vehicle number is required")
    .max(64, "Vehicle Number cannot be more than 16 characters"),
  dateOfBirth: z
    .date()
    .refine((val) => Boolean(val), "Date of birth is required"),
  image: z.string(),
  vehiclePapers: z
    .object({
      vehiclePaperImages: z.string().url(),
      type: z.string(),
      name: z.string(),
    })
    .array()
    .nonempty({ message: "Vehicle papers must contain at least one document" }),
  addressDetail: z.object({
    flatNumber: z.string().optional(),
    buildingName: z.string().optional(),
    landmark: z.string().min(1, "Landmark is required"),
    buildingNumber: z.string().min(1, "Building Number is required"),
    street: z
      .string()
      .min(1, "Street is required")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  }),
  deliveryCategory: z
    .string()
    .array()
    .min(1, "You have to select at least one item."),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z
      .string()
      .length(10, { message: "Account number must be exactly 10 digits" }),
  }),
});

export const GuarantorFormSchema = z.object({
  guarantorDetail: z.object({
    email: z
      .string()
      .min(1, "Guarantor email is required")
      .email("Invalid email"),
    firstName: z
      .string()
      .min(1, "First Name is required")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .min(1, "Last Name is required")
      .max(64, "Last Name cannot be more than 64 characters"),
  }),
});
