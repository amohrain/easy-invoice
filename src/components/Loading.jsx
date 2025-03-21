export const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex glass items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl block mb-3">Loading</h1>
        <span className="loading loading-dots loading-xs"></span>
      </div>
    </div>
  );
};
