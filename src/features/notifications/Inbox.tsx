"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import {
  NotificationError,
  notificationChanged,
  notificationRequest,
  type InboxPage,
  type NotificationItem,
} from "./api";

export default function Inbox(): ReactElement {
  const params = useSearchParams();
  const router = useRouter();
  const selected = params.get("id");
  const [unread, setUnread] = useState(false);
  const [cursor, setCursor] = useState("");
  const [page, setPage] = useState<InboxPage>();
  const [item, setItem] = useState<NotificationItem>();
  const detailHeading = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (item) detailHeading.current?.focus();
  }, [item]);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [detailRetry, setDetailRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback((): void => {
    setRevision((v) => v + 1);
    notificationChanged();
  }, []);
  const sessionError = useCallback((failure: unknown): void => {
    if (failure instanceof NotificationError && failure.status === 401)
      window.location.replace(
        "/api/logout?redirect=%2Flogin%3Fredirect%3D%2Fnotifications",
      );
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    void notificationRequest<InboxPage>(
      `?unread=${unread}&cursor=${encodeURIComponent(cursor)}`,
      "GET",
      undefined,
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) setPage(result);
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) {
          setError("Notifikasi belum dapat dimuat.");
          sessionError(failure);
        }
      });
    return () => controller.abort();
  }, [unread, cursor, revision, sessionError]);
  useEffect(() => {
    const listener = (): void => {
      if (!document.hidden) setRevision((v) => v + 1);
    };
    const timer = window.setInterval(listener, 30000);
    window.addEventListener("focus", listener);
    document.addEventListener("visibilitychange", listener);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", listener);
      document.removeEventListener("visibilitychange", listener);
    };
  }, []);
  useEffect(() => {
    if (!selected) return;
    if (!/^[1-9]\d*$/.test(selected) || Number(selected) > 2147483647) {
      setItem(undefined);
      setDetailError("Pengumuman tidak tersedia.");
      return;
    }
    const controller = new AbortController();
    setItem(undefined);
    setDetailError("");
    void notificationRequest<NotificationItem>(
      `/${encodeURIComponent(selected)}/read`,
      "PUT",
      {},
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) {
          setItem(result);
          refresh();
        }
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) {
          setDetailError("Pengumuman tidak tersedia atau gagal dimuat.");
          sessionError(failure);
        }
      });
    return () => controller.abort();
  }, [selected, refresh, sessionError, detailRetry]);
  const mark = async (id?: number): Promise<void> => {
    setBusy(true);
    setError("");
    try {
      await notificationRequest(
        id ? `/${id}/read` : "/read-all",
        "PUT",
        id ? {} : { cutoff: page?.cutoff },
      );
      refresh();
    } catch (failure) {
      setError("Gagal menandai notifikasi. Coba lagi.");
      sessionError(failure);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <SegmentedControl
          aria-label="Filter notifikasi"
          data={[
            { label: "Semua", value: "all" },
            { label: "Belum dibaca", value: "unread" },
          ]}
          value={unread ? "unread" : "all"}
          onChange={(value) => {
            setPage(undefined);
            setUnread(value === "unread");
            setCursor("");
          }}
        />
        <Button
          variant="default"
          disabled={!page}
          loading={busy}
          onClick={() => void mark()}
        >
          Tandai semua dibaca
        </Button>
      </Group>
      {error && (
        <Alert color="red" title={error}>
          <Button variant="subtle" onClick={refresh}>
            Coba lagi
          </Button>
        </Alert>
      )}
      {!page && !error ? (
        <Skeleton height={120} />
      ) : page?.items.length === 0 ? (
        <Text c="dimmed" py="xl" ta="center">
          Tidak ada notifikasi
        </Text>
      ) : (
        page?.items.map((entry) => (
          <Paper key={entry.id} withBorder p="md" radius="md">
            <Stack gap="xs">
              <UnstyledButton
                onClick={() =>
                  router.push(`/notifications?id=${entry.id}`, {
                    scroll: false,
                  })
                }
                style={{ overflowWrap: "anywhere" }}
              >
                <Text fw={entry.read_at ? 400 : 600}>{entry.title}</Text>
              </UnstyledButton>
              <Text size="sm" c="dimmed">
                {new Date(entry.published_at).toLocaleString("id-ID")}
                {!entry.read_at ? " · Belum dibaca" : ""}
              </Text>
              {!entry.read_at && (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  style={{ alignSelf: "flex-start" }}
                  disabled={busy}
                  onClick={() => void mark(entry.id)}
                >
                  Tandai dibaca
                </Button>
              )}
            </Stack>
          </Paper>
        ))
      )}
      <Group>
        {cursor && (
          <Button
            variant="default"
            onClick={() => {
              setPage(undefined);
              setCursor("");
            }}
          >
            Kembali ke terbaru
          </Button>
        )}
        {page?.next_cursor && (
          <Button
            variant="default"
            onClick={() => {
              setPage(undefined);
              setCursor(page.next_cursor);
            }}
          >
            Berikutnya
          </Button>
        )}
      </Group>
      <Modal
        opened={!!selected}
        onClose={() => router.replace("/notifications", { scroll: false })}
        title={
          <span ref={detailHeading} tabIndex={-1}>
            {item?.title || "Pengumuman"}
          </span>
        }
        styles={{ title: { overflowWrap: "anywhere", minWidth: 0 } }}
        centered
      >
        {detailError ? (
          <Alert color="red" title={detailError}>
            <Button
              variant="subtle"
              onClick={() => setDetailRetry((value) => value + 1)}
            >
              Coba lagi
            </Button>
          </Alert>
        ) : !item ? (
          <Skeleton height={100} />
        ) : (
          <Stack>
            <Text style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {item.body}
            </Text>
            {item.link_url && (
              <Button
                component="a"
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "100%",
                  height: "auto",
                }}
                styles={{
                  label: {
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    paddingBlock: 8,
                  },
                }}
              >
                {item.link_label}
              </Button>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
