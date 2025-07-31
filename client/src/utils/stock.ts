export const getStockInfo = (stock: number) => {
  if (stock > 10) {
    return {
      text: '> 10 left',
      color: 'text-[var(--zui-state-success)]',
    }
  }

  if (stock > 5) {
    return {
      text: `${stock} left`,
      color: 'text-[var(--zui-state-warning)]',
    }
  }

  if (stock > 0) {
    return {
      text: `only ${stock} left`,
      color: 'text-[var(--zui-state-error)]',
    }
  }

  return {
    text: 'out of stock :(',
    color: 'text-[var(--zui-state-error)]',
  }
}
