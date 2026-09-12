"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CustomFormSchema,
  CustomFormSection,
} from "@/types/api/customForm";
import {
  customSections,
  formRoute,
  nextSectionId,
  pruneFormAnswers,
  validateFormRouting,
} from "./form-routing";
import { validateCustomFormFields } from "./CustomFormFieldsRenderer/validation";

type RouteState = {
  answers: Record<string, unknown>;
  currentId: string;
  history: string[];
};
type Recovery = RouteState & { version: 2; schema: string; expiresAt: number };
type FormRouteState = RouteState & {
  currentSection?: CustomFormSection & { id: string };
  isLast: boolean;
  isProfileStep: boolean;
  isLoaded: boolean;
  notice: string;
  configurationError?: string;
  updateAnswers: (values: Record<string, unknown>) => void;
  advance: (values: Record<string, unknown>) => Record<string, unknown> | null;
  back: () => void;
  clear: () => void;
};

function defaults(sections: CustomFormSection[]): Record<string, unknown> {
  return Object.fromEntries(
    sections.flatMap((section) =>
      section.fields
        .filter(
          (field) =>
            !field.hidden &&
            !field.disabled &&
            field.defaultValue !== undefined,
        )
        .map((field) => [field.key, field.defaultValue]),
    ),
  );
}

export function useFormRoute(
  schema: CustomFormSchema,
  storageKey: string | null,
  includeProfile: boolean,
  initialAnswers: Record<string, unknown> = {},
  reset = false,
): FormRouteState {
  const sections = customSections(schema);
  let profileId = "__profile__";
  while (sections.some((section) => section.id === profileId)) profileId += "_";
  const knownKeys = new Set(
    schema.fields.flatMap((section) =>
      section.fields.map((field) => field.key),
    ),
  );
  const startingAnswers = Object.fromEntries(
    Object.entries(initialAnswers).filter(([key]) => knownKeys.has(key)),
  );
  const fingerprint = JSON.stringify(schema);
  const firstId = includeProfile ? profileId : (sections[0]?.id ?? "");
  const [state, setState] = useState<RouteState>({
    answers: { ...defaults(sections), ...startingAnswers },
    currentId: firstId,
    history: [],
  });
  const [isLoaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [cleared, setCleared] = useState(false);
  const configurationError = validateFormRouting(schema)[0]?.message;

  useEffect(() => {
    setState({
      answers: { ...defaults(sections), ...startingAnswers },
      currentId: firstId,
      history: [],
    });
    setCleared(false);
    if (!storageKey || configurationError) {
      setLoaded(true);
      return;
    }
    try {
      if (reset) localStorage.removeItem(storageKey);
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Recovery;
        if (
          saved.version === 2 &&
          saved.expiresAt > Date.now() &&
          saved.schema === fingerprint &&
          saved.answers &&
          typeof saved.answers === "object" &&
          !Array.isArray(saved.answers)
        ) {
          const answers = pruneFormAnswers(schema, saved.answers);
          const path = [
            ...(includeProfile ? [profileId] : []),
            ...formRoute(schema, answers),
          ];
          let index = Math.max(0, path.indexOf(saved.currentId));
          for (let i = includeProfile ? 1 : 0; i < index; i++) {
            const section = customSections(schema).find(
              (item) => item.id === path[i],
            );
            if (
              section &&
              Object.keys(validateCustomFormFields(section.fields, answers))
                .length
            ) {
              index = i;
              break;
            }
          }
          setState({
            answers,
            currentId: path[index] ?? firstId,
            history: path.slice(0, index),
          });
        } else {
          localStorage.removeItem(storageKey);
          setNotice(
            "Formulir atau masa penyimpanan telah berubah. Silakan isi kembali dari awal.",
          );
        }
      }
    } catch {
      setNotice("Draf tidak dapat dimuat. Anda tetap dapat mengisi formulir.");
    }
    setLoaded(true);
    // The serialized schema identifies the recovery contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, fingerprint, reset, configurationError]);

  useEffect(() => {
    if (!storageKey || !isLoaded || cleared || configurationError) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...state,
            version: 2,
            schema: fingerprint,
            expiresAt: Date.now() + 2 * 60 * 60 * 1000,
          } satisfies Recovery),
        );
      } catch {
        setNotice(
          "Draf tidak dapat disimpan di perangkat ini. Tetap buka halaman hingga selesai.",
        );
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [state, storageKey, isLoaded, cleared, fingerprint, configurationError]);

  const updateAnswers = useCallback((values: Record<string, unknown>): void => {
    setState((previous) => ({
      ...previous,
      answers: { ...previous.answers, ...values },
    }));
  }, []);
  const advance = (
    values: Record<string, unknown>,
  ): Record<string, unknown> | null => {
    const answers = pruneFormAnswers(schema, { ...state.answers, ...values });
    const next =
      state.currentId === profileId
        ? (sections[0]?.id ?? null)
        : nextSectionId(schema, state.currentId, answers);
    setState({
      answers: {
        ...defaults(sections.filter((section) => section.id === next)),
        ...answers,
      },
      currentId: next ?? state.currentId,
      history: next ? [...state.history, state.currentId] : state.history,
    });
    return next === null ? answers : null;
  };
  const back = (): void => {
    setState((previous) =>
      previous.history.length
        ? {
            ...previous,
            currentId: previous.history.at(-1)!,
            history: previous.history.slice(0, -1),
          }
        : previous,
    );
  };
  const clear = (): void => {
    setCleared(true);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* Storage can be unavailable in private browsers. */
      }
    }
  };
  const currentSection = sections.find(
    (section) => section.id === state.currentId,
  );
  const isLast =
    !configurationError &&
    (state.currentId === profileId
      ? sections.length === 0
      : !!currentSection &&
        nextSectionId(schema, state.currentId, state.answers) === null);
  return {
    ...state,
    currentSection,
    isProfileStep: includeProfile && state.currentId === profileId,
    isLast,
    isLoaded,
    notice,
    configurationError,
    updateAnswers,
    advance,
    back,
    clear,
  };
}
