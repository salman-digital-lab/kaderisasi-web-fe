"use client";

import { useEffect, useState, type ReactElement } from "react";
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Indicator,
  Loader,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { NotificationError, notificationRequest, type InboxPage } from "./api";

export default function NotificationBell(): ReactElement {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<InboxPage>();
  const [error, setError] = useState(false);
  const [expired, setExpired] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (expired) return;
    const controller = new AbortController();
    let busy = false;
    const refresh = async (): Promise<void> => {
      if (document.hidden || busy) return;
      busy = true;
      try {
        const count = await notificationRequest<{ unread: number }>(
          "/unread-count",
          "GET",
          undefined,
          controller.signal,
        );
        if (!controller.signal.aborted) setUnread(count.unread);
        if (open) {
          const result = await notificationRequest<InboxPage>(
            "",
            "GET",
            undefined,
            controller.signal,
          );
          if (!controller.signal.aborted) {
            setPage(result);
            setError(false);
          }
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(true);
          if (failure instanceof NotificationError && failure.status === 401) {
            setUnread(0);
            setPage(undefined);
            setExpired(true);
          }
        }
      } finally {
        busy = false;
      }
    };
    const listener = (): void => {
      void refresh();
    };
    listener();
    const timer = window.setInterval(listener, 30000);
    window.addEventListener("focus", listener);
    document.addEventListener("visibilitychange", listener);
    window.addEventListener("notifications-changed", listener);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", listener);
      document.removeEventListener("visibilitychange", listener);
      window.removeEventListener("notifications-changed", listener);
    };
  }, [open, retry, expired]);
  return (
    <Popover
      opened={open}
      onChange={setOpen}
      position="bottom-end"
      width="min(340px, calc(100vw - 32px))"
      trapFocus
      returnFocus
    >
      <Popover.Target>
        <Indicator
          label={unread > 99 ? "99+" : unread}
          disabled={unread === 0}
          size={18}
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            aria-label={`Notifikasi, ${unread} belum dibaca`}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <IconBell size={22} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <Text fw={600}>Notifikasi</Text>
          {expired ? (
            <Anchor href="/api/logout?redirect=%2Flogin%3Fredirect%3D%2Fnotifications">
              Masuk kembali untuk membaca notifikasi
            </Anchor>
          ) : error ? (
            <Alert color="red" title="Notifikasi belum dapat dimuat">
              <Button variant="subtle" onClick={() => setRetry((v) => v + 1)}>
                Coba lagi
              </Button>
            </Alert>
          ) : !page ? (
            <Loader size="sm" />
          ) : page.items.length === 0 ? (
            <Text c="dimmed">Belum ada notifikasi</Text>
          ) : (
            page.items.slice(0, 5).map((item) => (
              <Anchor
                key={item.id}
                component={Link}
                href={`/notifications?id=${item.id}`}
                fw={item.read_at ? 400 : 600}
                style={{ overflowWrap: "anywhere" }}
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Anchor>
            ))
          )}
          <Anchor
            component={Link}
            href="/notifications"
            onClick={() => setOpen(false)}
          >
            Lihat semua notifikasi
          </Anchor>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
