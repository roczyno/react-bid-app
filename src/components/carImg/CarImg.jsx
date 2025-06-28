import "./carImg.scss";

const CarImg = ({ auction }) => {
  const images = auction?.images || [];
  const defaultImage = "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg";

  return (
    <div className="CarImg">
      <div className="carImg">
        <div className="firstImg">
          <img 
            src={images[0] || defaultImage} 
            alt={auction?.title || "Car"}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
        <div className="others">
          {images.length > 1 && (
            <img 
              src={images[1] || defaultImage} 
              alt={auction?.title || "Car"}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          )}
          <div className="item">
            {images.length > 2 && (
              <img 
                src={images[2] || defaultImage} 
                alt={auction?.title || "Car"}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            )}
            {images.length > 3 && (
              <img 
                src={images[3] || defaultImage} 
                alt={auction?.title || "Car"}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarImg;