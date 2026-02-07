function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className='flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors'>
      <div className='w-10 h-10 rounded-lg bg-[#1a1d2e] flex items-center justify-center border border-slate-800'>
        <Icon className='w-5 h-5 text-[#E7C9A5]' />
      </div>
      <div>
        <p className='text-[10px] uppercase font-bold text-slate-500'>
          {label}
        </p>
        <p className='text-sm text-slate-200 font-medium'>{value}</p>
      </div>
    </div>
  );
}

export default DetailRow;
