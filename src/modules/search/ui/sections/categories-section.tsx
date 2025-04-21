"use client";
import { FilterCorousal } from "@/components/filterCaursal";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CategorySectionProps {
  categoryId: string;
}

const CategorySection = ({ categoryId }: CategorySectionProps) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <ErrorBoundary fallback={<p>Error....</p>}>
        <CategorySectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySkeleton = () => {
  return <FilterCorousal isLoading data={[]} onSelect={() => {}} />;
};

const CategorySectionSuspense = ({ categoryId }: CategorySectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((categories) => ({
    value: categories.id,
    label: categories.name,
  }));
  // console.log({ data });
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };

  return (
    <FilterCorousal
      onSelect={onSelect}
      value={categoryId}
      data={data}
      isLoading={false}
    />
  );
};

export default CategorySection;
