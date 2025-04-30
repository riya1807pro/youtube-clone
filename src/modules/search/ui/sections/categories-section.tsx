"use client";
<<<<<<< HEAD
import { FilterCorousal } from "@/components/filterCaursal";
=======

import { FilterCarousel } from "@/components/filter-carousel";
>>>>>>> 9f21a4b (internal structure improvements)
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
<<<<<<< HEAD

interface CategorySectionProps {
  categoryId: string;
}

const CategorySection = ({ categoryId }: CategorySectionProps) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <ErrorBoundary fallback={<p>Error....</p>}>
        <CategorySectionSuspense categoryId={categoryId} />
=======
interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
>>>>>>> 9f21a4b (internal structure improvements)
      </ErrorBoundary>
    </Suspense>
  );
};

<<<<<<< HEAD
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
=======
const CategoriesSkeleton = () => {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
};

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

>>>>>>> 9f21a4b (internal structure improvements)
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };
<<<<<<< HEAD

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
=======
  return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
};
>>>>>>> 9f21a4b (internal structure improvements)
