<nav
  class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl glass rounded-full px-6 py-2 border-white/10 shadow-2xl transition-all duration-500">
  <div class="px-0 py-0">
    <div class="flex items-center justify-between">

      <div class="flex items-center justify-start">
        <button id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar"
          class="p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <svg id="toggleSidebarMobileHamburger" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"></path>
          </svg>
          <svg id="toggleSidebarMobileClose" class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
        <a href="{{ route('dashboard') }}" class="flex ltr:ml-2 rtl:mr-2 items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span class="font-black text-primary text-xl">M</span>
          </div>

          @if (restaurant()->show_logo_text)
          <span class="self-center text-xl font-bold tracking-tighter text-gray-200 hidden lg:block">{{ Str::limit(restaurant()->name, 10) }}</span>
          @endif
        </a>

        <div class="flex gap-3 ml-6 ltr:border-l rtl:border-r border-white/10 pl-6">
          @if (in_array('Order', restaurant_modules()) && user_can('Show Order') && restaurant()->hide_new_orders == 0)
            @livewire('dashboard.todayOrders')
          @endif

          @if (in_array('Reservation', restaurant_modules()) && user_can('Show Reservation') && restaurant()->hide_new_reservations == 0 && in_array('Table Reservation', restaurant_modules()))
            @livewire('dashboard.todayReservations')
          @endif

          @if (in_array('Waiter Request', restaurant_modules()) && user_can('Manage Waiter Request') && restaurant()->hide_new_waiter_request == 0)
            @livewire('dashboard.activeWaiterRequests')
          @endif
        </div>
      </div>

      <div class="flex items-center gap-3">
        @if (languages()->count() > 1)
         @livewire('settings.languageSwitcher')
        @endif

        <button onclick="openFullscreen();" type="button"
        class="text-gray-400 hover:text-white glass-interactive rounded-xl p-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>

        <!-- Profile -->
        <div class="flex items-center">
            <button type="button"
              class="flex items-center gap-3 glass-interactive pl-1 pr-3 py-1 rounded-2xl border-white/5 active:scale-95 transition-all"
              id="user-menu-button-2" aria-expanded="false" data-dropdown-toggle="dropdown-2">
              <img class="w-9 h-9 rounded-xl object-cover shadow-lg border border-white/10" src="{{ auth()->user()->profile_photo_path ? asset_url_local_s3(auth()->user()->profile_photo_path):auth()->user()->profile_photo_url }}" alt="user photo">
              <div class="hidden md:flex flex-col items-start leading-none gap-1">
                <span class="text-xs font-bold text-gray-200">{{ auth()->user()->name }}</span>
                <span class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Admin</span>
              </div>
            </button>
          
          <!-- Dropdown menu -->
          <div
            class="z-50 hidden my-4 text-base list-none glass border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-white/5 overflow-hidden"
            id="dropdown-2">
            <div class="px-5 py-4 bg-white/5 border-b border-white/5" role="none">
              <p class="text-sm font-bold text-gray-200" role="none">
                {{ auth()->user()->name }}
              </p>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1" role="none">
                {{ auth()->user()->email }}
              </p>
            </div>
            <ul class="py-2" role="none">
              <li>
                <a href="{{ route('profile.show') }}" wire:navigate
                  class="flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
                  role="menuitem">@lang('menu.profile')</a>
              </li>

              @if (user_can('Manage Settings') && in_array('Settings', restaurant_modules()))
              <li>
                <a href="{{ route('settings.index') }}" wire:navigate
                  class="flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
                  role="menuitem">@lang('menu.settings')</a>
              </li>
              @endif

              <li class="border-t border-white/5 mx-2 my-1"></li>

              <li>
                <form method="POST" action="{{ route('logout') }}" x-data>
                  @csrf
                  <a href="{{ route('logout') }}" @click.prevent="$root.submit();"
                    class="flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    role="menuitem">@lang('menu.signOut')</a>
                </form>
              </li>
            </ul>
          </div>
        </div>


        <!-- Profile -->
        <div class="flex items-center w-8">
          <div class="flex w-full">
            <button type="button"
              class="inline-flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
              id="user-menu-button-3" aria-expanded="false" data-dropdown-toggle="dropdown-3"
              data-dropdown-placement="left-end">
              <span class="sr-only">Open user menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                width="24" height="24" viewBox="0 0 512 512" xml:space="preserve">
                <path
                  d="M112 441.328h288v32H112zM0 38.672v352h200v34.656h112v-34.656h200v-352zm216 323.25v-16h80v16zm248-35.25H48v-240h416z"
                  style="fill:currentColor" />
              </svg>

            </button>
          </div>
          <!-- Dropdown menu -->
          <div
            class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            id="dropdown-3">

            <ul class="py-1" role="none">
              @if (in_array('Customer Display', restaurant_modules()))
                <li>
                  <a href="{{ route('customer.display') }}" target="_blank"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">@lang('menu.customerDisplay')</a>
                </li>
                <li>
                  <a href="{{ route('customer.order-board') }}" target="_blank"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">@lang('modules.order.customerOrderBoard')</a>
                </li>
              @endif

              @if (module_enabled('Kiosk') && in_array('Kiosk', restaurant_modules()))
                <li>
                  <a href="{{ route('kiosk.restaurant', restaurant()->hash) . '?branch=' . branch()->unique_hash }}"
                    target="_blank"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem">@lang('kiosk::modules.menu.kiosk')</a>
                </li>
              @endif

            </ul>
          </div>
        </div>



      </div>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const btn = document.getElementById('customer-display-dropdown-button');
          const menu = document.getElementById('customer-display-dropdown-menu');
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('hidden');
          });
          document.addEventListener('click', function (e) {
            if (!btn.contains(e.target)) {
              menu.classList.add('hidden');
            }
          });
        });
      </script>

    </div>
  </div>
  </div>
</nav>