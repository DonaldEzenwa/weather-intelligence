import { render, screen } from "@testing-library/react";
import WeatherDashboard from "./WeatherDashboard";
test("renders accessible location search", () => { render(<WeatherDashboard />); expect(screen.getByRole("form", { name: /weather search/i })).toBeInTheDocument(); expect(screen.getByLabelText(/search by city/i)).toBeInTheDocument(); });
