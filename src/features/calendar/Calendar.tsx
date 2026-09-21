"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Group,
  Loader,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { getCalendarEvents } from "@/services/calendar";
import type { CalendarEvent } from "@/types/model/calendar";
import {
  WEEKDAYS,
  addDays,
  dateLabel,
  eventsOnDay,
  eventSchedule,
  midnight,
  monthDays,
  monthLabel,
  monthStart,
  shiftMonth,
  wibDate,
} from "./calendar-dates";
import classes from "./Calendar.module.css";

export default function Calendar(): ReactElement {
  const [month, setMonth] = useState<string | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const mobile = useMediaQuery("(max-width: 47.99em)");
  const view = choice ?? (mobile ? "agenda" : "month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  useEffect(() => {
    setMonth(monthStart(wibDate()));
  }, []);
  const days = month ? monthDays(month, view === "month") : [];
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const start = firstDay ? midnight(firstDay) : "";
  const end = lastDay ? midnight(addDays(lastDay, 1)) : "";
  useEffect(() => {
    if (!start || !end) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    void getCalendarEvents(start, end, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setEvents(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [start, end, revision]);
  const eventButton = (event: CalendarEvent): ReactElement => (
    <button
      key={event.id}
      aria-label={event.title}
      className={classes.event}
      onClick={() => setSelected(event)}
    >
      <span className={classes.eventTitle}>{event.title}</span>
      {view === "agenda" && event.location && (
        <span className={classes.eventLocation}>{event.location}</span>
      )}
    </button>
  );

  return (
    <Stack gap="lg" className={classes.calendar}>
      {month && (
        <Group justify="space-between" className={classes.toolbar}>
          <Title
            order={2}
            size="h3"
            aria-live="polite"
            className={classes.monthTitle}
          >
            {monthLabel(month)}
          </Title>

          <ActionIcon
            variant="default"
            size={44}
            className={classes.previous}
            aria-label="Bulan sebelumnya"
            onClick={() => setMonth(shiftMonth(month, -1))}
          >
            <IconChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            size={44}
            className={classes.next}
            aria-label="Bulan berikutnya"
            onClick={() => setMonth(shiftMonth(month, 1))}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
          <Button
            variant="default"
            className={classes.todayButton}
            onClick={() => setMonth(monthStart(wibDate()))}
          >
            Hari ini
          </Button>
          <SegmentedControl
            className={classes.viewControl}
            size="md"
            classNames={{ label: classes.viewLabel }}
            aria-label="Tampilan kalender"
            value={view}
            onChange={setChoice}
            data={[
              { label: "Bulan", value: "month" },
              { label: "Agenda", value: "agenda" },
            ]}
          />
        </Group>
      )}
      {loading ? (
        <Group role="status" className={classes.state}>
          <Loader size="sm" />
          <Text>Memuat kalender…</Text>
        </Group>
      ) : error ? (
        <Alert color="red" title="Kalender gagal dimuat">
          <Button
            variant="light"
            color="red"
            onClick={() => setRevision((value) => value + 1)}
          >
            Coba lagi
          </Button>
        </Alert>
      ) : (
        <>
          {!events.length && (
            <Text c="dimmed" className={classes.state}>
              Belum ada acara pada periode ini.
            </Text>
          )}
          {view === "month" && month ? (
            <div
              className={classes.scroll}
              role="region"
              aria-label="Kalender bulanan, gulir untuk melihat semua tanggal"
              tabIndex={0}
            >
              <table className={classes.month}>
                <caption>{monthLabel(month)}</caption>
                <thead>
                  <tr>
                    {WEEKDAYS.map((day) => (
                      <th scope="col" key={day}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: days.length / 7 }, (_, week) => (
                    <tr key={week}>
                      {days.slice(week * 7, week * 7 + 7).map((day) => (
                        <td
                          key={day}
                          className={
                            day.slice(0, 7) !== month.slice(0, 7)
                              ? classes.outside
                              : undefined
                          }
                        >
                          <time
                            dateTime={day}
                            aria-label={dateLabel(day)}
                            aria-current={
                              day === wibDate() ? "date" : undefined
                            }
                            className={`${classes.date} ${day === wibDate() ? classes.today : ""}`}
                          >
                            {Number(day.slice(-2))}
                          </time>
                          <div className={classes.events}>
                            {eventsOnDay(events, day).map(eventButton)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            days.map((day) => {
              const daily = eventsOnDay(events, day);
              return daily.length ? (
                <section key={day} className={classes.agenda}>
                  <Title order={3} size="h5" mb="sm">
                    {dateLabel(day)}
                  </Title>
                  {daily.map(eventButton)}
                </section>
              ) : null;
            })
          )}
        </>
      )}
      <Modal
        opened={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title}
        centered
      >
        {selected && (
          <Stack className={classes.details}>
            <Text>{eventSchedule(selected)}</Text>
            {selected.location && (
              <Text>
                <strong>Lokasi:</strong> {selected.location}
              </Text>
            )}
            {selected.description && <Text>{selected.description}</Text>}
            {selected.activity && (
              <Anchor
                component={Link}
                href={`/activity/${encodeURIComponent(selected.activity.slug)}`}
              >
                Lihat kegiatan: {selected.activity.name}
              </Anchor>
            )}
            <Button variant="default" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
