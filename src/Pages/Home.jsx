import React from 'react'
import Hero from '../Components/Hero/Hero';
import SpecialFoods from '../Components/Special/SpecialFoods';
import Category from '../Components/Category/Category';
import CategoryButton from '../Components/Category/CategoryButton';
import Chinese from '../Components/Chinese/Chinese';
function Home() {



  return (

    <div>

      <Hero />
      <CategoryButton/>
      <SpecialFoods/>
      <Chinese/>
    </div>

  );
};


export default Home
