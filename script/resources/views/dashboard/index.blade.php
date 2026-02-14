@extends('layouts.app')

@section('content')

    <div class="px-6 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div>
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">@lang('menu.dashboard')</h1>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mt-1">Visão Geral do seu Restaurante</p>
        </div>

        <div class="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-white/5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="text-primary"
                viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                <path
                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>

            <span class="text-sm font-bold text-gray-300">
                {{ now()->timezone(timezone())->translatedFormat('l, d M, h:i A') }}
            </span>
        </div>
    </div>

    <x-banner />
    @php
        $restaurantModules = restaurant_modules();
        $restaurantId = user()->restaurant_id;

        // Get stats for all three modules
        $orderStats = branch() ? getRestaurantOrderStats(branch()->id) : null;
        $staffStats = getRestaurantStaffStats($restaurantId);
        $menuItemStats = getRestaurantMenuItemStats($restaurantId);

        // Check which limits are exceeded
        $orderLimitExceeded = in_array('Order', $restaurantModules) && $orderStats && !$orderStats['unlimited'] && $orderStats['current_count'] >= $orderStats['order_limit'];
        $staffLimitExceeded = in_array('Staff', $restaurantModules) && $staffStats && !$staffStats['unlimited'] && $staffStats['current_count'] >= $staffStats['staff_limit'];
        $menuItemLimitExceeded = in_array('Menu Item', $restaurantModules) && $menuItemStats && !$menuItemStats['unlimited'] && $menuItemStats['current_count'] >= $menuItemStats['menu_items_limit'];

        $anyLimitExceeded = $orderLimitExceeded || $staffLimitExceeded || $menuItemLimitExceeded;
    @endphp

    @if($anyLimitExceeded)
<div class="px-6 py-6 space-y-4">
    @if($orderLimitExceeded)
    <div class="p-6 glass-glow border-red-500/20 rounded-[2rem] bg-red-500/5 shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="flex items-start gap-5 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-black tracking-tight text-white uppercase italic">
                    @lang('modules.order.orderLimitExceeded')
                </h3>
                <p class="mt-1 text-sm font-bold text-red-200/60 uppercase tracking-widest">
                    @lang('modules.order.orderLimitExceededMessage', [
                        'current' => number_format($orderStats['current_count']),
                        'limit' => number_format($orderStats['order_limit'])
                    ])
                </p>
                <div class="mt-4">
                    <a href="{{ route('pricing.plan') }}" class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        Fazer Upgrade Agora
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    @endif

    @if($staffLimitExceeded)
    <div class="p-6 glass-glow border-red-500/20 rounded-[2rem] bg-red-500/5 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="flex items-start gap-5 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-black tracking-tight text-white uppercase italic">
                    @lang('modules.staff.staffLimitExceeded')
                </h3>
                <p class="mt-1 text-sm font-bold text-red-200/60 uppercase tracking-widest">
                    @lang('modules.staff.staffLimitExceededMessage', [
                        'current' => number_format($staffStats['current_count']),
                        'limit' => number_format($staffStats['staff_limit'])
                    ])
                </p>
                <div class="mt-4">
                    <a href="{{ route('pricing.plan') }}" class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        Fazer Upgrade Agora
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    @endif

    @if($menuItemLimitExceeded)
    <div class="p-6 glass-glow border-red-500/20 rounded-[2rem] bg-red-500/5 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="flex items-start gap-5 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-black tracking-tight text-white uppercase italic">
                    @lang('modules.menu.menuItemLimitExceeded')
                </h3>
                <p class="mt-1 text-sm font-bold text-red-200/60 uppercase tracking-widest">
                    @lang('modules.menu.menuItemLimitExceededMessage', [
                        'current' => number_format($menuItemStats['current_count']),
                        'limit' => number_format($menuItemStats['menu_items_limit'])
                    ])
                </p>
                <div class="mt-4">
                    <a href="{{ route('pricing.plan') }}" class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        Fazer Upgrade Agora
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
    @endif

    <div class="grid lg:grid-cols-3">

        <div class="sm:col-span-2 p-4">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-xl dark:text-white my-2 px-4">
                @lang('modules.dashboard.todayStats')</h1>

            <div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">

                @if (user_can('Show Order'))
                    @livewire('dashboard.todayOrderCount')
                @endif

                @if (user_can('Show Reports'))
                    @livewire('dashboard.todayEarnings')
                @endif

                @if (user_can('Show Customer'))
                    @livewire('dashboard.todayCustomerCount')
                @endif

                @if (user_can('Show Reports'))
                    @livewire('dashboard.averageDailyEarning')
                @endif

            </div>

            @if (user_can('Show Reports'))
                <div class="grid w-full grid-cols-1 gap-4 py-4">
                    @livewire('dashboard.weeklySalesChart')
                </div>
            @endif


            @if (user_can('Show Reports'))
                <div class="grid grid-cols-1 gap-4 mb-10">
                    @livewire('dashboard.todayPaymentMethodEarnings')

                    @livewire('dashboard.today-menu-item-earnings')

                    @livewire('dashboard.today-table-earnings')
                </div>
            @endif

        </div>

        <div class="p-4">
            @if (user_can('Show Order'))
                @livewire('dashboard.todayOrderList')
            @endif

        </div>
    </div>

@endsection