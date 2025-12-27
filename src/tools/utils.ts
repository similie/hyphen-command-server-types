import type { UUID } from "../models";
import CryptoJS from "crypto-js";
import { v4 } from "uuid";
export type MQTTFunctionalResponse = {
  value: any;
  key: string;
  id: string;
  request: string;
};

export const mqttMessageIdentity = (
  payload: Buffer<ArrayBufferLike>,
): string => {
  try {
    const value = JSON.parse(payload.toString());
    value._uid = generateUniqueUUID();
    return JSON.stringify(value);
  } catch {
    return payload.toString();
  }
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const wrapModelSet = <T>(
  models: T[],
  wrapOn: keyof T = "uid" as keyof T,
) => {
  const map = new Map<keyof T, T>();
  models.forEach((m) => map.set(m[wrapOn] as keyof T, m));

  return (key: keyof T) => {
    if (!map.has(key)) {
      return null;
    }
    return map.get(key);
  };
};

export const URL_HOST_PATTERN_FOR_INPUT =
  /^(https?:\/\/)?((([a-z0-9]([a-z0-9\-]*[a-z0-9])*)\.)+[a-z]{2,}|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[\-a-z0-9%_.~+]*)*(\?[;&a-z0-9%_.~+=\-]*)?(#[-a-z0-9_]*)?$/;
export const DOMAIN_PATTERN =
  /^(?:\*\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
export function isNumeric(str: string): boolean {
  if (typeof str !== "string") return false; // we only process strings
  const trimmed = str.trim();
  if (trimmed === "") return false;
  return !isNaN(Number(trimmed));
}

export const generateUniqueUUID = () => {
  return v4() as UUID;
};

export function formatDate(
  date: Date | string,
  locale = "en-AU",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString(locale, options);
}

export function formatMoney(value: number, currencySymbol: string = "$") {
  let formattedValue = value.toString();
  if (value.toString().includes(".")) {
    formattedValue = value.toFixed(2);
  } else {
    formattedValue = value.toString() + ".00";
  }
  return `${currencySymbol}${formattedValue}`;
}

export const siteMoneyFormatConfig = (
  value: number,
  currencyDivisor: number = 100,
  currencySymbol: string = "$",
): string => {
  if (typeof value !== "number" && isNaN(value)) {
    return "0.00";
  }
  const divisor = currencyDivisor;
  const formattedValue = (value / divisor).toFixed(2);
  return `${currencySymbol}${formattedValue}`;
};

export const errorMessageWithCode = (message: string) => {
  if (!message) {
    return { code: 500, message: message };
  }
  const errorCode = message.split(":");
  if (errorCode.length > 1) {
    const code = errorCode[0] || "500";
    const intValue = parseInt(code);
    return {
      code: Number.isNaN(intValue) ? 500 : intValue,
      message: errorCode[1],
    };
  }
  return { code: 500, message: message };
};

export const isDomainPattern = (str: string): boolean => {
  if (!str || typeof str !== "string") return false;
  return DOMAIN_PATTERN.test(str);
};

export const extractFormToJson = <T extends Record<string, any> = {}>(
  form: FormData,
) => {
  const asObject = Object.fromEntries(form.entries());
  const data: any = {};
  for (const key of Object.keys(asObject)) {
    try {
      data[key] = JSON.parse(asObject[key] as string);
    } catch {
      data[key] = asObject[key];
    }
  }
  return data as T;
};

export const delay = (timeout = 1000) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const generateRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUniqueId = (numBytes: number = 16): string => {
  const wordArray = CryptoJS.lib.WordArray.random(numBytes);
  // Convert the WordArray to a hexadecimal string
  return wordArray.toString(CryptoJS.enc.Hex);
};

export const isUUID = (value: string | UUID) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
  return regex.test(value);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const generateRandomPassword = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};

export const fileToUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(uint8Array);
    };
    reader.onerror = () => {
      reject(new Error("Error reading file as ArrayBuffer"));
    };
    reader.readAsArrayBuffer(file);
  });
};

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      resolve(arrayBuffer);
    };

    reader.onerror = function () {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

async function sha256Fallback(arrayBuffer: ArrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const hash = CryptoJS.SHA256(wordArray);
  return hash.toString(CryptoJS.enc.Hex);
}

async function sha256(arrayBuffer: ArrayBuffer) {
  if (crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } else {
    // Use fallback if crypto.subtle isn't available
    return sha256Fallback(arrayBuffer);
  }
}

export function sha256String(values: string) {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(values);
  const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
  const hash = CryptoJS.SHA256(wordArray);
  return hash.toString(CryptoJS.enc.Hex);
}

export const ParseSocketMessage = <T>(message: string): T => {
  try {
    return JSON.parse(message) as unknown as T;
  } catch {
    return message as unknown as T;
  }
};

export const stripStateFromObject = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

export const buildShaValueString = (data: any) => {
  return sha256String(JSON.stringify(data));
};

async function computeHash(arrayBuffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await sha256(arrayBuffer);
  return hashBuffer;
}

export const hashFileContents = async (file: File): Promise<string> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  return computeHash(arrayBuffer);
};

export const fileListToFile = async (file: File): Promise<File> => {
  const uint8Array = await fileToUint8Array(file);
  return new File([uint8Array as BlobPart], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
};

export const formatMessageServerMessage = (message: string) => {
  const backup = "Failed to send verification email";
  if (!message) {
    return backup;
  }

  try {
    const errMessage = JSON.parse(message);
    if (errMessage?.error) {
      return errMessage.error;
    }
    if (errMessage?.message) {
      return errMessage.message;
    }
    throw new Error("Not known json");
  } catch {
    return message;
  }
};

export const isOlderThanInDays = (created_at: Date, days: number): boolean => {
  // Get the current date and time
  const currentDate = new Date();

  // Calculate the target date by subtracting `days` from the current date
  const targetDate = new Date();
  targetDate.setDate(currentDate.getDate() - days);

  // Compare created_at with the target date
  return created_at < targetDate;
};

export const removeDoubleSpaces = (text: string) => {
  return text.replace(/\s\s+/g, " ");
};

export const removeContentSpace = (text: string) => {
  return removeDoubleSpaces(text.replace(/[\n\t]/g, " ")); // new lines and tabs
};

export const removeHtmlEntities = (text: string) => {
  return text.replace(/(?:&#x[a-f0-9]{2};|&#[0-9]+;)/g, " ");
};

export function getLast30DaysLabels(locale = "en-US"): string[] {
  const labels: string[] = [];
  const today = new Date();

  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);

    // e.g. "Jan"
    const month = d.toLocaleString(locale, { month: "short" });
    // day of month, no leading zero: "1", "31", etc.
    const day = d.getDate();

    labels.push(`${month}, ${day}`);
  }

  return labels;
}

export function humanizeNumber(value: number, precision = 1): string {
  if (value === 0) return "0";
  const suffixes = [
    "",
    " thousand",
    " million",
    " billion",
    " trillion",
    " quadrillion",
  ];
  const abs = Math.abs(value);
  const tier = Math.floor(Math.log10(abs) / 3);

  // if in the ones (no suffix)
  if (tier === 0) {
    return value.toString();
  }

  const scale = 10 ** (tier * 3);
  const scaled = value / scale;
  // format to `precision` decimals, then drop any trailing “.0”
  const formatted = scaled.toFixed(precision).replace(/\.0+$/, "");

  return `${formatted}${suffixes[tier]}`;
}
