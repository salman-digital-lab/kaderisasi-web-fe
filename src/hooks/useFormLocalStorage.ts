import { useEffect, useState } from "react";

type StoredFormData = {
  data: Record<string, unknown>;
  currentStep: number;
  expiresAt: number;
};

const EXPIRATION_TIME = 2 * 60 * 60 * 1000;

export function useFormLocalStorage(
  storageKey: string,
  initialData: Record<string, unknown> = {},
  initialStep: number = 0,
  reset: boolean = false,
) {
  const [formData, setFormData] =
    useState<Record<string, unknown>>(initialData);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (reset) {
      localStorage.removeItem(storageKey);
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: StoredFormData = JSON.parse(stored);

        if (Date.now() < parsed.expiresAt) {
          setFormData(parsed.data);
          setCurrentStep(parsed.currentStep);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
      localStorage.removeItem(storageKey);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, reset]);

  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === "undefined") return;

    try {
      const dataToStore: StoredFormData = {
        data: formData,
        currentStep,
        expiresAt: Date.now() + EXPIRATION_TIME,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  }, [formData, currentStep, storageKey, isLoaded]);

  const clearStorage = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
      setFormData(initialData);
      setCurrentStep(initialStep);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    clearStorage,
    isLoaded,
  };
}
