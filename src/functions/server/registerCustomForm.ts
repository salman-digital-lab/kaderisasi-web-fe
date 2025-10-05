"use server";

import { handleCatchError } from "../common/handler";
import { registerWithCustomForm } from "../../services/customForm";
import { PostCustomFormRegistrationReq } from "../../types/api/customForm";
import { verifySession } from "./session";

export default async function registerCustomForm(data: PostCustomFormRegistrationReq) {
  const { session } = await verifySession();

  try {
    const response = await registerWithCustomForm(session || "", data);
    return response;
  } catch (error: unknown) {
    handleCatchError(error);
  }
}

