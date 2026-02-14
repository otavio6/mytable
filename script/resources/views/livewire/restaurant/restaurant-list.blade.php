<div>
    <div>

        <div class="p-6 glass rounded-[3rem] border-white/5 shadow-2xl overflow-hidden relative mb-6">
            <div
                class="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            </div>
            <div class="block sm:flex items-center justify-between relative z-10">
                <div class="w-full mb-1">
                    <div class="mb-4">
                        <h1 class="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                            <div class="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                            @lang('superadmin.menu.restaurants')
                        </h1>
                    </div>
                    @if($showRegenerateQrCodes)
                        <x-alert type="warning" class="flex justify-between">
                            <span>@lang('superadmin.domainChanged')</span>

                            <span><x-button type='button'
                                    wire:click="regenerateQrCodes()">@lang('superadmin.regenerateQrCode')</x-button></span>
                        </x-alert>
                    @endif
                    <div class="items-center justify-between block sm:flex">
                        <div class="flex items-center mb-4 sm:mb-0">
                            <form class="ltr:sm:pr-3 rtl:sm:pl-3" action="#" method="GET">
                                <label for="products-search" class="sr-only">Search</label>
                                <div class="relative w-48 sm:w-64 xl:w-96">
                                    <x-input id="menu_name" class="block w-full" type="text"
                                        placeholder="{{ __('placeholders.searchStaffmember') }}"
                                        wire:model.live.debounce.500ms="search" />
                                </div>
                            </form>

                            <button wire:click="$set('filterStatus', 'pending')"
                                class="px-4 py-2 text-[10px] font-black uppercase tracking-widest glass-button text-gray-400 hover:text-white flex items-center gap-2">
                                @lang('modules.restaurant.needApproval')
                                <span
                                    class="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-primary text-black font-black">
                                    {{ $count }}
                                </span>
                            </button>

                            @if($filterStatus !== 'all')
                                <x-danger-button class="ms-2" wire:click="$set('filterStatus', 'all')">
                                    <svg aria-hidden="true" class="w-5 h-5 -ml-1 sm:mr-1" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                    @lang('app.clearFilter')
                                </x-danger-button>
                            @endif
                        </div>


                        <x-button type='button' wire:click="$set('showAddRestaurant', true)" class="gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            @lang('modules.restaurant.addRestaurant')
                        </x-button>

                    </div>
                </div>
            </div>

            <livewire:restaurant.restaurant-table :search='$search' :filterStatus='$filterStatus'
                key='restaurant-table-{{ microtime() }}' />


        </div>



        <x-right-modal wire:model.live="showAddRestaurant">
            <x-slot name="title">
                {{ __("modules.restaurant.addRestaurant") }}
            </x-slot>

            <x-slot name="content">
                @livewire('forms.addRestaurant')
            </x-slot>
        </x-right-modal>

    </div>