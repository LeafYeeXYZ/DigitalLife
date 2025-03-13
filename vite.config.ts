import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		target: 'esnext',
		rollupOptions: {
			output: {
				manualChunks: {
					live2d: ['l2d'],
					antd: ['antd', '@ant-design/x', '@ant-design/icons'],
				},
			},
		},
	},
})
