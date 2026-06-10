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

interface TypedDomain {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
}

interface TypedTypes {
  [key: string]: Array<{ name: string; type: string }>;
}

interface TypedValue {
  [key: string]: string | number | bigint;
}

export async function verifyTypedDataSignature(
  domain: TypedDomain,
  types: TypedTypes,
  value: TypedValue,
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
