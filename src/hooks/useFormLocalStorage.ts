import { useEffect, useState } from "react";

type StoredFormData = {
  data: Record<string, any>;
  currentStep: number;
  expiresAt: number;
};

const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export function useFormLocalStorage(
  storageKey: string,
  initialData: Record<string, any> = {},
  initialStep: number = 0
) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: StoredFormData = JSON.parse(stored);
        
        // Check if data has expired
        if (Date.now() < parsed.expiresAt) {
          setFormData(parsed.data);
          setCurrentStep(parsed.currentStep);
        } else {
          // Remove expired data
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
      localStorage.removeItem(storageKey);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save data to localStorage whenever it changes
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

  // Clear localStorage
  const clearStorage = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
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

