import { Check } from 'lucide-react';

export default function BrandPricing() {
  const brandData = [
    {
      platform: 'CleerCut',
      price: '$525–$699',
      contract: 'No',
      details: 'Flexible monthly plans or pay-as-you-go service fees.',
      isBest: true,
    },
    {
      platform: 'GRIN',
      price: '$2,000–$4,000',
      contract: 'Yes',
      details: 'Requires annual commitment; built for e-commerce brands.',
    },
    {
      platform: 'CreatorIQ',
      price: '$2,000–$3,000',
      contract: 'Yes',
      details: 'Enterprise-level; minimum $36,000/year contract.',
    },
    {
      platform: 'Aspire',
      price: 'From $1,200',
      contract: 'Yes',
      details: 'Annual contract required.',
    },
    {
      platform: 'Tagger',
      price: '$2,500–$4,000',
      contract: 'Yes',
      details: 'Requires annual contract.',
    },
    {
      platform: 'Upfluence',
      price: '$800–$1,200',
      contract: 'Yes',
      details: '12-month minimum commitment; focuses on affiliate and influencer management.',
    },
    {
      platform: 'Traackr',
      price: 'From $2,500',
      contract: 'Yes',
      details: 'Enterprise tool with required annual contracts.',
    },
    {
      platform: 'Klear',
      price: 'From $2,000',
      contract: 'Yes',
      details: 'Custom pricing based on brand size; annual contracts typical.',
    },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-xl text-sm md:text-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-indigo-50">
            <th className="py-6 px-2 lg:px-6 text-left text-md font-semibold text-indigo-900 border-b border-indigo-100">
              Platform
            </th>
            <th className="py-6 px-2 lg:px-6 text-left text-md font-semibold text-indigo-900 border-b border-indigo-100">
              Monthly Price (Estimated)
            </th>
            <th className="py-6 px-6 text-left text-md font-semibold text-indigo-900 border-b border-indigo-100">
              Annual Contract Required
            </th>
            <th className="py-6 px-2 lg:px-6 text-left text-md font-semibold text-indigo-900 border-b border-indigo-100">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {brandData.map((platform, index) => (
            <tr
              key={platform.platform}
              className={`${platform.isBest ? 'bg-indigo-50' : index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'} 
                  hover:bg-indigo-100/50 transition-colors duration-150`}
            >
              <td className="py-4 px-2 lg:px-6 text-left border-b border-indigo-100">
                <div className="flex font-medium text-gray-600">
                  {platform.platform}
                  {platform.isBest && (
                    <span className="ml-2 whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <Check className="w-3 h-3 mr-1" /> Best Value
                    </span>
                  )}
                </div>
              </td>
              <td
                className={`py-4 px-2 lg:px-6 text-left border-b border-indigo-100 ${platform.isBest ? 'font-bold text-indigo-800' : 'text-gray-600'}`}
              >
                {platform.price}
              </td>
              <td
                className={`py-4 px-2 lg:px-6 text-left border-b border-indigo-100 ${
                  platform.contract === 'No' ? 'text-green-600' : 'text-red-600'
                } ${platform.isBest ? 'font-bold' : ''}`}
              >
                {platform.contract}
              </td>
              <td className="py-4 px-6 text-left text-gray-700 border-b border-indigo-100">
                {platform.details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
