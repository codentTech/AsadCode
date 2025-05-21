'use client';

import CustomButton from '@/common/components/custom-button/custom-button.component';
import useBackgroundEffect from '@/common/hooks/use-background-effect.hook';

export default function CreatorBrandPrompt({ handleSelectMode }) {
  const { position } = useBackgroundEffect();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full bg-indigo-100 blur-xl opacity-60"
          style={{
            left: `calc(10% + ${position.x}px)`,
            top: `calc(30% + ${position.y}px)`,
            transition: 'all 0.3s ease',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-indigo-200 blur-xl opacity-50"
          style={{
            right: `calc(15% + ${position.x * -1}px)`,
            bottom: `calc(20% + ${position.y * -1}px)`,
            transition: 'all 0.5s ease',
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-indigo-300 blur-xl opacity-40"
          style={{
            left: `calc(50% + ${position.y}px)`,
            top: `calc(15% + ${position.x}px)`,
            transition: 'all 0.4s ease',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl text-center">
        {/* 404 Error Title */}
        <h1 className="text-xl md:text-4xl lg:text-6xl font-bold text-indigo-600 mb-2">
          Are you a creator or a brand?
        </h1>

        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-16 bg-indigo-600 rounded-full mx-2" />
          <div className="h-1 w-24 bg-indigo-400 rounded-full mx-2" />
          <div className="h-1 w-16 bg-indigo-600 rounded-full mx-2" />
        </div>
        <div className="w-auto flex items-center justify-center gap-3">
          <CustomButton
            text="I am a creator"
            className="w-full max-w-[250px] whitespace-nowrap btn-outline py-6 text-sm md:text-2xl font-bold"
            onClick={() => handleSelectMode(true)}
          />
          <CustomButton
            text="I am a brand"
            className="w-full max-w-[250px] btn-primary py-6 text-sm md:text-2xl font-bold"
            onClick={() => handleSelectMode(false)}
          />
        </div>
      </div>
    </div>
  );
}
