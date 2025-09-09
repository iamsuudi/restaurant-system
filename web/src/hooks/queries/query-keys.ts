export const queryKeys = {
  all: () => ['query'],
  me: () => ['query', 'auth', 'me'],
  order: (id: number) => ['query', 'orders', 'one', { id }],
  orders: () => ['query', 'orders'],
  completedOrders: () => ['query', 'orders', 'completed'],
  menu: (id: number) => ['query', 'menu', 'one', { id }],
  allmenu: () => ['query', 'menu'],
  log: (id: string) => ['query', 'logs', 'one', { id }],
  logs: (page: number, rows: number) => ['query', 'logs', { page }, { rows }],
  analytics: (target: string) => ['query', 'analytics', { target }],
}
