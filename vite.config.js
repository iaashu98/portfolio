import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Ensure that public directory is copied
        copyPublicDir: true,
    },
    server: {
        open: true,
    }
});
