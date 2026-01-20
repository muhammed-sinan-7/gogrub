import React from 'react';
import { Utensils, Clock, Award, Heart, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const stats = [
    { icon: Utensils, label: 'Dishes Available', value: '500+' },
    { icon: Users, label: 'Happy Customers', value: '50K+' },
    { icon: MapPin, label: 'Locations', value: '25+' },
    { icon: Award, label: 'Years of Service', value: '3+' }
  ];
  const navigate = useNavigate()
  const features = [
    {
      icon: Clock,
      title: 'Quick Delivery',
      description: 'Get your favorite meals delivered hot and fresh to your doorstep in no time.'
    },
    {
      icon: Heart,
      title: 'Quality Food',
      description: 'We partner with the best restaurants to ensure every bite is delicious.'
    },
    {
      icon: Award,
      title: 'Trusted Service',
      description: 'Three years of excellence in bringing joy to food lovers everywhere.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-orange-500">GoGrub</span>
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your favorite meals, delivered with love. For three years, we've been connecting food lovers 
            with the best restaurants in town, making every meal a delightful experience.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-orange-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-orange-100 p-4 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20 border-2 border-orange-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded three years ago with a simple mission: to make delicious food accessible to everyone. 
                What started as a small platform has grown into a thriving community of food lovers and 
                restaurant partners.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At GoGrub, we believe that great food brings people together. That's why we've carefully 
                curated a diverse selection of over 500 dishes from local restaurants, ensuring there's 
                something for every craving and occasion.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to quality, speed, and customer satisfaction has made us a trusted name 
                in food delivery, serving thousands of happy customers every day.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl h-80 flex items-center justify-center">
                <Utensils className="w-32 h-32 text-white opacity-20" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border-2 border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose GoGrub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300"
                >
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join thousands of satisfied customers and experience the GoGrub difference today.
          </p>
          <button
          onClick={() => navigate('/products')} className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors duration-300 shadow-lg">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}