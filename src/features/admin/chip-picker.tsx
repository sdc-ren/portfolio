"use client";
import { useId, useState } from "react";
import { Check, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uniqueChipOptions } from "./chip-options";
import styles from "./chip-picker.module.scss";

export function ChipPicker({
  label,
  value,
  options,
  onChange,
  disabled = false,
  single = false,
}: {
  label: string;
  value: string[];
  options: readonly string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  single?: boolean;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [custom, setCustom] = useState("");
  const [known, setKnown] = useState(value);
  const [notice, setNotice] = useState("");
  const choices = uniqueChipOptions([...known, ...options, ...value]);
  const visible = choices.filter((item) =>
    item.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const choose = (option: string, checked: boolean) => {
    if (single) {
      if (checked) onChange([option]);
      return;
    }
    onChange(
      checked ? [...value, option] : value.filter((item) => item !== option),
    );
  };
  const add = () => {
    const input = custom.trim();
    if (!input) return;
    if (input.length > 200) {
      setNotice("Use at most 200 characters.");
      return;
    }
    const option =
      choices.find((item) => item.toLowerCase() === input.toLowerCase()) ??
      input;
    if (!value.includes(option)) {
      if (!single && value.length >= 100) {
        setNotice("You can select at most 100 values.");
        return;
      }
      setKnown(uniqueChipOptions([...known, option]));
      onChange(single ? [option] : [...value, option]);
    }
    setCustom("");
    setQuery("");
    setNotice(`${option} selected.`);
  };
  return (
    <fieldset disabled={disabled} className={styles.field}>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className={styles.toolbar}>
        <div className="relative flex-1">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
          />
          <Label className="sr-only" htmlFor={`${id}-search`}>
            Search {label.toLowerCase()}
          </Label>
          <Input
            id={`${id}-search`}
            className="pl-9"
            placeholder="Search available options…"
            value={query}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {value.length} selected
        </span>
      </div>
      <div
        className={styles.options}
        role={single ? "group" : undefined}
        aria-label={`${label} options`}
      >
        {visible.map((option, index) => {
          const selected = value.includes(option);
          return single ? (
            <Button
              key={option}
              type="button"
              tooltip={false}
              variant="outline"
              size="sm"
              className={styles.chip}
              data-selected={selected}
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => choose(option, true)}
            >
              {selected && <Check size={13} aria-hidden="true" />}
              {option}
            </Button>
          ) : (
            <label
              key={option}
              htmlFor={`${id}-${index}`}
              className={styles.chip}
              data-selected={selected}
              data-disabled={disabled || (!selected && value.length >= 100)}
            >
              <Checkbox
                id={`${id}-${index}`}
                checked={selected}
                disabled={disabled || (!selected && value.length >= 100)}
                onCheckedChange={(checked) => choose(option, checked === true)}
              />
              {option}
            </label>
          );
        })}
        {!visible.length && (
          <p className="p-2 text-sm text-muted-foreground">
            No matching options. Add a custom value below.
          </p>
        )}
      </div>
      <div className={styles.add}>
        <Label className="sr-only" htmlFor={`${id}-custom`}>
          Custom {label.toLowerCase()} value
        </Label>
        <Input
          id={`${id}-custom`}
          placeholder="Add a custom value…"
          value={custom}
          disabled={disabled}
          maxLength={200}
          onChange={(event) => {
            setCustom(event.target.value);
            setNotice("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Add custom ${label.toLowerCase()} value`}
          disabled={disabled || !custom.trim()}
          onClick={add}
        >
          <Plus size={14} />
          Add
        </Button>
      </div>
      <p className={styles.hint}>
        {single
          ? "Select one value, or add your own."
          : "Check a chip to select it; uncheck to remove it. Custom values are supported."}
      </p>
      <p role="status" className="sr-only">
        {notice}
      </p>
    </fieldset>
  );
}
