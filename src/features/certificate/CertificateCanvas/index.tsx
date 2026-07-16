"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { useElementSize } from "@mantine/hooks";
import QRCode from "react-qr-code";
import type {
  CertificateElement,
  PublicCertificateData,
} from "@/types/model/certificate";
import { resolvePublicCertificateText } from "../utils/certificateData";
import classes from "./index.module.css";

type CertificateCanvasProps = {
  data: PublicCertificateData;
  imageBaseUrl: string;
  verificationUrl: string;
};

function resolveAssetUrl(
  value: string | null | undefined,
  baseUrl: string,
): string | null {
  if (!value) return null;
  if (/^https?:/i.test(value) || /^blob:/i.test(value)) return value;
  if (/^data:image\//i.test(value)) return value;
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith("//")) {
    return null;
  }
  if (!baseUrl) return value;

  return `${baseUrl.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

function getJustifyContent(
  align?: CertificateElement["textAlign"],
): CSSProperties["justifyContent"] {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
}

function getAlignItems(
  align?: CertificateElement["verticalAlign"],
): CSSProperties["alignItems"] {
  if (align === "top") return "flex-start";
  if (align === "bottom") return "flex-end";
  return "center";
}

function CertificateElementRenderer({
  data,
  element,
  imageBaseUrl,
  verificationUrl,
}: {
  data: PublicCertificateData;
  element: CertificateElement;
  imageBaseUrl: string;
  verificationUrl: string;
}): ReactNode {
  if (element.visible === false) return null;

  const isText =
    element.type === "static-text" || element.type === "variable-text";
  const textStyle: CSSProperties = {
    alignItems: getAlignItems(element.verticalAlign),
    color: element.color ?? "#000000",
    display: "flex",
    fontFamily: element.fontFamily ?? "sans-serif",
    fontSize: element.fontSize ?? 16,
    fontStyle: element.fontStyle ?? "normal",
    fontWeight: element.fontWeight ?? "normal",
    height: "100%",
    justifyContent: getJustifyContent(element.textAlign),
    letterSpacing: element.letterSpacing ?? 0,
    lineHeight: element.lineHeight ?? 1.4,
    margin: 0,
    textAlign: element.textAlign ?? "center",
    textDecoration: element.textDecoration ?? "none",
    whiteSpace: "pre-wrap",
    width: "100%",
    wordBreak: "break-word",
  };

  function renderContent(): ReactNode {
    if (isText) {
      return (
        <div style={textStyle}>
          {resolvePublicCertificateText(element, data)}
        </div>
      );
    }

    if (element.type === "qr-code") {
      const qrSize = Math.max(32, Math.min(element.width, element.height) - 8);
      return (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <QRCode value={verificationUrl} size={qrSize} />
        </div>
      );
    }

    if (element.type === "image" || element.type === "signature") {
      const imageUrl = resolveAssetUrl(element.imageUrl, imageBaseUrl);
      if (!imageUrl) return null;

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          crossOrigin="anonymous"
          draggable={false}
          src={imageUrl}
          style={{
            borderRadius: element.borderRadius ?? 0,
            height: "100%",
            objectFit: element.objectFit ?? "contain",
            width: "100%",
          }}
        />
      );
    }

    return null;
  }

  return (
    <div
      data-certificate-text-element={isText ? "true" : undefined}
      style={{
        borderRadius: element.borderRadius ?? 0,
        boxSizing: "border-box",
        height: element.height,
        left: element.x,
        opacity: (element.opacity ?? 100) / 100,
        overflow: "hidden",
        padding: 4,
        position: "absolute",
        top: element.y,
        transform: `rotate(${element.rotation ?? 0}deg)`,
        transformOrigin: "center center",
        width: element.width,
      }}
    >
      {renderContent()}
    </div>
  );
}

const CertificateCanvas = forwardRef<HTMLDivElement, CertificateCanvasProps>(
  function CertificateCanvas(
    { data, imageBaseUrl, verificationUrl },
    forwardedRef,
  ) {
    const { ref: viewportRef, width: viewportWidth } =
      useElementSize<HTMLDivElement>();
    const { canvasHeight, canvasWidth } = data.template.template_data;
    const availableWidth = viewportWidth;
    const scale = viewportWidth ? Math.min(1, availableWidth / canvasWidth) : 0;
    const renderedWidth = canvasWidth * scale;
    const backgroundImage = resolveAssetUrl(
      data.template.background_image ??
        data.template.template_data.backgroundUrl,
      imageBaseUrl,
    );

    return (
      <div aria-hidden="true" className={classes.frame}>
        <div
          className={classes.viewport}
          ref={viewportRef}
          style={{ height: canvasHeight * scale }}
        >
          <div
            className={classes.scaleLayer}
            style={{
              left: Math.max(0, (availableWidth - renderedWidth) / 2),
              opacity: viewportWidth ? 1 : 0,
              transform: `scale(${scale})`,
            }}
          >
            <div
              className={classes.canvas}
              data-certificate-content
              ref={forwardedRef}
              style={{
                backgroundImage: backgroundImage
                  ? `url(${JSON.stringify(backgroundImage)})`
                  : undefined,
                height: canvasHeight,
                width: canvasWidth,
              }}
            >
              {data.template.template_data.elements.map((element) => (
                <CertificateElementRenderer
                  data={data}
                  element={element}
                  imageBaseUrl={imageBaseUrl}
                  key={element.id}
                  verificationUrl={verificationUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CertificateCanvas.displayName = "CertificateCanvas";

export default CertificateCanvas;
