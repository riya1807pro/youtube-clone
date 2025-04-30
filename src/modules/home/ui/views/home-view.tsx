<<<<<<< HEAD
import CategorySection from "../sections/categorySection"; // or { CategorySection } if named export

interface HomeViewProps {
  categoryId: string;
}

const HomeView: React.FC<HomeViewProps> = ({ categoryId }) => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 mx-auto pt-2.5 flex flex-col">
      <CategorySection categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
=======
import { CategoriesSection } from "../sections/categories-section";
import { HomeVideosSection } from "../sections/home-videos-section";

interface HomeViewProps {
  categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
      <HomeVideosSection categoryId={categoryId} />
    </div>
  );
};
>>>>>>> 9f21a4b (internal structure improvements)
