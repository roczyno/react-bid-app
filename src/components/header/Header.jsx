import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  return (
    <div className="w-full h-[calc(95vh-100px)] bg-gradient-to-r from-primary/50 to-primary/50 bg-[url('/src/assets/bg.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center text-white relative px-5">
      <ToastContainer />
      
      {/* Main Content */}
      <div className="text-center flex items-center flex-col gap-3 tracking-wide">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium mb-3">
          Say hello to your next <br className="hidden sm:block" /> awesome Items
        </h1>
        <h3 className="text-sm md:text-lg lg:text-xl font-light">
          Featuring used, Wholesale and Salvage cars, <br className="hidden sm:block" />
          Trucks and SUV for Sale
        </h3>
      </div>
      
      {/* Filter Container */}
      <div className="absolute bottom-[-30px] md:bottom-[-40px] w-[90%] max-w-6xl h-auto md:h-18 bg-white rounded-2xl text-black flex flex-col md:flex-row items-center justify-around p-4 md:p-5 gap-4 md:gap-0 shadow-lg">
        
        {/* Category Select */}
        <div className="w-full md:w-auto">
          <select className="w-full md:w-auto outline-none border-none p-2 rounded bg-gray-100 text-sm">
            <option value="">Select Category</option>
            <option value="">Cars</option>
            <option value="">Trucks</option>
            <option value="">SUVs</option>
            <option value="">Motorcycles</option>
          </select>
        </div>
        
        {/* Search Input */}
        <div className="flex items-center relative w-full md:w-auto">
          <input 
            type="search" 
            placeholder="Search Items" 
            className="w-full md:w-96 lg:w-[500px] p-3 pl-4 pr-12 rounded bg-gray-200 outline-none border-none text-sm focus:bg-white focus:shadow-md transition-all"
          />
          <SearchIcon className="absolute right-4 text-gray-400" />
        </div>
        
        {/* Filter Button */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
          <TuneIcon />
          <span className="text-sm">Filter</span>
        </div>
        
        {/* Search Button */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3 bg-primary text-white border-none rounded cursor-pointer hover:bg-primary/90 transition-colors text-sm font-medium">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;