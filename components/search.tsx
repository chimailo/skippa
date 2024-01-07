import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";
import useDebounce from "@/hooks/debounce";

type Props = {
  placeholder: string;
  searching: boolean;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchRecords: () => void;
};

export default function Search(props: Props) {
  const { searching, placeholder, handleSearch, searchRecords } = props;
  const searchParams = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = searchParams.get("name");

    if (ref.current && name) {
      ref.current.value = name;
    }
  }, []);

  const debounceSearch = useDebounce(searchRecords);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e);
    debounceSearch();
  };

  return (
    <div className="max-w-lg flex-1 relative pl-3">
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="pl-10"
        onChange={handleChange}
      />
      <SearchIcon className="w-5 h-5 text-slate-400 absolute left-6 top-2.5" />
      {searching && (
        <Spinner
          twColor="text-primary before:bg-primary"
          twSize="w-4 h-4"
          className="absolute right-8 top-3"
        />
      )}
    </div>
  );
}
