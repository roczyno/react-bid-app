const Advert = () => {
  return (
    <div className="min-h-[400px] md:min-h-[300px] w-full flex justify-center items-center py-12 md:py-16 px-5">
      <div className="w-full max-w-6xl border border-gray-300 min-h-[244px] rounded-lg flex flex-col md:flex-row items-center justify-around p-6 md:p-8 text-center gap-8 md:gap-4">
        
        <div className="flex-1 px-0 md:px-4">
          <h4 className="font-medium mb-3 text-lg md:text-xl">Millions of Unique Items</h4>
          <p className="font-light leading-relaxed text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            officiis doloribus quaerat repellat, provident molestiae cupiditate
          </p>
        </div>
        
        <div className="flex-1 px-0 md:px-4">
          <h4 className="font-medium mb-3 text-lg md:text-xl">Curated by Experts</h4>
          <p className="font-light leading-relaxed text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            officiis doloribus quaerat repellat, provident molestiae cupiditate
          </p>
        </div>
        
        <div className="flex-1 px-0 md:px-4">
          <h4 className="font-medium mb-3 text-lg md:text-xl">Bid With Ease</h4>
          <p className="font-light leading-relaxed text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            officiis doloribus quaerat repellat, provident molestiae cupiditate
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Advert;