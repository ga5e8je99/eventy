import { Box, Container } from "@mui/material";
import Cart from "../Components/Cart";
import EventCategories from "../Components/EventCategories";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Slider from "../Components/Slider";
import Statistics from "../Components/Statistics ";
import FavEvent from "../Components/FavEvent";
import ChatPot from "../Components/ChatPot";
import TopRite from "../Components/TopRite";

export default function Home() {
  return (
    <div style={{}}>
      <Navbar activePage={"Home"} />
      <Slider />
      <EventCategories />
      <ChatPot />

      <TopRite />
      <FavEvent />
      <Footer />
    </div>
  );
}
