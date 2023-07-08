import { PrismaClient, PRICE, Cuisine, Location } from '@prisma/client';
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
}

const fetchRestaurantsByCity = async (city: string | undefined) => {
    let restaurants = [];
    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
    };

    if (!city) {
        restaurants = await prisma.restaurant.findMany({ select })
    } else {
        restaurants = await prisma.restaurant.findMany({
            where: {
                location: {
                    name: {
                        equals: city?.toLocaleLowerCase()
                    }
                }
            },
            select
        });
    }

    return restaurants;
}

const fetchLocations = async () => {
    return prisma.location.findMany();
};

const fetchCuisines = async () => {
    return prisma.cuisine.findMany();
};

export default async function Search({ searchParams }: { searchParams: { city: string } }) {
    const restaurants: RestaurantCardType[] = await fetchRestaurantsByCity(searchParams.city);
    const location = await fetchLocations();
    const cuisine = await fetchCuisines();
    console.log('vm: search: ', { restaurants });

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