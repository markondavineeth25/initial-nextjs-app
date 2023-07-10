import { PrismaClient, PRICE, Cuisine, Location, Review } from '@prisma/client';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import SearchSideBar from './components/SearchSideBar';

const prisma = new PrismaClient();

export interface RestaurantCardType {
    id: number;
    name: string;
    main_image: string;
    price: PRICE;
    cuisine: Cuisine;
    location: Location;
    slug: string;
    reviews: Review[];
}

export interface SearchParams { city?: string; cuisine?: string; price?: PRICE };

const fetchRestaurantsByCity = async (searchParams: SearchParams) => {
    let restaurants = [];

    const where: any = {};

    if (searchParams.city) {
        const location = {
            name: {
                equals: searchParams.city.toLowerCase(),
            },
        };
        where.location = location;
    }
    if (searchParams.cuisine) {
        const cuisine = {
            name: {
                equals: searchParams.cuisine.toLowerCase(),
            },
        };
        where.cuisine = cuisine;
    }
    if (searchParams.price) {
        const price = {
            equals: searchParams.price,
        };
        where.price = price;
    }

    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
        reviews: true,
    };

    return prisma.restaurant.findMany({
        where,
        select,
      });

    return restaurants;
}

const fetchLocations = async () => {
    return prisma.location.findMany();
};

const fetchCuisines = async () => {
    return prisma.cuisine.findMany();
};

export default async function Search({ searchParams }: { searchParams: SearchParams }) {
    const restaurants: RestaurantCardType[] = await fetchRestaurantsByCity(searchParams);
    const location = await fetchLocations();
    const cuisine = await fetchCuisines();
    console.log('vm: search: ', { searchParams });

    return (
        <>
            <Header />
            <div className="flex py-4 m-auto w-2/3 justify-between items-start">
                <SearchSideBar
                    locations={location}
                    cuisines={cuisine}
                    searchParams={searchParams}
                />
                <div className="w-5/6">
                    {restaurants.length ?
                        restaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))
                        : <p>No restaurants are found</p>}
                </div>
            </div>
        </>
    );
}