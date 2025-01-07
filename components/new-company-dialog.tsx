"use client";

import React from "react";
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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCompany } from "@/server/actions/companies";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNewCompanyDialog } from "@/hooks/use-new-company-dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

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
  const { isOpen, close } = useNewCompanyDialog();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [company, setCompany] = React.useState({
    name: "",
    ticker: "",
  });

  const handleAnalyze = async () => {
    console.log(company);
    // const { error, message } = await createCompany(
    //   company.name,
    //   company.ticker,
    // );
    // if (error) {
    //   toast.error(message);
    // }
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
                  {company.name
                    ? stocks.find((stock) => stock.value === company.ticker)
                        ?.label
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
                            setCompany({
                              name: stock.label,
                              ticker: stock.value,
                            });
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              company.ticker === stock.value
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

            <Button disabled={!company.name} onClick={handleAnalyze}>
              Analyze
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
