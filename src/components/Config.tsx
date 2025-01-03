import { useState, type ReactNode } from 'react'
import { Segmented } from 'antd'
import { ConfigMain } from './ConfigMain.tsx'
import { ConfigService } from './ConfigService.tsx'
import { ConfigLayout } from './ConfigLayout.tsx'
import { ConfigOthers } from './ConfigOthers.tsx'

const PAGES: { label: string, element: ReactNode, isDefault?: boolean }[] = [
  { label: '推理', element: <ConfigMain />, isDefault: true },
  { label: '语音', element: <ConfigService /> },
  { label: '自定义', element: <ConfigLayout /> },
  { label: '其他', element: <ConfigOthers /> },
]

export function Config() {

  const [page, setPage] = useState<ReactNode>(PAGES.find(({ isDefault }) => isDefault)!.element)

  return (
    <section className='w-full h-full flex flex-col justify-center items-center'>
      <Segmented
        className='border border-blue-900 p-1 absolute top-[4.5rem]'
        defaultValue={PAGES.find(({ isDefault }) => isDefault)!.label}
        options={PAGES.map(({ label }) => ({ label, value: label }))}
        onChange={(value) => setPage(PAGES.find(({ label }) => label === value)!.element)}
      />
      {page}
    </section>
  )
}
