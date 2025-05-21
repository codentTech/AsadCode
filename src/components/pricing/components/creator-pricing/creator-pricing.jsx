import { Check } from 'lucide-react';

export default function CreatorPricing() {
  const creatorData = [
    {
      platform: 'CleerCut',
      commission: '2.9% (payment processing only)',
      details: 'Only fee is standard Stripe processing. No commission taken.',
      isBest: true,
    },
    {
      platform: 'Ainfluencer',
      commission: '20% from creators',
      details: 'Transparent — clearly stated on the platform.',
    },
    {
      platform: 'Collabstr',
      commission: '15% from creators',
      details: 'Transparent — flat cut per deal.',
    },
    {
      platform: 'Influencer.co',
      commission: 'Commission taken (undisclosed)',
      details: 'Not fully transparent, but confirmed that they take a cut.',
    },
    {
      platform: 'Trend.io',
      commission: 'Likely ~30%+ margin',
      details: 'Charges brands ~$100–$150 per video, creators report payouts far lower.',
    },
    {
      platform: 'Billo',
      commission: 'Likely ~30–40% margin',
      details: 'Known for large spread between what brands pay and what creators earn.',
    },
    {
      platform: 'Creator.co',
      commission: 'Not disclosed; likely backend margin',
      details: 'Commission not disclosed; may build margin into creator payouts.',
    },
    {
      platform: 'Social Cat',
      commission: 'Not disclosed; may take margin',
      details: 'Commission not disclosed; may build margin into creator pricing.',
    },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-xl text-sm md:text-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-indigo-50">
            <th className="py-6 px-2 lg:px-6 text-left text-sm md:text-lg font-semibold text-indigo-900 border-b border-indigo-100">
              Platform
            </th>
            <th className="py-6 px-2 lg:px-6 text-left text-sm md:text-lg font-semibold text-indigo-900 border-b border-indigo-100">
              Creator Commission
            </th>
            <th className="py-6 px-2 lg:px-6 text-left text-sm md:text-lg font-semibold text-indigo-900 border-b border-indigo-100">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {creatorData.map((platform, index) => (
            <tr
              key={platform.platform}
              className={`${platform.isBest ? 'bg-indigo-50' : index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'} 
                hover:bg-indigo-100/50 transition-colors duration-150`}
            >
              <td className="py-4 px-2 lg:px-6 text-left border-b border-indigo-100">
                <div className="font-medium text-gray-600">
                  {platform.platform}
                  {platform.isBest && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Check className="w-3 h-3 mr-1" /> Best Value
                    </span>
                  )}
                </div>
              </td>
              <td
                className={`py-4 px-2 lg:px-6 text-left border-b border-indigo-100 ${platform.isBest ? 'font-bold text-indigo-800' : 'text-gray-600'}`}
              >
                {platform.commission}
              </td>
              <td className="py-4 px-2 lg:px-6 text-left text-gray-700 border-b border-indigo-100">
                {platform.details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
