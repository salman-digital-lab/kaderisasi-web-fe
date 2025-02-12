export function handleCatchError(error: unknown) {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something when wrong";
  }

  throw new Error(message);
}

export async function handleDownloadFile(fileUrl: string, filename: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${fileUrl}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    handleCatchError(error);
  }
}
