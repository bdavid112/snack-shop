import clsx from 'clsx'

import React, { Children, cloneElement, useState } from 'react'
import { TabsProps } from './Tabs.types'
import { TabProps } from '@components/Tab'

export function Tabs({ variant = 'outlined', children, className }: TabsProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  const items = Children.toArray(children).map((child, idx) => {
    if (!React.isValidElement<TabProps>(child)) return child
    return cloneElement(child, {
      active: idx === activeIdx,
      onClick: (e) => {
        child.props.onClick?.(e)
        setActiveIdx(idx)
      },
    })
  })

  return <div className={clsx('zui-tabs', `zui-tabs--${variant}`, className)}>{items}</div>
}
