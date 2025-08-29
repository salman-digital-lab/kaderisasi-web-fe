"use client";

import React, { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Badge,
  Stack,
  Text,
  Group,
  Loader,
  Modal,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  getRegistrationStatus,
  cancelMyRegistration,
  registerToClub,
} from "@/services/clubRegistration";
import { ClubRegistrationStatus } from "@/types/model/clubRegistration";
import { useRouter } from "next/navigation";

interface ClubRegistrationButtonProps {
  clubId: number;
  clubName: string;
  isAuthenticated: boolean;
  onLoginRequired?: () => void;
  afterRegistrationInfo?: string;
  isRegistrationOpen: boolean;
  customForm?: any;
}

const ClubRegistrationButton: React.FC<ClubRegistrationButtonProps> = ({
  clubId,
  clubName,
  isAuthenticated,
  onLoginRequired,
  afterRegistrationInfo,
  isRegistrationOpen,
  customForm,
}) => {
  const [registrationStatus, setRegistrationStatus] =
    useState<ClubRegistrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const checkRegistrationStatus = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsCheckingStatus(true);
    try {
      const response = await getRegistrationStatus(clubId);
      setRegistrationStatus(response.data);
    } catch (error) {
      console.error("Error checking registration status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [clubId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      checkRegistrationStatus();
    }
  }, [isAuthenticated, checkRegistrationStatus]);

  // If registration is not open, don't show anything
  if (isRegistrationOpen === false) {
    return null;
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    // If custom form exists, redirect to custom form page
    if (customForm) {
      router.push(`/custom-form/register/club_registration/${clubId}/profile-data`);
      return;
    }

    // Otherwise, directly register to club
    setIsLoading(true);
    try {
      await registerToClub(clubId);
      notifications.show({
        title: "Pendaftaran Berhasil",
        message: `Berhasil mendaftar ke ${clubName}`,
        color: "green",
      });
      // Refresh registration status
      await checkRegistrationStatus();
    } catch (error: any) {
      const message = error.response?.data?.message || "Gagal mendaftar ke klub";
      notifications.show({
        title: "Pendaftaran Gagal",
        message: message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setShowDeleteModal(false);
    try {
      await cancelMyRegistration(clubId);
      notifications.show({
        title: "Pendaftaran Dihapus",
        message: "Pendaftaran berhasil dihapus",
        color: "blue",
      });
      await checkRegistrationStatus();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Gagal menghapus pendaftaran";
      notifications.show({
        title: "Penghapusan Gagal",
        message: message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!registrationStatus?.registration) return null;

    const status = registrationStatus.registration.status;
    const statusConfig = {
      PENDING: { label: "Menunggu", color: "orange" },
      APPROVED: { label: "Disetujui", color: "green" },
      REJECTED: { label: "Ditolak", color: "red" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Badge color={config.color} variant="light">
        {config.label}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <Button
        size="lg"
        variant="gradient"
        gradient={{ from: "blue", to: "cyan" }}
        onClick={onLoginRequired}
        fullWidth
      >
        Login untuk Mendaftar
      </Button>
    );
  }

  if (isCheckingStatus) {
    return (
      <Group justify="center" gap="sm">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          Memeriksa status pendaftaran...
        </Text>
      </Group>
    );
  }

  if (registrationStatus?.isRegistered) {
    const registration = registrationStatus.registration!;
    // Only allow deletion for PENDING status, not for APPROVED status
    const canDelete = registration.status === "PENDING";

    return (
      <>
        <Stack
          gap="md"
          p="md"
          style={{
            backgroundColor: "var(--mantine-color-green-0)",
            border: "2px solid var(--mantine-color-green-4)",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconCheck size={20} color="var(--mantine-color-green-6)" />
              <Text fw={600} c="green.8">
                Terdaftar untuk {clubName}
              </Text>
            </Group>
            {getStatusBadge()}
          </Group>

          {canDelete && (
            <Button
              color="red"
              variant="light"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              loading={isLoading}
              leftSection={<IconX size={16} />}
            >
              Hapus Pendaftaran
            </Button>
          )}

          <Text size="xs" c="dimmed">
            Terdaftar pada:{" "}
            {new Date(registration.created_at).toLocaleDateString("id-ID")}
          </Text>

          {afterRegistrationInfo && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "var(--mantine-color-blue-0)",
                border: "1px solid var(--mantine-color-blue-3)",
                borderRadius: "var(--mantine-radius-sm)",
              }}
            >
              <Text size="sm" c="blue.8" fw={500} mb="xs">
                Informasi Setelah Pendaftaran:
              </Text>
              <div
                dangerouslySetInnerHTML={{ __html: afterRegistrationInfo }}
                style={{
                  fontSize: "var(--mantine-font-size-sm)",
                  lineHeight: 1.5,
                }}
              />
            </div>
          )}
        </Stack>

        <Modal
          opened={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Hapus Pendaftaran"
          centered
        >
          <Stack gap="md">
            <Text>
              Apakah Anda yakin ingin menghapus pendaftaran untuk{" "}
              <strong>{clubName}</strong>?
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setShowDeleteModal(false)}>
                Pertahankan Pendaftaran
              </Button>
              <Button
                color="red"
                onClick={handleDeleteConfirm}
                loading={isLoading}
              >
                Hapus Pendaftaran
              </Button>
            </Group>
          </Stack>
        </Modal>
      </>
    );
  }

  return (
    <Button
      size="lg"
      variant="gradient"
      gradient={{ from: "blue", to: "cyan" }}
      onClick={handleRegister}
      loading={isLoading}
      fullWidth
    >
      Daftar untuk {clubName}
    </Button>
  );
};

export default ClubRegistrationButton;
