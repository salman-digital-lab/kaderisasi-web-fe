"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import {
  cancelClubRegistration,
  checkClubRegistrationStatus,
} from "@/functions/server/clubRegistration";
import { getRegistrationPresentation } from "@/features/clubs/registration-state";
import type { CustomForm } from "@/types/api/customForm";
import type { ClubRegistrationStatus } from "@/types/model/clubRegistration";

type StatusCheckState = "loading" | "loaded" | "error" | "unauthenticated";

interface ClubRegistrationButtonProps {
  clubId: number;
  clubName: string;
  isAuthenticated: boolean;
  isRegistrationOpen: boolean;
  customForm?: CustomForm;
  customFormError?: boolean;
}

export default function ClubRegistrationButton({
  clubId,
  clubName,
  isAuthenticated,
  isRegistrationOpen,
  customForm,
  customFormError = false,
}: ClubRegistrationButtonProps) {
  const [registrationStatus, setRegistrationStatus] =
    useState<ClubRegistrationStatus | null>(null);
  const [checkState, setCheckState] = useState<StatusCheckState>(
    isAuthenticated ? "loading" : "unauthenticated",
  );
  const [checkError, setCheckError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const loginHref = `/login?redirect=${encodeURIComponent(`/clubs/${clubId}`)}`;

  const checkRegistration = useCallback(async () => {
    if (!isAuthenticated) {
      setCheckState("unauthenticated");
      return;
    }

    setCheckState("loading");
    setCheckError("");
    const result = await checkClubRegistrationStatus(clubId);

    if (result.success) {
      setRegistrationStatus(result.data);
      setCheckState("loaded");
      return;
    }

    setRegistrationStatus(null);
    setCheckError(result.message);
    setCheckState(
      result.reason === "UNAUTHENTICATED" ? "unauthenticated" : "error",
    );
  }, [clubId, isAuthenticated]);

  useEffect(() => {
    void checkRegistration();
  }, [checkRegistration]);

  const handleCancel = async () => {
    setIsCancelling(true);
    setShowCancelModal(false);
    const result = await cancelClubRegistration(clubId);

    if (!result.success) {
      notifications.show({
        title: "Pembatalan gagal",
        message: result.message,
        color: "red",
      });
      setIsCancelling(false);

      if (result.reason === "UNAUTHENTICATED") {
        setCheckError(result.message);
        setCheckState("unauthenticated");
      }
      return;
    }

    notifications.show({
      title: "Pendaftaran dibatalkan",
      message: result.message,
      color: "blue",
    });
    setIsCancelling(false);
    await checkRegistration();
  };

  if (checkState === "loading") {
    return (
      <Group justify="center" gap="sm" aria-live="polite">
        <Loader size="md" />
        <Text size="md" c="dimmed">
          Memeriksa status pendaftaran...
        </Text>
      </Group>
    );
  }

  if (checkState === "error") {
    return (
      <Alert
        color="red"
        title="Status belum dapat diperiksa"
        icon={<IconAlertCircle size={20} aria-hidden="true" />}
      >
        <Stack gap="sm">
          <Text size="md">{checkError}</Text>
          <Button variant="light" color="red" onClick={checkRegistration}>
            Coba lagi
          </Button>
        </Stack>
      </Alert>
    );
  }

  if (registrationStatus?.isRegistered && registrationStatus.registration) {
    const registration = registrationStatus.registration;
    const presentation = getRegistrationPresentation(registration.status);
    const canCancel = registration.status === "PENDING";
    const StatusIcon =
      registration.status === "PENDING"
        ? IconClock
        : registration.status === "APPROVED"
          ? IconCheck
          : IconX;

    return (
      <>
        <Stack
          gap="md"
          p="md"
          style={{
            backgroundColor: `var(--mantine-color-${presentation.color}-0)`,
            border: `2px solid var(--mantine-color-${presentation.color}-4)`,
            borderRadius: "var(--mantine-radius-md)",
          }}
          aria-live="polite"
        >
          <Group justify="space-between" align="start" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" align="start">
              <StatusIcon
                size={20}
                color={`var(--mantine-color-${presentation.color}-6)`}
                aria-hidden="true"
              />
              <Text fw={600}>{presentation.title}</Text>
            </Group>
            <Badge color={presentation.color} variant="light">
              {presentation.badgeLabel}
            </Badge>
          </Group>

          <Text size="md">{presentation.description}</Text>
          <Text size="md" c="dimmed">
            Dikirim pada{" "}
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "long",
            }).format(new Date(registration.created_at))}
          </Text>

          {canCancel && (
            <Button
              color="red"
              variant="light"
              onClick={() => setShowCancelModal(true)}
              loading={isCancelling}
              leftSection={<IconX size={16} aria-hidden="true" />}
            >
              Batalkan pendaftaran
            </Button>
          )}
        </Stack>

        <Modal
          opened={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Batalkan pendaftaran"
          centered
        >
          <Stack gap="md">
            <Text>
              Yakin ingin membatalkan pendaftaran untuk{" "}
              <strong>{clubName}</strong>?
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                onClick={() => setShowCancelModal(false)}
              >
                Pertahankan
              </Button>
              <Button color="red" onClick={handleCancel} loading={isCancelling}>
                Ya, batalkan
              </Button>
            </Group>
          </Stack>
        </Modal>
      </>
    );
  }

  if (checkState === "unauthenticated") {
    return (
      <Stack gap="sm">
        {!isRegistrationOpen && (
          <Alert color="gray" title="Pendaftaran telah ditutup">
            Masuk untuk melihat status pendaftaran Anda.
          </Alert>
        )}
        {checkError && (
          <Alert color="yellow" title="Sesi berakhir">
            {checkError}
          </Alert>
        )}
        <Button
          component={Link}
          href={loginHref}
          size="lg"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          fullWidth
        >
          {isRegistrationOpen
            ? "Masuk untuk mendaftar"
            : "Masuk untuk melihat status"}
        </Button>
      </Stack>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <Alert color="gray" title="Pendaftaran telah ditutup">
        Belum ada pendaftaran untuk akun Anda pada klub ini.
      </Alert>
    );
  }

  if (customFormError) {
    return (
      <Alert color="red" title="Form pendaftaran belum dapat dimuat">
        Silakan muat ulang halaman atau coba lagi beberapa saat lagi.
      </Alert>
    );
  }

  if (!customForm?.is_active) {
    return (
      <Alert color="yellow" title="Form pendaftaran belum tersedia">
        Pendaftaran belum dapat dilakukan. Silakan coba kembali nanti.
      </Alert>
    );
  }

  return (
    <Button
      component={Link}
      href={`/custom-form/club/${clubId}`}
      size="lg"
      variant="gradient"
      gradient={{ from: "blue", to: "cyan" }}
      fullWidth
    >
      Daftar untuk {clubName}
    </Button>
  );
}
