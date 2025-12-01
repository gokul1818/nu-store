import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BannerCarousel({ banners = [] }) {
    const scrollRef = useRef(null);
    const indexRef = useRef(0);
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll every 3 seconds
    useEffect(() => {
        if (!banners.length) return;

        const interval = setInterval(() => {
            const container = scrollRef.current;
            if (!container) return;

            indexRef.current = (indexRef.current + 1) % banners.length;
            setActiveIndex(indexRef.current);

            container.scrollTo({
                left: indexRef.current * container.clientWidth,
                behavior: "smooth",
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [banners.length]);

    // Detect manual scroll & sync dots
    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const newIndex = Math.round(
            container.scrollLeft / container.clientWidth
        );
        indexRef.current = newIndex;
        setActiveIndex(newIndex);
    };

    if (!banners.length) return null;

    return (
        <div className="relative w-full">
            {/* Carousel */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
          w-full
          overflow-x-scroll
          flex
          snap-x snap-mandatory
          scroll-smooth
          h-56 md:h-[50vh] lg:h-[60vh]
          rounded-lg
          scrollbar-hide
          no-scrollbar
        "
                style={{ scrollBehavior: "smooth" }}
            >
                {banners.map((b, i) => (
                    <div key={i} className="w-full h-full flex-shrink-0 snap-start" onClick={() => navigate(b.link)}>
                        <img
                            src={b.image_url}
                            alt={b.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            const container = scrollRef.current;
                            indexRef.current = i;
                            setActiveIndex(i);
                            container.scrollTo({
                                left: i * container.clientWidth,
                                behavior: "smooth",
                            });
                        }}
                        className={`
              w-3 h-3 rounded-full transition-all 
              ${activeIndex === i ? "bg-white scale-125" : "bg-white/40"}
            `}
                    />
                ))}
            </div>
        </div>
    );
}
