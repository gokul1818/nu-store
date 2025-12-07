import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const reviews = [
  {
    name: "Jonathan Abe",
    role: "Our Client",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Kyranth A.",
    role: "Our Client",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Lylie Jen",
    role: "Our Client",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function GoogleReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-16 relative">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
        <div></div>
      </div>

      <div className="container mx-auto px-4 relative">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-v text-4xl"><FaStar /></span>
              <span className="text-5xl font-bold">4.9</span>
              <span className="text-xl text-gray-500">/5</span>
            </div>
            <p className="mt-2 text-gray-600">
              <span className="text-v font-bold">300+ </span> Reviews on Google
            </p>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              We deliver data-driven and result-focused deliverables.
              <br />Hear what they say about us.
            </h2>
          </div>
        </div>

        {/* Carousel */}
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">

            {reviews.map((review, i) => (
              <div
                key={i}
                className="embla__slide min-w-full px-4 md:min-w-[33.33%]"
              >
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative h-full">
                  
                  {/* Stars */}
                  <div className="flex text-v mb-3">
                    {Array(5).fill(0).map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">{review.review}</p>

                  <div className="flex items-center gap-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-black">{review.name}</p>
                      <p className="text-v text-sm">{review.role}</p>
                    </div>
                  </div>

                  <FaQuoteRight className="absolute bottom-5 right-5 text-gray-300 text-xl" />
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            ←
          </button>

          <button
            onClick={scrollNext}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          >
            →
          </button>
        </div>

      </div>
    </section>
  );
}
