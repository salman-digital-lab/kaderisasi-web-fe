import type { CertificateData } from "@/types/model/certificate";
import { createElement, createRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import CertificateCanvas from "../CertificateCanvas";
import { CertificateScoreSheet } from "../CertificateScoreSheet";
import {
  getCertificateFilename,
  resolveOwnerCertificateText,
} from "./certificateData";
import { saveCertificatePdf } from "./certificatePdf";

export async function saveOwnerCertificatePdf(
  data: CertificateData,
  imageBaseUrl: string,
  verificationUrl: string,
  onProgress: (stage: string) => void,
): Promise<void> {
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-20000px;top:0;width:${data.template.template_data.canvasWidth}px`;
  document.body.appendChild(container);
  const root = createRoot(container);
  const ref = createRef<HTMLDivElement>();
  const scoreRef = createRef<HTMLDivElement>();
  try {
    flushSync(() =>
      root.render(
        createElement(
          "div",
          null,
          createElement(CertificateCanvas, {
            ref,
            data: { ...data, state: "issued_active" },
            imageBaseUrl,
            verificationUrl,
          }),
          createElement(CertificateScoreSheet, {
            ref: scoreRef,
            participant: data.participant,
            certificateCode: data.certificate.certificate_code,
          }),
        ),
      ),
    );
    if (!ref.current) throw new Error("CERTIFICATE_RENDER_FAILED");
    await saveCertificatePdf({
      template: data.template.template_data,
      sourceElement: ref.current,
      scoreSourceElement: scoreRef.current,
      resolveText: (element) => resolveOwnerCertificateText(element, data),
      filename: getCertificateFilename(data.participant.name),
      onProgress,
    });
  } finally {
    root.unmount();
    container.remove();
  }
}
