package orders

import (
	"errors"
	"sort"
	"sync"
	"time"
)

type Status string

const (
	Pending   Status = "pending"
	InProcess Status = "in_process"
	Ready     Status = "ready"
)

type Order struct {
	ID        string    `json:"id"`
	Table     string    `json:"table"`
	Items     []string  `json:"items"`
	Status    Status    `json:"status"`
	WaiterID  string    `json:"waiterId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Store struct {
	mu     sync.RWMutex
	seq    int
	orders map[string]*Order
}

func NewStore() *Store { return &Store{orders: map[string]*Order{}} }

func (s *Store) Create(table string, items []string, waiterID string) *Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.seq++
	id := time.Now().Format("20060102150405") + "-" + itoa(s.seq)
	o := &Order{ID: id, Table: table, Items: items, Status: Pending, WaiterID: waiterID, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	s.orders[o.ID] = o
	return o
}

func (s *Store) UpdateStatus(id string, st Status) (*Order, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	o, ok := s.orders[id]
	if !ok {
		return nil, errors.New("not found")
	}
	o.Status = st
	o.UpdatedAt = time.Now()
	return o, nil
}

func (s *Store) ListAll() []*Order {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]*Order, 0, len(s.orders))
	for _, o := range s.orders {
		res = append(res, clone(o))
	}
	sort.Slice(res, func(i, j int) bool { return res[i].CreatedAt.Before(res[j].CreatedAt) })
	return res
}

func (s *Store) ListByWaiter(wid string) []*Order {
	all := s.ListAll()
	out := make([]*Order, 0)
	for _, o := range all {
		if o.WaiterID == wid {
			out = append(out, o)
		}
	}
	return out
}

func clone(o *Order) *Order { c := *o; return &c }

func itoa(i int) string { return fmtInt(i) }

// tiny no-import int→string to keep file self-contained
func fmtInt(i int) string {
	if i == 0 {
		return "0"
	}
	neg := false
	if i < 0 {
		neg = true
		i = -i
	}
	buf := [20]byte{}
	pos := len(buf)
	for i > 0 {
		pos--
		buf[pos] = byte('0' + (i % 10))
		i /= 10
	}
	if neg {
		pos--
		buf[pos] = '-'
	}
	return string(buf[pos:])
}
