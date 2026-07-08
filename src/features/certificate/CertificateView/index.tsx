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
  Alert,
} from "@mantine/core";
import { IconArrowLeft, IconDownload, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useState, useRef } from "react";
import type { CertificateData, CertificateElement } from "@/types/model/certificate";
import { saveCertificatePdf } from "../utils/certificatePdf";

type CertificateViewProps = {
  data: CertificateData;
  imageBaseUrl: string;
  appUrl: string;
  isLoggedIn: boolean;
};

function resolveVariable(
  variable: string | undefined,
  participant: CertificateData["participant"],
  certificate?: CertificateData["certificate"],
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
    case "date":
      return participant.activity_date;
    case "registration_id":
      return String(participant.registration_id);
    case "user_id":
      return String(participant.user_id);
    case "certificate_id":
    case "certificate_code":
      return certificate?.certificate_code || "";
    default:
      return "";
  }
}

function getJustifyContent(align?: CertificateElement["textAlign"]): string {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
}

function getAlignItems(align?: CertificateElement["verticalAlign"]): string {
  if (align === "top") return "flex-start";
  if (align === "bottom") return "flex-end";
  return "center";
}

function CertificateElementRenderer({
  element,
  participant,
  certificate,
  certificateUrl,
}: {
  element: CertificateElement;
  participant: CertificateData["participant"];
  certificate?: CertificateData["certificate"];
  certificateUrl: string;
}) {
  const isTextType =
    element.type === "static-text" || element.type === "variable-text";

  const textStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: getAlignItems(element.verticalAlign),
    justifyContent: getJustifyContent(element.textAlign),
    fontSize: element.fontSize || 16,
    fontFamily: element.fontFamily || "sans-serif",
    fontWeight: element.fontWeight || "normal",
    fontStyle: element.fontStyle || "normal",
    textDecoration: element.textDecoration || "none",
    color: element.color || "#000000",
    textAlign: element.textAlign || "center",
    margin: 0,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    lineHeight: element.lineHeight || 1.4,
    letterSpacing: element.letterSpacing || 0,
  };

  const renderContent = () => {
    switch (element.type) {
      case "static-text":
        return <div style={textStyle}>{element.content || ""}</div>;
      case "variable-text":
        return (
          <div style={textStyle}>
            {resolveVariable(element.variable, participant, certificate)}
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={element.imageUrl}
              alt={element.type}
              style={{
                width: "100%",
                height: "100%",
                objectFit: element.objectFit || "contain",
                borderRadius: element.borderRadius || 0,
              }}
              draggable={false}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  if (element.visible === false) return null;

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
        opacity: (element.opacity ?? 100) / 100,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: "center center",
        borderRadius: element.borderRadius || 0,
        overflow: "hidden",
      }}
      data-certificate-text-element={isTextType ? "true" : undefined}
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
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { template, participant, activity } = data;
  const { template_data, background_image } = template;
  const certificateCode = data.certificate?.certificate_code;
  const isRevoked = !!data.certificate?.revoked_at;

  const backgroundImageUrl = background_image
    ? `${imageBaseUrl}/${background_image}`
    : null;

  const certificatePath = `/certificate/${certificateCode || participant.registration_id}`;
  const certificateUrl = `${appUrl}${certificatePath}`;
  const loginRedirect = `/login?redirect=${encodeURIComponent(certificatePath)}`;

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);
    try {
      await saveCertificatePdf({
        template: template_data,
        sourceElement: certificateRef.current,
        filename: `sertifikat-${participant.name.replace(/\s+/g, "-")}.pdf`,
        resolveText: (element) =>
          element.type === "variable-text"
            ? resolveVariable(element.variable, participant, data.certificate)
            : element.content || "",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!template_data || !template_data.elements) {
    return (
      <Container size="lg" py="xl">
        <Paper withBorder p="md" radius="md">
          <Text c="red">Template sertifikat tidak tersedia</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <style>{`
        .certificate-content {
          font-smooth: always;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-rendering: optimizeLegibility;
        }
        .certificate-content * {
          font-smooth: always;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-rendering: optimizeLegibility;
        }
      `}</style>
      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Header actions */}
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            {isLoggedIn ? (
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleDownloadPdf}
                loading={isDownloading}
                disabled={isRevoked}
              >
                Unduh PDF
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
          <Paper withBorder p="md" radius="sm">
            <Stack gap="xs">
              {isRevoked && (
                <Alert color="red" title="Sertifikat tidak valid">
                  Sertifikat ini telah dicabut.
                </Alert>
              )}
              <Title order={3}>{activity.name}</Title>
              <Text c="dimmed">
                Sertifikat atas nama:{" "}
                <Text component="span" fw={600} c="dark">
                  {participant.name}
                </Text>
              </Text>
              <Text size="md" c="dimmed">
                Tanggal kegiatan: {participant.activity_date}
              </Text>
              {certificateCode && (
                <Text size="md" c="dimmed">
                  Kode sertifikat:{" "}
                  <Text component="span" fw={600} c="dark">
                    {certificateCode}
                  </Text>
                </Text>
              )}
            </Stack>
          </Paper>

          {/* Certificate canvas - flatter design with small border */}
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              overflowX: "auto",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              ref={certificateRef}
              data-certificate-content
              className="certificate-content"
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
                border: "1px solid #e0e0e0",
                overflow: "hidden",
              }}
            >
              {template_data.elements.map((element) => (
                <CertificateElementRenderer
                  key={element.id}
                  element={element}
                  participant={participant}
                  certificate={data.certificate}
                  certificateUrl={certificateUrl}
                />
              ))}
            </div>
          </Box>

          {/* Download hint */}
          <Text size="md" c="dimmed" ta="center">
            {isLoggedIn
              ? 'Klik "Unduh PDF" untuk menyimpan sertifikat.'
              : "Masuk ke akun Anda untuk mengunduh sertifikat ini."}
          </Text>
        </Stack>
      </Container>
    </>
  );
}
