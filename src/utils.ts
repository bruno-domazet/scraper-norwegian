import fetch from "node-fetch";
import { RequestInfo, RequestInit, Response } from "node-fetch";
export async function http(
  request: RequestInfo,
  info?: RequestInit
): Promise<string> {
  const response: Response = await fetch(request, info);
  console.log("response", response);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.text();
}
