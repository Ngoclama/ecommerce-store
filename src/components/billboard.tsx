import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="w-full pt-4">
      <div
        className="relative w-full aspect-[2.5/1] md:aspect-[3/1] rounded-xl overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.imageUrl})` }}
      >
        {/* Overlay gradient đẹp mắt */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Nội dung */}
        <div className="relative h-full flex flex-col justify-center items-start text-left gap-6 px-6 sm:px-12">
          <h1 className="font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl max-w-xl leading-tight drop-shadow-2xl">
            {data?.label}
          </h1>

          <p className="text-white/90 text-lg sm:text-xl max-w-lg leading-relaxed">
            Discover new collections and exclusive offers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-10 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg">
              Shop Now
            </button>

            <button className="px-10 py-3 bg-white/20 text-white font-semibold rounded-full border border-white/40 hover:bg-white/30 backdrop-blur-sm transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
