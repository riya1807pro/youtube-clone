import { useInteractionObserver } from "@/hooks/use-interaction-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface infiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: infiniteScrollProps) => {
  const { targetRef, isIntersecting } = useInteractionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    isManual,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div className="flex flex-col items-center  gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      ) : (
        //IF THE LIMIT REACHG TO MAX
        <p className="text-xs text-muted-foreground">
          Ypu reached at the end of the page
        </p>
      )}
    </div>
  );
};
