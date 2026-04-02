const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
    <p className="text-gray-400 text-sm font-medium">Loading...</p>
  </div>
);

export default Spinner;
