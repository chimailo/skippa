import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCamelCaseText(str: string) {
  return str.split(/(?=[A-Z]+|[0-9]+)/).join(" ");
}

export const validatePassport = (file: File) => {
  const MAX_FILE_SIZE = 1024 * 1024;
  const ACCEPTED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (ACCEPTED_MIME_TYPES.every((type) => file.type !== type)) {
    return `Only .jpg, .jpeg, .png and .webp files are accepted.`;
  }

  if (file.size > MAX_FILE_SIZE) {
    return `Passport must not be larger than 1mb`;
  }
};

export const validatePaper = (file: File) => {
  const MAX_FILE_SIZE = 1024 * 1024;
  const ACCEPTED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (ACCEPTED_MIME_TYPES.every((type) => file.type !== type)) {
    return `Only .jpg, .jpeg, .png .webp and .pdf files are accepted.`;
  }

  if (file.size > MAX_FILE_SIZE) {
    return `Passport must not be larger than 1mb`;
  }
};
