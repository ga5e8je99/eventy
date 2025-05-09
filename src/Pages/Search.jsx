import AllEvents from "../Components/AllEvents";
import ChatPot from "../Components/ChatPot";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function Search() {
  return (
    <>
      <Navbar activePage={"Search"} />
      <ChatPot />
      <AllEvents/>
      <Footer />
    </>
  );
}
