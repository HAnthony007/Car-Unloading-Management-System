export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

export function isValidVin(vin: string): boolean {
    return VIN_REGEX.test(vin.trim());
}
