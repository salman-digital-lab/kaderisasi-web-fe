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
import { IconArrowLeft, IconDownload, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useState, useRef } from "react";
import { CertificateData, CertificateElement } from "@/types/model/certificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { template, participant, activity } = data;
  const { template_data, background_image } = template;

  const backgroundImageUrl = background_image
    ? `${imageBaseUrl}/${background_image}`
    : null;

  const certificateUrl = `${appUrl}/certificate/${participant.registration_id}`;
  const loginRedirect = `/login?redirect=/certificate/${participant.registration_id}`;

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate-content]') as HTMLElement;
          if (clonedElement) {
            (clonedElement.style as any).fontSmooth = "always";
            (clonedElement.style as any).webkitFontSmoothing = "antialiased";
            (clonedElement.style as any).mozFontSmoothing = "grayscale";
            (clonedElement.style as any).fontRendering = "optimizeLegibility";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: template_data.canvasWidth > template_data.canvasHeight ? "landscape" : "portrait",
        unit: "px",
        format: [template_data.canvasWidth, template_data.canvasHeight],
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "PNG", 0, 0, template_data.canvasWidth, template_data.canvasHeight, undefined, "FAST");
      pdf.save(`sertifikat-${participant.name.replace(/\s+/g, "-")}.pdf`);
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
                  certificateUrl={certificateUrl}
                />
              ))}
            </div>
          </Box>

          {/* Download hint */}
          <Text size="sm" c="dimmed" ta="center">
            {isLoggedIn
              ? 'Klik "Unduh PDF" untuk menyimpan sertifikat.'
              : "Masuk ke akun Anda untuk mengunduh sertifikat ini."}
          </Text>
        </Stack>
      </Container>
    </>
  );
}
