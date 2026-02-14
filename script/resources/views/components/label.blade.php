@props(['value', 'required' => false])

<label {{ $attributes->merge(['class' => 'block font-black text-[10px] uppercase tracking-widest text-gray-400 ltr:text-left rtl:text-right mb-2']) }}>
    {{ $value ?? $slot }}
    @if ($required)
        <span class="text-red-500">*</span>
    @endif
</label>