package menu

import "sync"

type Item struct {
	ID    string  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type Store struct {
	mu    sync.RWMutex
	items []Item
}

func NewStore() *Store { return &Store{} }

func (s *Store) GetAll() []Item {
	s.mu.RLock()
	defer s.mu.RUnlock()
	cp := make([]Item, len(s.items))
	copy(cp, s.items)
	return cp
}

func (s *Store) ReplaceAll(items []Item) []Item {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = make([]Item, len(items))
	copy(s.items, items)
	return s.GetAll()
}
