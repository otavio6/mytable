<li>
    <button type="button" @class([
        'flex items-center w-full gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group/item relative overflow-hidden',
        'glass-glow text-primary group-hover/item:shadow-[0_0_20px_rgba(245,158,11,0.2)]' => $active,
        'hover:bg-white/[0.05] text-gray-400 hover:text-white' => !$active
    ]) aria-controls="dropdown-{{ \Str::slug($name, '-', app()->getLocale()) }}"
        data-collapse-toggle="dropdown-{{ \Str::slug($name, '-', app()->getLocale()) }}">

        <div @class([
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
            'bg-primary/20 border border-primary/30' => $active,
            'bg-white/5 border border-white/5 group-hover/item:border-white/20' => !$active
        ])>
            {!! $customIcon ?? $icon !!}
        </div>

        <div class="flex-1 flex items-center justify-between opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover/sidebar:translate-x-0 overflow-hidden"
            sidebar-toggle-item>
            <span class="font-bold text-xs uppercase tracking-[0.2em] whitespace-nowrap">{{ $name }}</span>

            <svg class="w-4 h-4 transition-transform duration-300 group-aria-expanded:rotate-180" fill="currentColor"
                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
        </div>

        @if($active)
            <div
                class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            </div>
        @endif
    </button>
    <ul id="dropdown-{{ \Str::slug($name, '-', app()->getLocale()) }}" @class(['py-2 space-y-2 mt-1 px-4 border-l border-white/5 ml-7 transition-all duration-300', 'hidden' => !$active])>
        {{ $slot }}
    </ul>
</li>