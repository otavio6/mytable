<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center justify-center px-6 py-2.5 glass-button-danger rounded-xl font-bold uppercase tracking-wider text-[10px] transition ease-in-out duration-150']) }}>
    {{ $slot }}
</button>