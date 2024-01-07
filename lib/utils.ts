import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCamelCaseText(str?: string) {
  if (!str) return;
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

export function dobRange() {
  const dateTo = new Date().getFullYear() - 18;
  const dateFrom = new Date().getFullYear() - 70;
  const defaultMonth = new Date(dateTo, new Date().getMonth());
  return { dateFrom, dateTo, defaultMonth };
}

export function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getStatus() {
  return {
    activated: {
      color: "#00462A",
      bgColor: "#5FDBA7",
    },
    suspended: {
      color: "#555F64",
      bgColor: "#C1CFD4",
    },
    "pending-activation": {
      color: "#478296",
      bgColor: "#ADD8E6",
    },
    "processing-activation": {
      color: "#4EC6C6",
      bgColor: "#008080",
    },
    rejected: {
      color: "#F1B8B8",
      bgColor: "#FD4141",
    },
    pending: {
      color: "#A6A642",
      bgColor: "#FFFF99",
    },
  };
}

export const getSanitizedMarkup = (content: string) =>
  DOMPurify.sanitize(marked.parse(content) as string);
