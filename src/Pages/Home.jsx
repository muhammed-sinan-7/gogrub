
import Hero from '../Components/Hero/Hero';
import SpecialFoods from '../Components/Special/SpecialFoods';
// import Category from '../Components/Category/Category';
import CategoryButton from '../Components/Category/CategoryButton';
import Chinese from '../Components/Chinese/Chinese';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';
import Offer from '../Components/Offer/Offer'
import { useRef } from 'react';
import About from '../Components/About/About';
function Home() {

 const offerRef = useRef(null); // ref to Offer section

  const scrollToOffer = () => {
    offerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (

    <div>
      <Navbar onOffersClick={scrollToOffer}/>
      <Hero />
      <CategoryButton />
      <SpecialFoods />
      <Chinese />
      <Offer  ref={offerRef}/>
      <About/>
      <Footer />
    </div>

  );
};


export default Home
