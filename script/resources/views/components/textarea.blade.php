@props(['disabled' => false])

<textarea {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'bg-white/[0.03] border-white/10 dark:text-gray-300 focus:border-primary/50 focus:ring-primary/50 rounded-xl shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-gray-600', 'rows' => 5]) !!}>
</textarea>