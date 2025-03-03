import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { copyToClipboard } from "./utils";

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function useDebounced<T>(wait: number, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [debounded, setDebounced] = useState(value);

  const deboundedSetValue = useMemo(() => debounce(setDebounced, wait), [wait]);
  const dispatch = (value: T) => {
    setValue(value);
    deboundedSetValue(value);
  };

  return [value, debounded, dispatch] as [
    filter: T,
    debouncedFilter: T,
    setFilter: Dispatch<SetStateAction<T>>,
  ];
}

export function useSticky(
  offset: number | RefObject<Element | null>,
  containerRef?: RefObject<HTMLElement | null>,
) {
  const [top, setTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const value =
        typeof offset === "number" ? offset : offset.current?.clientHeight;
      if (value != null) {
        const scrollContainer = containerRef?.current || window;
        const scrollY =
          scrollContainer === window
            ? window.scrollY
            : (scrollContainer as HTMLElement).scrollTop;
        setTop(scrollY < value);
      }
    };

    const scrollContainer = containerRef?.current || window;
    scrollContainer.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [offset, containerRef]);

  return top;
}

export function useClipboard() {
  const [copied, setCopied] = useState<string[]>([]);

  const isCopied = (key: string) => {
    return copied.includes(key);
  };

  const copy = (text: string, key: string) => {
    copyToClipboard(text);
    if (!isCopied(key)) {
      setCopied((keys) => [...keys, key]);
      return true;
    }
    return false;
  };

  return [copy, isCopied] as [
    copy: (text: string, key: string) => boolean,
    isCopied: (key: string) => boolean,
  ];
}
