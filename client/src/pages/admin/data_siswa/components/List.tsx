import React, { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Command, CommandGroup } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface ListProps {
  selectedMajor: string;
  setSelectedMajor: Dispatch<SetStateAction<string>>;
}

const majors = [
  {
    value: "geomatika",
    label: "Geomatika",
  },
  {
    value: "dpib",
    label: "Desain Permodelan Industri Bangunan",
  },
  {
    value: "tkdp",
    label: "Teknik Konstruksi dan Pembangunan",
  },
  {
    value: "tpg",
    label: "Teknik Perawatan Gedung",
  },
  {
    value: "titl",
    label: "Teknik Instalasi Tenaga Listrik",
  },
  {
    value: "toi",
    label: "Teknik Otomasi Industri",
  },
  {
    value: "m",
    label: "Teknik Permesinan",
  },
  {
    value: "tmi",
    label: "Teknik Mesin Industri",
  },
  {
    value: "dgm",
    label: "Desain Gambar Mesin",
  },
  {
    value: "rpl",
    label: "Rekayasa Perangkat Lunak",
  },
];

const List = ({
  children,
  selectedMajor,
  setSelectedMajor,
}: ListProps & { children: ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState<string>("");

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Card className="basis-2/6 whitespace-nowrap">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle>Student List</CardTitle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between "
            >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {selectedMajor
                  ? majors.find((major) => major.value === selectedMajor)?.label
                  : "Major"}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] overflow-hidden p-0">
            <Command>
              <div className="flex items-center gap-x-2 max-w-sm border-b leading-none border-slate-200 bg-transparent px-3 py-1.5 text-sm transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
                <Search size={16} className="text-primary inline" />
                <input
                  placeholder="Search major..."
                  value={search}
                  onChange={searchHandler}
                  className="w-full h-full placeholder:text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5"
                />
              </div>
              <CommandGroup>
                <div className="overflow-y-auto max-h-[300px]">
                  {majors
                    .filter((filtered) =>
                      filtered.label
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((major) => (
                      <div
                        className="flex hover:bg-primary/[0.08] cursor-pointer items-center px-2 py-1.5 text-sm gap-2 indent-0"
                        onClick={() => {
                          setSelectedMajor(
                            selectedMajor == major.value ? "" : major.value
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "max-h-4 max-w-4 text-primary basis-1/6",
                            selectedMajor === major.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <h1 className="basis-5/6 leading-tight">{major.label}</h1>
                      </div>
                    ))}
                </div>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[80%] px-2">
        {children}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default List;
