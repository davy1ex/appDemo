# Frontend Architecture - Feature-Sliced Design (FSD)

This project follows the Feature-Sliced Design methodology for better code organization, maintainability, and scalability.

## 📁 Project Structure

```
src/
├── app/                    # Application layer
│   ├── main.tsx           # Application entry point
│   ├── styles.css         # Global styles (Tailwind)
│   └── providers/         # App-level providers
├── pages/                  # Page components
│   ├── lockers/           # Lockers management page
│   ├── qr-scan/           # QR code scanning page
│   └── training/          # Training completion page
├── widgets/                # Composite UI blocks
│   ├── locker-card/       # Individual locker card
│   ├── locker-grid/       # Grid of lockers
│   └── locker-toolbar/    # Toolbar with controls
├── features/               # Business features
│   ├── client-search/     # Client search functionality
│   └── qr-scan/           # QR code scanning
├── entities/               # Business entities
│   ├── locker/            # Locker entity
│   │   ├── model/         # Store, hooks, types
│   │   └── api/           # API services
│   ├── user/              # User entity
│   │   ├── model/         # Store, hooks, types
│   │   └── api/           # API services
│   └── client/            # Client entity
│       └── model/         # Store, hooks, types
└── shared/                 # Shared resources
    ├── api/               # API utilities
    ├── ui/                # Reusable UI components
    ├── types/             # TypeScript types
    └── lib/               # Utility functions
```

## 🏗️ Architecture Principles

### 1. **Feature-Sliced Design Layers**
- **app**: Application configuration and providers
- **pages**: Route-level components
- **widgets**: Composite UI blocks
- **features**: Business features
- **entities**: Business entities
- **shared**: Shared resources

### 2. **State Management with Zustand**
- **Entity Stores**: Each entity has its own Zustand store
- **Actions**: Business logic separated into custom hooks
- **Type Safety**: Full TypeScript support

### 3. **API Layer**
- **Service Classes**: Organized API services per entity
- **Mock Services**: Development mock implementations
- **Type Safety**: Typed API responses

## 🔧 Key Features

### **State Management**
```typescript
// Entity stores with Zustand
const useLockerStore = create<LockerStore>((set) => ({
  lockers: [],
  userLocker: null,
  loading: false,
  error: null,
  // ... actions
}));

// Custom hooks for business logic
const { loadLockers, reserveLocker, releaseLocker } = useLockerActions();
```

### **API Services**
```typescript
// Organized API services
export class LockerApiService {
  static async getLockers(token: string, sex?: 'male' | 'female'): Promise<Locker[]> {
    // Implementation
  }
}
```

### **Component Architecture**
```typescript
// Widgets combine entities and features
export const LockerGrid = ({ lockers, onReserve, onRelease }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lockers.map(locker => (
        <LockerCard key={locker.id} locker={locker} />
      ))}
    </div>
  );
};
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Component Styling**: Scoped to components
- **Design System**: Consistent colors and spacing

## 🚀 Benefits

1. **Scalability**: Easy to add new features and entities
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components and utilities
4. **Type Safety**: Full TypeScript coverage
5. **Testing**: Isolated business logic
6. **Performance**: Optimized with Zustand

## 📱 Usage Examples

### **Using Entity Stores**
```typescript
import { useLockerStore } from '../entities/locker/model/store';
import { useLockerActions } from '../entities/locker/model/hooks';

const { lockers, loading, error } = useLockerStore();
const { loadLockers, reserveLocker } = useLockerActions();
```

### **Using Features**
```typescript
import { ClientSearch } from '../features/client-search';

<ClientSearch onClientSelect={handleClientSelect} />
```

### **Using Widgets**
```typescript
import { LockerGrid } from '../widgets/locker-grid';

<LockerGrid lockers={lockers} onReserve={handleReserve} />
```

This architecture provides a solid foundation for building scalable, maintainable React applications with clear separation of concerns and excellent developer experience.