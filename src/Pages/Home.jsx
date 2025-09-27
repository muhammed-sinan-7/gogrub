
import Hero from '../Components/Hero/Hero';
import SpecialFoods from '../Components/Special/SpecialFoods';
// import Category from '../Components/Category/Category';
import CategoryButton from '../Components/Category/CategoryButton';
import Chinese from '../Components/Chinese/Chinese';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';
import Offer from '../Components/Offer/Offer'
function Home() {



  return (

    <div>
      <Navbar/>
      <Hero />
      <CategoryButton />
      <SpecialFoods />
      <Chinese />
      <Offer/>
      <Footer />
    </div>

  );
};


export default Home
