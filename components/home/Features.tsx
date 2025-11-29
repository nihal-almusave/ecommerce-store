import { Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      description: 'On all orders over $75.00',
    },
    {
      icon: RotateCcw,
      title: 'MONEY BACK',
      description: '30 days money back guarantee',
    },
    {
      icon: Headphones,
      title: 'FRIENDLY SUPPORT',
      description: 'Team always ready for you',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

