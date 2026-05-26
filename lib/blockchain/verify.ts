import { verifyMessage, verifyTypedData } from "ethers";

export async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string,
): Promise<boolean> {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}

export async function verifyTypedDataSignature(
  domain: Record<string, unknown>,
  types: Record<string, unknown>,
  value: Record<string, unknown>,
  signature: string,
  expectedAddress: string,
): Promise<boolean> {
  try {
    const recoveredAddress = verifyTypedData(domain, types, value, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}
