"use client";

import React, { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { Button, Stack, Text, Group, Loader, Alert } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { registerToClub, getRegistrationStatus } from "@/services/clubRegistration";
import { ClubRegistrationStatus } from "@/types/model/clubRegistration";
import { useRouter } from "next/navigation";

interface ClubRegistrationFormProps {
  clubId: number;
  clubName: string;
  isAuthenticated: boolean;
  afterRegistrationInfo?: string;
}

const ClubRegistrationForm: React.FC<ClubRegistrationFormProps> = ({
  clubId,
  clubName,
  isAuthenticated,
  afterRegistrationInfo,
}) => {
  const [registrationStatus, setRegistrationStatus] = useState<ClubRegistrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
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

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      await registerToClub(clubId, {});
      notifications.show({
        title: "Pendaftaran Berhasil",
        message: `Berhasil mendaftar untuk ${clubName}!`,
        color: "green",
      });
      await checkRegistrationStatus();
    } catch (error: any) {
      const message = error.response?.data?.message || "Pendaftaran gagal";
      if (message === "ALREADY_REGISTERED") {
        notifications.show({
          title: "Sudah Terdaftar",
          message: "Anda sudah terdaftar untuk klub ini",
          color: "orange",
        });
      } else {
        notifications.show({
          title: "Pendaftaran Gagal",
          message: message,
          color: "red",
        });
      }
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
      <Text size="sm" c={config.color} fw={600}>
        Status: {config.label}
      </Text>
    );
  };

  if (!isAuthenticated) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="Login Diperlukan" 
        color="blue"
        variant="light"
      >
        <Text size="sm" mb="md">
          Anda harus login terlebih dahulu untuk mendaftar ke klub ini.
        </Text>
        <Button 
          component="a"
          href="/login"
          variant="filled"
          color="blue"
          fullWidth
        >
          Login Sekarang
        </Button>
      </Alert>
    );
  }

  if (isCheckingStatus) {
    return (
      <Group justify="center" gap="sm">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">Memeriksa status pendaftaran...</Text>
      </Group>
    );
  }

  if (registrationStatus?.isRegistered) {
    const registration = registrationStatus.registration!;

    return (
      <Stack gap="md" p="md" style={{ 
        backgroundColor: 'var(--mantine-color-green-0)', 
        border: '2px solid var(--mantine-color-green-4)',
        borderRadius: 'var(--mantine-radius-md)'
      }}>
        <Group gap="xs" align="center">
          <IconCheck size={20} color="var(--mantine-color-green-6)" />
          <Text fw={600} c="green.8">
            Terdaftar untuk {clubName}
          </Text>
        </Group>
        
        {getStatusBadge()}
        
        <Text size="xs" c="dimmed">
          Terdaftar pada: {new Date(registration.created_at).toLocaleDateString('id-ID')}
        </Text>

        {afterRegistrationInfo && (
          <Alert 
            icon={<IconCheck size={16} />} 
            title="Informasi Setelah Pendaftaran" 
            color="blue"
            variant="light"
            mt="sm"
          >
            <div
              dangerouslySetInnerHTML={{ __html: afterRegistrationInfo }}
              style={{
                fontSize: 'var(--mantine-font-size-sm)',
                lineHeight: 1.5,
              }}
            />
          </Alert>
        )}

        <Button
          component="a"
          href={`/clubs/${clubId}`}
          variant="light"
          color="blue"
          fullWidth
        >
          Kembali ke Detail Klub
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed" ta="center">
        Klik tombol di bawah ini untuk mendaftar ke {clubName}
      </Text>
      
      {afterRegistrationInfo && (
        <Alert 
          icon={<IconCheck size={16} />} 
          title="Informasi Setelah Pendaftaran" 
          color="blue"
          variant="light"
        >
          <div
            dangerouslySetInnerHTML={{ __html: afterRegistrationInfo }}
            style={{
              fontSize: 'var(--mantine-font-size-sm)',
              lineHeight: 1.5,
            }}
          />
        </Alert>
      )}
      
      <Button
        size="lg"
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan' }}
        onClick={handleRegister}
        loading={isLoading}
        fullWidth
      >
        Daftar untuk {clubName}
      </Button>
    </Stack>
  );
};

export default ClubRegistrationForm;
