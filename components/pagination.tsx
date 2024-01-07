import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";

export type TPagination = Record<string, string | boolean | null | undefined>;

type Props = {
  fetching: boolean;
  pagination: TPagination;
  handlePrevClick: () => void;
  handleNextClick: () => void;
};

export default function Pagination(props: Props) {
  const { fetching, pagination, handleNextClick, handlePrevClick } = props;

  return (
    <div className="p-5 w-full justify-end flex gap-4 items-center">
      {fetching && (
        <Spinner
          twColor="text-primary before:bg-primary"
          twSize="w-3 h-3"
          className="ml-3"
        />
      )}
      {pagination?.hasPrevPage && (
        <Button
          variant="outline"
          size="sm"
          disabled={fetching}
          className="h-6 w-6 rounded-sm p-0"
          onClick={handlePrevClick}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
      <p className="text-sm">
        Page {pagination?.currentPage} of {pagination?.totalPages}
      </p>
      {pagination?.hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 rounded-sm p-0"
          disabled={fetching}
          onClick={handleNextClick}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
