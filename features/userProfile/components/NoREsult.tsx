interface Props {
  title: string;
  description: string;
}

const NoResults = ({ title, description }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-300'>
      <div className='relative w-40 h-40 mb-8'>
        {/* Background Glow */}
        <div className='absolute inset-0 bg-slate-800/20 rounded-full blur-3xl' />

        {/* The Icon Container */}
        <div className='relative flex items-center justify-center w-full h-full bg-[#1A1D2E] rounded-full border border-white/5 shadow-2xl'>
          <div className='relative w-20 h-28 bg-[#252941] rounded-xl border-2 border-slate-700/50 flex flex-col items-center justify-center gap-3'>
            {/* The "X" Badge */}
            <div className='absolute -top-3 w-10 h-10 bg-[#E7C9A5] rounded-full flex items-center justify-center border-4 border-[#1A1D2E] shadow-lg'>
              <span className='text-[#1A1D2E] font-bold text-xl leading-none'>
                ×
              </span>
            </div>

            {/* Decorative Lines */}
            <div className='space-y-2 mt-4'>
              <div className='h-1.5 w-12 bg-slate-600/50 rounded-full' />
              <div className='h-1.5 w-8 bg-slate-600/30 rounded-full mx-auto' />
            </div>
          </div>
        </div>
      </div>

      <h3 className='text-2xl font-bold text-white mb-2'>{title}</h3>
      <p className='text-slate-400 max-w-xs leading-relaxed'>{description}</p>
    </div>
  );
};

export default NoResults;
