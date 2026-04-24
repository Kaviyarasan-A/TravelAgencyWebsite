import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiTarget = env.VITE_API_URL || 'http://localhost:5000';

    return {
        plugins: [react()],
        server: {
            port: 5173,
            open: true,
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                    // Disable connection pooling: http-proxy's default Agent
                    // reuses TCP connections and occasionally picks a socket
                    // the upstream has already closed, producing a bogus 500.
                    agent: false,
                },
            },
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
            chunkSizeWarningLimit: 1000,
        },
    };
});
