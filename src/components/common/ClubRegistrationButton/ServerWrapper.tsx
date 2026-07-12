"use client";

import { useRouter } from "next/navigation";
import ClubRegistrationButton from "./index";
import type { CustomForm } from "@/types/api/customForm";

interface ClubRegistrationButtonServerWrapperProps {
  clubId: number;
  clubName: string;
  isAuthenticated: boolean;
  isRegistrationOpen?: boolean;
  customForm?: CustomForm;
}

/**
 * Server-safe wrapper for ClubRegistrationButton that handles login redirection
 * without requiring event handlers to be passed from Server Components.
 */
const ClubRegistrationButtonServerWrapper: React.FC<ClubRegistrationButtonServerWrapperProps> = ({
  clubId,
  clubName,
  isAuthenticated,
  isRegistrationOpen,
  customForm,
}) => {
  const router = useRouter();

  const handleLoginRequired = () => {
    router.push('/login');
  };

  return (
    <ClubRegistrationButton
      clubId={clubId}
      clubName={clubName}
      isAuthenticated={isAuthenticated}
      onLoginRequired={handleLoginRequired}
      isRegistrationOpen={isRegistrationOpen ?? false}
      customForm={customForm}
    />
  );
};

export default ClubRegistrationButtonServerWrapper;
