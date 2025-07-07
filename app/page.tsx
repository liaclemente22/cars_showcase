import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import { CustomFilter, Hero, SearchBar } from "@/components";
import ShowMore from "@/components/ShowMore";
import CarCard from "@/components/CarCard";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    manufacturer?: string;
    year?: string;
    model?: string;
    limit?: string;
    fuel?: string;
  };
}) {
  const year = Number(searchParams?.year) || 2022;
  const limit = Number(searchParams?.limit) || 10;

  const allCars = await fetchCars({
    manufacturer: searchParams?.manufacturer || "",
    year,
    fuel: searchParams?.fuel || "",
    limit,
    model: searchParams?.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className='overflow-hidden'>
      <Hero />
      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-npmextrabold'>Car Catalogue</h1>
          <p>Explore our cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar />
          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} />
            <CustomFilter title='year' options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car) => (
                <CarCard key={`${car.make}-${car.model}-${car.year}`} car={car} />
              ))}
            </div>
            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            <p>{allCars?.message || "Try adjusting your filters."}</p>
          </div>
        )}
      </div>
    </main>
  );
}
