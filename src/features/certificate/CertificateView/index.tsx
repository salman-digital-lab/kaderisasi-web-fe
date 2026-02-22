"use client";

import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Box,
  Paper,
  Tooltip,
} from "@mantine/core";
import { IconArrowLeft, IconPrinter, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { CertificateData, CertificateElement } from "@/types/model/certificate";

type CertificateViewProps = {
  data: CertificateData;
  imageBaseUrl: string;
  appUrl: string;
  isLoggedIn: boolean;
};

function resolveVariable(
  variable: string | undefined,
  participant: CertificateData["participant"],
): string {
  const varName = variable?.replace(/\{\{|\}\}/g, "").trim() || "";
  switch (varName) {
    case "name":
      return participant.name;
    case "email":
      return participant.email;
    case "university":
      return participant.university;
    case "activity_name":
      return participant.activity_name;
    case "activity_date":
      return participant.activity_date;
    case "registration_id":
      return String(participant.registration_id);
    case "user_id":
      return String(participant.user_id);
    default:
      return "";
  }
}

function CertificateElementRenderer({
  element,
  participant,
  certificateUrl,
}: {
  element: CertificateElement;
  participant: CertificateData["participant"];
  certificateUrl: string;
}) {
  const isTextType =
    element.type === "static-text" || element.type === "variable-text";

  const textStyle: React.CSSProperties = {
    fontSize: element.fontSize || 16,
    fontFamily: element.fontFamily || "sans-serif",
    color: element.color || "#000000",
    textAlign: element.textAlign || "center",
    margin: 0,
    wordBreak: "break-word",
    lineHeight: 1.4,
  };

  const renderContent = () => {
    switch (element.type) {
      case "static-text":
        return <div style={textStyle}>{element.content || ""}</div>;
      case "variable-text":
        return (
          <div style={textStyle}>
            {resolveVariable(element.variable, participant)}
          </div>
        );
      case "qr-code": {
        const qrSize = Math.min(element.width, element.height) - 8;
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QRCode
              value={certificateUrl}
              size={qrSize > 0 ? qrSize : 64}
              style={{ display: "block" }}
            />
          </div>
        );
      }
      case "image":
      case "signature":
        if (element.imageUrl) {
          return (
            <img
              src={element.imageUrl}
              alt={element.type}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              draggable={false}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        ...(isTextType
          ? { minHeight: element.height }
          : { height: element.height }),
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      {renderContent()}
    </div>
  );
}

export default function CertificateView({
  data,
  imageBaseUrl,
  appUrl,
  isLoggedIn,
}: CertificateViewProps) {
  const router = useRouter();
  const { template, participant, activity } = data;
  const { template_data, background_image } = template;

  const backgroundImageUrl = background_image
    ? `${imageBaseUrl}/${background_image}`
    : null;

  const certificateUrl = `${appUrl}/certificate/${participant.registration_id}`;
  const loginRedirect = `/login?redirect=/certificate/${participant.registration_id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-printable,
          .certificate-printable * { visibility: visible; }
          .certificate-printable {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header actions */}
          <Group justify="space-between" className="no-print">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            {isLoggedIn ? (
              <Button
                leftSection={<IconPrinter size={16} />}
                onClick={handlePrint}
              >
                Cetak / Unduh
              </Button>
            ) : (
              <Tooltip label="Masuk terlebih dahulu untuk mengunduh sertifikat">
                <Link href={loginRedirect} style={{ textDecoration: "none" }}>
                  <Button leftSection={<IconLogin size={16} />} variant="light">
                    Masuk untuk Unduh
                  </Button>
                </Link>
              </Tooltip>
            )}
          </Group>

          {/* Certificate info */}
          <Paper withBorder p="md" radius="md" className="no-print">
            <Stack gap="xs">
              <Title order={3}>{activity.name}</Title>
              <Text c="dimmed">
                Sertifikat atas nama:{" "}
                <Text component="span" fw={600} c="dark">
                  {participant.name}
                </Text>
              </Text>
              <Text size="sm" c="dimmed">
                Tanggal kegiatan: {participant.activity_date}
              </Text>
            </Stack>
          </Paper>

          {/* Certificate canvas */}
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
            }}
          >
            <div
              className="certificate-printable"
              style={{
                position: "relative",
                width: template_data.canvasWidth,
                height: template_data.canvasHeight,
                minWidth: template_data.canvasWidth,
                backgroundColor: "#ffffff",
                backgroundImage: backgroundImageUrl
                  ? `url(${backgroundImageUrl})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                overflow: "hidden",
              }}
            >
              {template_data.elements.map((element) => (
                <CertificateElementRenderer
                  key={element.id}
                  element={element}
                  participant={participant}
                  certificateUrl={certificateUrl}
                />
              ))}
            </div>
          </Box>

          {/* Print hint */}
          <Text size="sm" c="dimmed" ta="center" className="no-print">
            {isLoggedIn
              ? 'Gunakan tombol "Cetak / Unduh" untuk menyimpan sertifikat sebagai PDF melalui dialog print browser Anda.'
              : "Masuk ke akun Anda untuk mengunduh atau mencetak sertifikat ini."}
          </Text>
        </Stack>
      </Container>
    </>
  );
}
