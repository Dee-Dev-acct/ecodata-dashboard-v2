import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Partner } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Partners = () => {
  const [category, setCategory] = useState<string | null>(null);
  
  const { data: partners = [], isLoading, error } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const categories = Array.from(
    new Set(partners.map((partner) => partner.category))
  );

  const filteredPartners = category
    ? partners.filter((partner) => partner.category === category)
    : partners;

  if (isLoading) {
    return (
      <section id="partners" className="py-16 bg-gradient-to-br from-[#F4F1DE]/30 to-[#F2CC8F]/30 dark:from-[#212738]/90 dark:to-[#0D1321]/80">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#3D405B] dark:text-[#F4F1DE]">
              Trusted By Leading Organizations
            </h2>
            <p className="text-[#3D405B]/80 dark:text-[#F4F1DE]/80 max-w-3xl mx-auto mb-10">
              We're proud to partner with organizations committed to making data-driven decisions for positive change.
            </p>
            <div className="animate-pulse flex space-x-4 justify-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-20 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="partners" className="py-16 bg-gradient-to-br from-[#F4F1DE]/30 to-[#F2CC8F]/30 dark:from-[#212738]/90 dark:to-[#0D1321]/80">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#3D405B] dark:text-[#F4F1DE]">
              Trusted By Leading Organizations
            </h2>
            <p className="text-red-500 dark:text-red-400">
              Unable to load partner information. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="partners" className="py-16 bg-gradient-to-br from-[#F4F1DE]/30 to-[#F2CC8F]/30 dark:from-[#212738]/90 dark:to-[#0D1321]/80">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#3D405B] dark:text-[#F4F1DE]">
            Trusted By Leading Organizations
          </h2>
          <p className="text-[#3D405B]/80 dark:text-[#F4F1DE]/80 max-w-3xl mx-auto mb-10">
            We're proud to partner with organizations committed to making data-driven decisions for positive change.
          </p>
          
          {/* Category filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge 
                variant={category === null ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setCategory(null)}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Badge>
              ))}
            </div>
          )}

          {/* Desktop view - All partners in a grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-10">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="bg-white/80 dark:bg-[#212738]/70 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center justify-center h-32">
                  <a 
                    href={partner.websiteUrl || "#"} 
                    target={partner.websiteUrl ? "_blank" : ""}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full"
                  >
                    <img 
                      src={partner.logoUrl} 
                      alt={`${partner.name} logo`} 
                      className="max-h-20 max-w-full object-contain filter hover:brightness-110 transition-all" 
                    />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile view - Carousel */}
          <div className="md:hidden">
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {filteredPartners.map((partner) => (
                  <CarouselItem key={partner.id}>
                    <Card className="bg-white/80 dark:bg-[#212738]/70 border-none shadow-md">
                      <CardContent className="p-4 flex items-center justify-center h-32">
                        <a 
                          href={partner.websiteUrl || "#"} 
                          target={partner.websiteUrl ? "_blank" : ""}
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full h-full"
                        >
                          <img 
                            src={partner.logoUrl} 
                            alt={`${partner.name} logo`} 
                            className="max-h-20 max-w-full object-contain" 
                          />
                        </a>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="static transform-none mx-2" />
                <CarouselNext className="static transform-none mx-2" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;