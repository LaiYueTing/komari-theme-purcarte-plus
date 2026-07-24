import { useState, useEffect, createContext, useContext } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { useAppConfig } from "@/config";
import { DEFAULT_CONFIG, allAppearance, allViewModes, allColors } from "@/config/default";
import type { AppearanceType, ColorType, ViewModeType } from "@/config/default";

type themeAppearanceType = "light" | "dark";
const defaultThemeAppearance: themeAppearanceType = "light";

export interface ThemeContextType {
  appearance: themeAppearanceType;
  rawAppearance: AppearanceType;
  setAppearance: (appearance: AppearanceType) => void;
  color: ColorType;
  setColor: (color: ColorType) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  statusCardsVisibility: {
    currentTime: boolean;
    currentOnline: boolean;
    regionOverview: boolean;
    trafficOverview: boolean;
    networkSpeed: boolean;
  };
  setStatusCardsVisibility: (
    visibility: Partial<ThemeContextType["statusCardsVisibility"]>
  ) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  appearance: defaultThemeAppearance,
  rawAppearance: DEFAULT_CONFIG.selectedDefaultAppearance as AppearanceType,
  setAppearance: () => {},
  color: DEFAULT_CONFIG.selectThemeColor as ColorType,
  setColor: () => {},
  viewMode: DEFAULT_CONFIG.selectedDefaultView as ViewModeType,
  setViewMode: () => {},
  statusCardsVisibility: {
    currentTime: true,
    currentOnline: true,
    regionOverview: true,
    trafficOverview: true,
    networkSpeed: true,
  },
  setStatusCardsVisibility: () => {},
});

/**
 * 將 Radix UI 的 "system" 外觀轉換為實際的 "light" 或 "dark" 外觀
 * @param appearance - 上下文中的外觀設定（"light"、"dark" 或 "system"）。
 * 回傳 Radix UI 已解析的外觀（ "light" 或 "dark"）
 */
export const useSystemTheme = (
  appearance: AppearanceType
): themeAppearanceType => {
  const [systemTheme, setSystemTheme] = useState<themeAppearanceType>(() => {
    // Initial system theme detection
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Return the resolved theme
  if (appearance === "system") {
    return systemTheme;
  }

  return appearance as themeAppearanceType;
};

const useStoredState = <T>(
  key: string,
  defaultValue: T,
  validator?: (value: any) => value is T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { enableLocalStorage } = useAppConfig();

  const [state, setState] = useState<T>(() => {
    if (enableLocalStorage) {
      try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          const parsedValue = JSON.parse(storedValue);
          if (!validator || validator(parsedValue)) {
            return parsedValue as T;
          }
        }
      } catch (error) {
        console.error("Error parsing stored state:", error);
        // Fallback to default value if parsing fails
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (enableLocalStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error("Error setting stored state:", error);
      }
    }
  }, [key, state, enableLocalStorage]);

  return [state, setState];
};

export const useThemeManager = () => {
  const {
    selectedDefaultAppearance,
    selectThemeColor,
    selectedDefaultView,
    selectMobileDefaultView,
  } = useAppConfig();
  const defaultstatusCardsVisibility = useAppConfig().statusCardsVisibility;
  const isMobile = useIsMobile();

  const [appearance, setAppearance] = useStoredState<AppearanceType>(
    "appearance",
    selectedDefaultAppearance,
    (v): v is AppearanceType => allAppearance.includes(v)
  );

  const [color, setColor] = useStoredState<ColorType>(
    "color",
    selectThemeColor,
    (v): v is ColorType => allColors.includes(v)
  );

  const [viewMode, setViewMode] = useStoredState<ViewModeType>(
    "nodeViewMode",
    selectedDefaultView,
    (v): v is ViewModeType => allViewModes.includes(v)
  );

  useEffect(() => {
    if (selectMobileDefaultView && isMobile) {
      setViewMode(selectMobileDefaultView);
    }
    if (!isMobile) {
      setViewMode(selectedDefaultView);
    }
  }, [isMobile, selectMobileDefaultView, selectedDefaultView, setViewMode]);

  const [statusCardsVisibility, setStatusCardsVisibility] = useStoredState(
    "statusCardsVisibility",
    (() => {
      const visibility: { [key: string]: boolean } = {};
      defaultstatusCardsVisibility.split(",").forEach((item) => {
        const [key, value] = item.split(":");
        visibility[key] = value === "true";
      });
      return visibility as ThemeContextType["statusCardsVisibility"];
    })()
  );

  const handleSetStatusCardsVisibility = (
    newVisibility: Partial<ThemeContextType["statusCardsVisibility"]>
  ) => {
    setStatusCardsVisibility((prev) => ({ ...prev, ...newVisibility }));
  };

  useEffect(() => {
    setColor(selectThemeColor);
  }, [selectThemeColor, setColor]);

  const resolvedAppearance = useSystemTheme(appearance);

  return {
    appearance: resolvedAppearance,
    rawAppearance: appearance,
    setAppearance,
    color,
    setColor,
    viewMode,
    setViewMode,
    statusCardsVisibility,
    setStatusCardsVisibility: handleSetStatusCardsVisibility,
  };
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
