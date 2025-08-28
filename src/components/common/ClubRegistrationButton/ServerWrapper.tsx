"use client";

import { useRouter } from "next/navigation";
import ClubRegistrationButton from "./index";

interface ClubRegistrationButtonServerWrapperProps {
  clubId: number;
  clubName: string;
  isAuthenticated: boolean;
  afterRegistrationInfo?: string;
  isRegistrationOpen?: boolean;
}

/**
 * Server-safe wrapper for ClubRegistrationButton that handles login redirection
 * without requiring event handlers to be passed from Server Components.
 */
const ClubRegistrationButtonServerWrapper: React.FC<ClubRegistrationButtonServerWrapperProps> = ({
  clubId,
  clubName,
  isAuthenticated,
  afterRegistrationInfo,
  isRegistrationOpen,
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
      afterRegistrationInfo={afterRegistrationInfo}
      isRegistrationOpen={isRegistrationOpen ?? false}
    />
  );
};

export default ClubRegistrationButtonServerWrapper;
