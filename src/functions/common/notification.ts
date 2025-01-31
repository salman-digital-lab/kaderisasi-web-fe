import { NOTIFICATION_TEXT_RENDER } from "@/constants/render/notification";
import { notifications } from "@mantine/notifications";

export default function showNotif(message: string, isError?: boolean, title?: string) {
  if (isError) {
    notifications.show({
      color: "red",
      title: title || "Gagal",
      message: NOTIFICATION_TEXT_RENDER[message] || message,
    });
  } else {
    notifications.show({
      title: title || "Sukses",
      message: NOTIFICATION_TEXT_RENDER[message] || message,
    });
  }
}
