import { Link } from "react-router-dom"
import { Users, Award, Clock, Heart } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About ShopVista</h1>
        <p className="text-gray-600">
          We're on a mission to provide high-quality products at affordable prices while delivering an exceptional
          shopping experience.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2020, ShopVista began with a simple idea: to create a shopping platform that puts customers first.
            What started as a small online store has grown into a comprehensive marketplace offering thousands of
            products across multiple categories.
          </p>
          <p className="text-gray-600 mb-4">
            Our team is passionate about curating the best products from around the world and making them accessible to
            everyone. We believe in quality, affordability, and exceptional customer service.
          </p>
          <p className="text-gray-600">
            Today, we serve customers across the country and continue to expand our offerings to meet the evolving needs
            of our community.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="https://cart-mart.netlify.app/img/about/a6.jpg"
            alt="ShopVista Team"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Customer First</h3>
            <p className="text-gray-600">
              We prioritize our customers' needs and strive to exceed their expectations in every interaction.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality</h3>
            <p className="text-gray-600">
              We carefully select each product to ensure it meets our high standards for quality and durability.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Efficiency</h3>
            <p className="text-gray-600">
              We value your time and work diligently to ensure fast processing, shipping, and customer support.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">
              We believe in giving back and supporting the communities where our customers and team members live.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Founder & CEO",
              image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
            },
            {
              name: "Michael Chen",
              role: "Head of Product",
              image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            },
            {
              name: "Emily Rodriguez",
              role: "Customer Experience",
              image: "https://images.pexels.com/photos/3841338/pexels-photo-3841338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            },
            {
              name: "David Kim",
              role: "Operations Manager",
              image: "https://images.pexels.com/photos/2072453/pexels-photo-2072453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            },
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border">
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full aspect-square object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore our wide range of products and discover why thousands of customers choose ShopVista for their shopping
          needs.
        </p>
        <Link
          to="/products"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default AboutPage
