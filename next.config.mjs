/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/",
				has: [
					{
						type: "host",
						value: "formulario.expoia.com.co",
					},
				],
				destination: "/cuestionario-empresas-huila",
			},
		];
	},
};

export default nextConfig;