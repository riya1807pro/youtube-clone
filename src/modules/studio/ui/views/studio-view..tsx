import { VideoSection } from "../sections/video-section";

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Channel Content</h1>
        <p text-xs text-muted-forefround>
          manage your channele content and videos
        </p>
      </div>
      <VideoSection />
    </div>
  );
};
