import { useRef, useState } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { ChatCheck } from './ChatCheck.tsx'
import { ChatText } from './ChatText.tsx'
import { ChatVoice } from './ChatVoice.tsx'

export function ChatIndex({ to }: { to: 'text' | 'voice' }) {
	const [ready, setReady] = useState<boolean>(false)
	const shortTermMemory = useMemory((state) => state.shortTermMemory)
	const shortTermMemoryRef = useRef<ShortTermMemory[]>(shortTermMemory)

	return (
		<section className='w-full overflow-hidden flex flex-col justify-center items-center'>
			{ready ? (
				to === 'text' ? (
					<ChatText shortTermMemoryRef={shortTermMemoryRef} />
				) : (
					<ChatVoice shortTermMemoryRef={shortTermMemoryRef} />
				)
			) : (
				<ChatCheck
					setReady={setReady}
					shortTermMemoryRef={shortTermMemoryRef}
				/>
			)}
		</section>
	)
}
