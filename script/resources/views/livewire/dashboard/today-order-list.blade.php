<div>
    <h1 class="text-xl font-black tracking-tight text-white mb-6 flex items-center gap-3 px-2">
        <div class="w-2 h-6 bg-primary rounded-full"></div>
        @lang('modules.order.todayOrder')
    </h1>

    <div class="grid grid-cols-1 gap-4 sm:gap-6">
        @forelse ($orders as $item)
            <x-order.order-card :order='$item' wire:key='order-{{ $item->id . microtime() }}' />
        @empty
            <div
                class="group flex flex-col justify-center gap-4 items-center border border-white/5 h-48 font-medium glass rounded-[2rem] p-6 text-gray-500 shadow-xl">
                <div class="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                @lang('messages.waitingTodayOrder')
            </div>
        @endforelse
    </div>
</div>