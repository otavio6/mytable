<li>
    <a href="{{ $link }}" wire:navigate @class([
        'flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group/item relative overflow-hidden',
        'glass-glow text-primary group-hover/item:shadow-[0_0_20px_rgba(245,158,11,0.2)]' => $active,
        'hover:bg-white/[0.05] text-gray-400 hover:text-white' => !$active
    ])>

        <div @class([
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
            'bg-primary/20 border border-primary/30' => $active,
            'bg-white/5 border border-white/5 group-hover/item:border-white/20' => !$active
        ])>
            {!! $customIcon ?? $icon !!}
        </div>

        <span
            class="font-bold text-xs uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover/sidebar:translate-x-0 overflow-hidden"
            sidebar-toggle-item>
            {{ $name }}
        </span>

        @if($active)
            <div
                class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            </div>
        @endif
    </a>
</li>