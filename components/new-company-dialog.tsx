"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { createDashboard } from "@/server/actions/dashboards";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNewCompanyDialog } from "@/hooks/use-new-company-dialog";

const stocks = [
  {
    value: "AAPL",
    label: "Apple Inc.",
  },
  {
    value: "GOOGL",
    label: "Alphabet Inc.",
  },
  {
    value: "MSFT",
    label: "Microsoft Corporation",
  },
  {
    value: "AMZN",
    label: "Amazon.com Inc.",
  },
  {
    value: "TSLA",
    label: "Tesla Inc.",
  },
  {
    value: "META",
    label: "Meta Platforms Inc.",
  },
];

export function NewCompanyDialog() {
  const router = useRouter();
  const { isOpen, close } = useNewCompanyDialog();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [ticker, setTicker] = React.useState("");

  const handleAddCompany = async () => {
    const { id, error, message } = await createDashboard(ticker);
    if (error) {
      toast.error(message);
    } else {
      router.push(`/dashboard/${id}`);
    }
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Company</DialogTitle>
        </DialogHeader>
        <div className="flex grow items-center justify-center">
          <div className="flex flex-col gap-4">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-96 justify-between"
                >
                  {ticker
                    ? stocks.find((stock) => stock.value === ticker)?.label
                    : "Select a stock..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <Command>
                  <CommandInput placeholder="Search companies..." />
                  <CommandList>
                    <CommandEmpty>No companies found.</CommandEmpty>
                    <CommandGroup>
                      {stocks.map((stock) => (
                        <CommandItem
                          key={stock.value}
                          value={stock.value}
                          onSelect={() => {
                            setTicker(stock.value);
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              ticker === stock.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {stock.value} - {stock.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button disabled={!ticker} onClick={handleAddCompany}>
              Add Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
