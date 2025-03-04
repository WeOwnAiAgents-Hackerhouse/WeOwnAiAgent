/**
 * Truncates an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @param startLength Number of characters to keep at the start
 * @param endLength Number of characters to keep at the end
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
} 