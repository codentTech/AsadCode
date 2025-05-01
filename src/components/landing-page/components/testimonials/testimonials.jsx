import { Avatar } from "@mui/material";

function Testimonials() {
  const avatar =
    "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg";

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            What Our Clients Say
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600 rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Hear from the brands that have transformed their creator marketing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 relative">
            <div className="absolute -top-6 left-8 text-indigo-600 text-6xl">
              "
            </div>
            <div className="relative">
              <p className="italic text-gray-600 mb-6 pt-4">
                "CleerCut transformed how we manage our creator partnerships.
                The platform saved us countless hours and improved our ROI
                significantly."
              </p>
              <div className="flex items-center">
                <div className="relative">
                  <Avatar
                    src={avatar}
                    alt="Sam Waters"
                    className="h-12 w-12 border-4 border-white shadow-md ring-2 ring-primary mr-4"
                  >
                    S
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">
                    Marketing Director, FashionBrand
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 relative">
            <div className="absolute -top-6 left-8 text-indigo-600 text-6xl">
              "
            </div>
            <div className="relative">
              <p className="italic text-gray-600 mb-6 pt-4">
                "Finding the right creators used to be a guessing game. With
                CleerCut's advanced filters and verified reviews, we now partner
                with perfect matches every time."
              </p>
              <div className="flex items-center">
                <Avatar
                  src={avatar}
                  alt="Sam Waters"
                  className="h-12 w-12 border-4 border-white shadow-md ring-2 ring-primary mr-4"
                >
                  S
                </Avatar>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">
                    Influencer Lead, TechGiant
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 relative">
            <div className="absolute -top-6 left-8 text-indigo-600 text-6xl">
              "
            </div>
            <div className="relative">
              <p className="italic text-gray-600 mb-6 pt-4">
                "The escrow payment system and automated contracts have
                eliminated all the usual headaches. Our legal team is thrilled
                with how seamless everything is!"
              </p>
              <div className="flex items-center">
                <Avatar
                  src={avatar}
                  alt="Sam Waters"
                  className="h-12 w-12 border-4 border-white shadow-md ring-2 ring-primary mr-4"
                >
                  S
                </Avatar>
                <div>
                  <p className="font-semibold">Jessica Williams</p>
                  <p className="text-sm text-gray-500">COO, StartupSuccess</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
