import { PlateListing } from "@/lib/types";
import { PlateCard } from "@/components/ui/plate-card";

interface FeaturedCarouselProps {
  items: PlateListing[];
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  return (
    <div className="no-scrollbar -mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-2">
      {items.map((listing) => (
        <div key={listing.id} className="min-w-[290px] max-w-[290px] snap-start sm:min-w-[360px] sm:max-w-[360px]">
          <PlateCard listing={listing} />
        </div>
      ))}
    </div>
  );
}
