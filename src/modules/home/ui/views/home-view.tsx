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
