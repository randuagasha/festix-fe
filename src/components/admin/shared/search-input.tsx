"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue = "",
  onChange,
  debounceMs = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(controlledValue);

  useEffect(() => {
    setLocalValue(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== controlledValue) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, controlledValue]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-8 text-xs sm:w-64"
      />
    </div>
  );
}
