import React from 'react';

export const metadata = {
  title: 'Our Doctors | Maisha Care',
  description: 'Meet our experienced medical professionals at Maisha Care',
};

export default function DoctorsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Medical Professionals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example doctor card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="aspect-square rounded-full bg-gray-200 mb-4">
            {/* Doctor image placeholder */}
          </div>
          <h2 className="text-xl font-semibold mb-2">Dr. Jane Smith</h2>
          <p className="text-gray-600 mb-2">Cardiologist</p>
          <p className="text-sm text-gray-500">
            Specializing in cardiovascular health with over 10 years of experience.
          </p>
        </div>
        
        {/* Add more doctor cards as needed */}
      </div>
    </main>
  );
}