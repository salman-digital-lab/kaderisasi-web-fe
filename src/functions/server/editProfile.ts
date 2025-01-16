"use server";

import { handleCatchError } from "../common/handler";
import { putProfile } from "../../services/profile";
import { PutProfileReq } from "../../types/api/user";

import { verifySession } from "./session";

type LoginFormData = PutProfileReq;

export default async function editProfile(data: LoginFormData) {
  const formData = {
    ...data,
    province_id: data.province_id ? Number(data.province_id) : undefined,
  };

  const { session } = await verifySession();

  try {
    const response = await putProfile(session || "", formData);
    return response;
  } catch (error: unknown) {
    handleCatchError(error);
  }
}
