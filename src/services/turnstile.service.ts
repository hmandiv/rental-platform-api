import { env } from "../config/env";
import { AppError } from "../utils/appError";

type TurnstileSiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
};

export const verifyTurnstileToken = async (
  token: string,
  remoteIp?: string,
): Promise<void> => {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    throw new AppError("Spam protection check is required", 400);
  }

  const formData = new URLSearchParams();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", trimmedToken);

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new AppError("Spam protection check could not be verified", 502);
  }

  const result = (await response.json()) as TurnstileSiteverifyResponse;

  if (!result.success) {
    console.warn("Turnstile verification failed", result["error-codes"]);

    throw new AppError(
      "Spam protection check failed. Please refresh and try again.",
      400,
    );
  }
};
