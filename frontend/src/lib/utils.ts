import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get the current protocol (http or https)
export const getCurrentProtocol = (): string => {
  return window.location.protocol;
};

// Utility function to construct the base URL with dynamic protocol
export const getBaseUrl = (hostname: string): string => {
  if (!hostname) return "";
  console.log(`getBaseUrl: ${getCurrentProtocol()}://${hostname}`)
  return `${getCurrentProtocol()}://${hostname}`;
};

// Utility function to get the current hostname
export const getCurrentHostname = (): string => {
  return window.location.hostname;
};

// Utility function to get the current port if it's not the default
export const getCurrentPort = (): string => {
  const port = window.location.port;
  return port ? `:${port}` : "";
};

// Utility function to construct full URL with dynamic protocol and port
export const getFullBaseUrl = (hostname: string): string => {
  if (!hostname) return "";
  const protocol = getCurrentProtocol();
  const port = getCurrentPort();
  console.log(`getFullBaseUrl: ${protocol}://${hostname}${port}`)
  return `${protocol}://${hostname}${port}`;
};
