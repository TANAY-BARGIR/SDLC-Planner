import { useState, useEffect } from "react";

const DiamondGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="diamond-container">
      <div className="diamond-frame">
        <div className="diamond-inner">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="gallery-img"
              style={{
                opacity: idx === currentIndex ? 1 : 0,
                transform:
                  idx === currentIndex ? "translateX(0)" : "translateX(-100%)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiamondGallery;