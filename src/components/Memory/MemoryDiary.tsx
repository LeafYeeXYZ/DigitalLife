import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'
import { Collapse, Tag, Tooltip } from 'antd'
import { getTime } from '../../lib/utils.ts'

export function MemoryDiary() {
  const { longTermMemory, selfName } = useMemory()
  const { vectorDimension } = useVectorApi()

  return (
    <div className='w-full bg-white max-h-full border border-blue-900 rounded-md overflow-auto transition-all'>
      <Collapse
        style={{ border: 'none' }}
        size='small'
        items={
          longTermMemory?.length !== 0
            ? longTermMemory.map((item) => {
                return {
                  key: item.uuid,
                  label: (
                    <div className='grid grid-cols-[1fr_auto] gap-2'>
                      <div className='text-nowrap text-ellipsis overflow-hidden'>
                        {item.title}
                      </div>
                      <div>
                        <Tooltip
                          color='blue'
                          title={`只有经过索引的记忆才能被${selfName}回忆. 在设置->嵌入服务设置中设置相关内容后, 记忆更新时会自动索引`}
                        >
                          {item.vector &&
                          item.vector.length === vectorDimension ? (
                            <Tag color='blue' style={{ marginInline: 0 }}>
                              已索引
                            </Tag>
                          ) : (
                            <Tag color='red' style={{ marginInline: 0 }}>
                              未索引
                            </Tag>
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  ),
                  children: (
                    <div className='w-full flex flex-col gap-2'>
                      <div>{item.summary}</div>
                      <div>
                        开始时间: <Tag>{getTime(item.startTime)}</Tag>
                      </div>
                      <div>
                        结束时间: <Tag>{getTime(item.endTime)}</Tag>
                      </div>
                    </div>
                  ),
                }
              })
            : [{ key: 'none', label: '没有记忆', children: <div></div> }]
        }
      />
    </div>
  )
}
