"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const NO_OP = () => {};

export default function useTypeaheadSelect({
  value = null,
  options = [],
  onSearch = NO_OP,
  getOptionLabel,
  allowCustomSearch = false,
  onOpen,
  onClose,
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const labelGetter = useMemo(() => {
    return getOptionLabel || ((option) => option?.label ?? "");
  }, [getOptionLabel]);

  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value) {
      setSearchTerm(labelGetter(value));
    } else if (prevValueRef.current && prevValueRef.current !== value) {
      setSearchTerm("");
    }
    prevValueRef.current = value;
  }, [value, labelGetter]);

  const filteredOptions = useMemo(() => {
    if (!allowCustomSearch || searchTerm.trim().length === 0) {
      return options;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return options.filter((option) => labelGetter(option).toLowerCase().includes(normalized));
  }, [allowCustomSearch, labelGetter, options, searchTerm]);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        closeMenu();
        if (value) {
          setSearchTerm(labelGetter(value));
        }
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu, labelGetter, value]);

  const handleSearchChange = useCallback(
    (nextValue) => {
      setSearchTerm(nextValue);
      setHighlightedIndex(0);
      onSearch?.(nextValue);
      if (!isOpen) {
        openMenu();
      }
    },
    [isOpen, onSearch, openMenu]
  );

  const highlightNext = useCallback(() => {
    if (!filteredOptions.length) return;
    setHighlightedIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= filteredOptions.length) {
        return 0;
      }
      return nextIndex;
    });
  }, [filteredOptions.length]);

  const highlightPrevious = useCallback(() => {
    if (!filteredOptions.length) return;
    setHighlightedIndex((prev) => {
      const nextIndex = prev - 1;
      if (nextIndex < 0) {
        return filteredOptions.length - 1;
      }
      return nextIndex;
    });
  }, [filteredOptions.length]);

  const resetInputToValue = useCallback(() => {
    setSearchTerm(value ? labelGetter(value) : "");
  }, [labelGetter, value]);

  return {
    containerRef,
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    openMenu,
    closeMenu,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    handleSearchChange,
    highlightNext,
    highlightPrevious,
    resetInputToValue,
  };
}
