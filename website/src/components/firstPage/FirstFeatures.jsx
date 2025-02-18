import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faFlask, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      icon: faGraduationCap,
      title: "Industry-Aligned Programs",
      text: "Cutting-edge curriculum designed with industry experts",
    },
    {
      icon: faFlask,
      title: "Research Facilities",
      text: "State-of-the-art laboratories and research centers",
    },
    {
      icon: faGlobe,
      title: "Global Opportunities",
      text: "International collaborations and exchange programs",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12">
          Our Features
        </h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6 mx-auto">
                <FontAwesomeIcon icon={feature.icon} size="lg" className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-center text-gray-600">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
