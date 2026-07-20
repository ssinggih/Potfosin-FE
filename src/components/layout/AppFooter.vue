<template>
  <footer class="border-t dark:border-gray-800">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} Portfosin. All rights reserved.
        </p>
        <div class="flex gap-6">
          <a
            href="#"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Privacy
          </a>
          <a
            href="#"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Terms
          </a>
          <a
            href="#"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
