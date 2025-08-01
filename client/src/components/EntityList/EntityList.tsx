import { useEffect, useState } from 'react'
import { Tabs } from '@components/Tabs'
import { Tab } from '@components/Tab'
import { HiViewGrid, HiViewList } from 'react-icons/hi'
import { useBulk } from '@hooks/useBulk'
import type { EntityListProps, ViewMode } from './EntityList.types'

export const EntityList = <T extends { id: number }>({
  title,
  fetchEntities,
  renderGridItem,
  renderListView,
  defaultView = 'grid',
  allowToggle = true,
}: EntityListProps<T>) => {
  const [entities, setEntities] = useState<T[]>([])
  const [view, setView] = useState<ViewMode>(defaultView)

  const fetchData = async () => {
    const data = await fetchEntities()
    setEntities(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { selectedIds, toggleAll, toggleOne } = useBulk(entities)

  return (
    <div className="">
      <div className="flex justify-between">
        <h3 className="text-[var(--zui-text-inverted)]">{title}</h3>
        {allowToggle && (
          <Tabs variant="elevated">
            {renderGridItem && (
              <Tab onClick={() => setView('grid')} variant="elevated">
                <HiViewGrid className="text-lg" />
              </Tab>
            )}
            {renderListView && (
              <Tab onClick={() => setView('list')} variant="elevated">
                <HiViewList className="text-lg" />
              </Tab>
            )}
          </Tabs>
        )}
      </div>

      {/* Grid or List */}
      {view === 'grid' && renderGridItem ? (
        <div className="grid w-full grid-cols-3 gap-4">
          {entities.map((item) => renderGridItem(item))}
        </div>
      ) : view === 'list' && renderListView ? (
        <div className="space-y-4">
          {renderListView(entities, selectedIds, toggleOne, toggleAll, fetchData)}
        </div>
      ) : null}
    </div>
  )
}
