
import Hero from '../Components/Hero/Hero';

// import Category from '../Components/Category/Category';
import CategoryButton from '../Components/Category/CategoryButton';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';

import { useRef } from 'react';
import About from '../Components/About/About';
import FeaturedFoods from '../Components/Featured/FeaturedFoods';

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
      <FeaturedFoods/>
      {/* <PromoBanner/> */}
      <About/>
      <Footer />
    </div>

  );
};


export default Home
