export async function openLink(url: string): Promise<void> {
	if (url) {
		const link = document.createElement('a')
		link.href = url
		link.target = '_blank'
		link.rel = 'noopener'
		link.click()
	}
}
