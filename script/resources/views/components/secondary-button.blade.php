<button {{ $attributes->merge(['type' => 'button', 'class' => 'inline-flex items-center px-6 py-2.5 glass-button rounded-xl font-bold uppercase tracking-wider text-[10px] text-gray-400 hover:text-white transition ease-in-out duration-150']) }} wire:loading.attr="disabled" wire:target="{{ $target ?? 'submitForm' }}"
    wire:loading.class.remove="bg-gray-50 dark:bg-gray-700" wire:loading.class="bg-gray-50 dark:bg-gray-700">
    {{ $slot }}
</button>