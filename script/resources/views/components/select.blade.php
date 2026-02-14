@props(['disabled' => false])

@if (!isset($append))
  <select {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'bg-white/[0.03] border-white/10 dark:text-gray-300 focus:border-primary/50 focus:ring-primary/50 rounded-xl shadow-inner backdrop-blur-md transition-all duration-300']) !!}>
    {{ $slot }}
  </select>
@else
  <div
    class="flex items-center glass rounded-xl overflow-hidden border-white/10 group focus-within:border-primary/50 transition-all duration-300">
    <select {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'bg-transparent border-none focus:ring-0 flex-1 dark:text-gray-300']) !!}>
      {{ $slot }}
    </select>

    <span
      class="inline-flex items-center px-4 py-2 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest border-l border-white/10">
      {{ $append }}
    </span>
  </div>
@endif