import MealItem from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {};
export default function Meals() {

    const { data: meals, error, isLoading } = useHttp('http://localhost:3000/meals', requestConfig, []);

    if (isLoading) {
        return (
            <p className="center">Fetching meals...</p>
        );
    }

    if (error) {
        return (<Error title="Failed to fetch meals" message={error} />)
    }
    return (
        <section>
            <ul id="meals">
                {meals.map((meal) =>
                    <MealItem key={meal.id} meal={meal} />
                )}
            </ul>
        </section>
    );
}