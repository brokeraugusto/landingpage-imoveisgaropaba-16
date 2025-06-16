
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

declare function gtag(...args: any[]): void;
declare function fbq(...args: any[]): void;

export {};
