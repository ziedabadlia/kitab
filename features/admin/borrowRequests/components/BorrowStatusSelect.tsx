import { BorrowingStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStatusStyles } from "../utils/status";

interface Props {
  status: BorrowingStatus;
  styles: ReturnType<typeof getStatusStyles>;
  options: { value: string; label: string }[];
  disabled: boolean;
  onChange: (val: BorrowingStatus) => void;
}

export function BorrowStatusSelect({
  status,
  styles,
  options,
  disabled,
  onChange,
}: Props) {
  const currentLabel = options.find((o) => o.value === status)?.label ?? status;

  return (
    <Select disabled={disabled} onValueChange={onChange} value={status}>
      <SelectTrigger
        className={cn(
          "h-8 px-3 text-[11px] rounded-full font-bold uppercase tracking-wider",
          styles.bg,
          styles.text,
          styles.border,
        )}
      >
        <span>{currentLabel}</span>
      </SelectTrigger>

      <SelectContent position='popper' className='rounded-xl border-slate-200'>
        {options.map((opt) => {
          const optionStyle = getStatusStyles(opt.value);

          return (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className={cn(
                "cursor-pointer p-1 my-2 rounded-lg transition-colors",
                optionStyle.bg,
                optionStyle.text,
                optionStyle.border,
              )}
            >
              <span className='font-medium'>{opt.label}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
