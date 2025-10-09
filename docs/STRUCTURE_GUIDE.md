# 📁 Cấu trúc Folder Dự án Tô Rùng Phim Backend

Tài liệu này mô tả chi tiết cấu trúc folder và mục đích sử dụng của từng thư mục trong dự án NestJS.

## 🏗️ Cấu trúc tổng quan

```
torung-phim-be/
├── 📁 docs/                    # Tài liệu dự án
├── 📁 src/                     # Source code chính
├── 📁 test/                    # End-to-end tests
├── 📁 node_modules/            # Dependencies (tự động tạo)
├── 📄 .github/                 # GitHub Actions CI/CD
├── 📄 package.json             # Dependencies & scripts
├── 📄 pnpm-lock.yaml          # Lock file cho pnpm
├── 📄 tsconfig.json           # TypeScript config
├── 📄 tsconfig.build.json     # Build config
├── 📄 nest-cli.json           # NestJS CLI config
├── 📄 eslint.config.mjs       # ESLint config
├── 📄 Dockerfile              # Docker configuration
└── 📄 README.md               # Tài liệu dự án
```

---

## 📂 Chi tiết từng thư mục

### 🎯 **src/** - Source Code Chính
Thư mục chứa toàn bộ source code của ứng dụng NestJS.

```
src/
├── 📄 main.ts                  # Entry point của ứng dụng
├── 📄 app.module.ts           # Root module
├── 📄 app.controller.ts       # Root controller
├── 📄 app.service.ts          # Root service
├── 📁 modules/                # Business logic modules
├── 📁 common/                 # Shared components
├── 📁 config/                 # Configuration files
└── 📁 shared/                 # Shared utilities
```

#### **📄 main.ts**
- **Mục đích**: Entry point của ứng dụng NestJS
- **Chức năng**: 
  - Khởi tạo NestJS application
  - Cấu hình middleware (helmet, CORS)
  - Start server
- **Ví dụ**: `await app.listen(process.env.PORT ?? 3000)`

#### **📄 app.module.ts**
- **Mục đích**: Root module của ứng dụng
- **Chức năng**:
  - Import các modules khác
  - Cấu hình global providers
  - Định nghĩa cấu trúc ứng dụng

---

### 🧩 **src/modules/** - Business Logic Modules
Chứa các modules xử lý business logic chính của ứng dụng.

```
modules/
├── 📁 auth/                   # Authentication module
├── 📁 users/                  # User management
├── 📁 movies/                 # Movie management
├── 📁 categories/             # Category management
├── 📁 comments/               # Comment system
└── 📁 uploads/                # File upload handling
```

#### **Cấu trúc một module điển hình:**
```
auth/
├── 📄 auth.module.ts          # Module definition
├── 📄 auth.controller.ts      # HTTP endpoints
├── 📄 auth.service.ts         # Business logic
├── 📄 auth.guard.ts           # Authentication guard
├── 📁 dto/                    # Data Transfer Objects
│   ├── 📄 login.dto.ts
│   └── 📄 register.dto.ts
├── 📁 strategies/             # Passport strategies
│   └── 📄 jwt.strategy.ts
└── 📁 tests/                  # Unit tests
    └── 📄 auth.service.spec.ts
```

---

### 🔧 **src/common/** - Shared Components
Chứa các thành phần được chia sẻ across toàn bộ ứng dụng.

```
common/
├── 📁 decorators/             # Custom decorators
│   ├── 📄 roles.decorator.ts  # Role-based access
│   ├── 📄 current-user.decorator.ts
│   └── 📄 public.decorator.ts
├── 📁 dto/                    # Common DTOs
│   ├── 📄 pagination.dto.ts
│   ├── 📄 response.dto.ts
│   └── 📄 base.dto.ts
├── 📁 exceptions/             # Custom exceptions
│   ├── 📄 business.exception.ts
│   ├── 📄 validation.exception.ts
│   └── 📄 not-found.exception.ts
├── 📁 filters/                # Exception filters
│   ├── 📄 http-exception.filter.ts
│   └── 📄 all-exceptions.filter.ts
├── 📁 guards/                 # Route guards
│   ├── 📄 jwt-auth.guard.ts
│   ├── 📄 roles.guard.ts
│   └── 📄 throttle.guard.ts
├── 📁 interceptors/           # Request/Response interceptors
│   ├── 📄 logging.interceptor.ts
│   ├── 📄 transform.interceptor.ts
│   └── 📄 cache.interceptor.ts
├── 📁 middleware/             # Custom middleware
│   ├── 📄 logger.middleware.ts
│   ├── 📄 cors.middleware.ts
│   └── 📄 rate-limit.middleware.ts
├── 📁 pipes/                  # Validation & transformation pipes
│   ├── 📄 validation.pipe.ts
│   ├── 📄 parse-int.pipe.ts
│   └── 📄 file-size.pipe.ts
└── 📁 utils/                  # Utility functions
    ├── 📄 string.util.ts
    ├── 📄 date.util.ts
    ├── 📄 crypto.util.ts
    └── 📄 file.util.ts
```

#### **Mục đích từng thư mục:**

**🔖 decorators/**
- Tạo custom decorators cho metadata
- Ví dụ: `@Roles('admin')`, `@Public()`, `@CurrentUser()`

**📦 dto/**
- Data Transfer Objects cho validation
- Định nghĩa structure của request/response data

**⚠️ exceptions/**
- Custom exception classes
- Định nghĩa business logic exceptions

**🛡️ filters/**
- Exception filters để handle errors
- Transform exceptions thành HTTP responses

**🔒 guards/**
- Route protection và authorization
- Kiểm tra permissions trước khi execute endpoints

**🔄 interceptors/**
- Transform data trước/sau khi xử lý
- Logging, caching, response transformation

**⚙️ middleware/**
- Request preprocessing
- Logging, CORS, rate limiting

**🔧 pipes/**
- Data validation và transformation
- Parse và validate input data

**🛠️ utils/**
- Helper functions và utilities
- Pure functions không phụ thuộc vào framework

---

### ⚙️ **src/config/** - Configuration
Chứa các file cấu hình cho ứng dụng.

```
config/
├── 📄 database.config.ts      # Database configuration
├── 📄 jwt.config.ts          # JWT configuration
├── 📄 app.config.ts          # App configuration
├── 📄 redis.config.ts        # Redis configuration
└── 📄 upload.config.ts       # File upload configuration
```

#### **Mục đích:**
- Centralize tất cả configuration
- Environment-specific settings
- Type-safe configuration với validation

---

### 🤝 **src/shared/** - Shared Services & Constants
Chứa các services và constants được chia sẻ.

```
shared/
├── 📁 constants/              # Application constants
│   ├── 📄 app.constants.ts   # App-wide constants
│   ├── 📄 error.constants.ts # Error messages
│   ├── 📄 pagination.constants.ts
│   └── 📄 file.constants.ts  # File upload constants
└── 📁 services/               # Shared services
    ├── 📄 logger.service.ts   # Logging service
    ├── 📄 cache.service.ts    # Caching service
    ├── 📄 email.service.ts    # Email service
    ├── 📄 storage.service.ts  # File storage service
    └── 📄 notification.service.ts
```

#### **Mục đích:**

**📊 constants/**
- Định nghĩa constants để tránh magic numbers/strings
- Centralize configuration values

**🔧 services/**
- Shared business services
- Services không thuộc về module cụ thể nào

---

### 🧪 **test/** - End-to-End Tests
Chứa các E2E tests cho ứng dụng.

```
test/
├── 📄 app.e2e-spec.ts         # Main E2E test file
├── 📄 jest-e2e.json          # Jest E2E configuration
├── 📁 fixtures/               # Test data
├── 📁 helpers/                # Test utilities
└── 📁 mocks/                  # Mock data
```

#### **Mục đích:**
- Integration tests
- API endpoint testing
- Database integration tests
- Full application flow testing

---

### 📚 **docs/** - Documentation
Chứa tài liệu dự án.

```
docs/
├── 📄 STRUCTURE_FOLDER.md     # Cấu trúc folder (file này)
├── 📄 API.md                 # API documentation
├── 📄 DEPLOYMENT.md          # Deployment guide
├── 📄 CONTRIBUTING.md        # Contributing guidelines
└── 📁 diagrams/              # Architecture diagrams
```

---

### 🔧 **Configuration Files**

#### **📄 package.json**
- Dependencies và devDependencies
- Scripts cho development, build, test
- Project metadata

#### **📄 tsconfig.json**
- TypeScript compiler configuration
- Path mapping và module resolution

#### **📄 nest-cli.json**
- NestJS CLI configuration
- Build options và schematics

#### **📄 eslint.config.mjs**
- ESLint rules và configuration
- Code quality standards

#### **📄 Dockerfile**
- Docker container configuration
- Multi-stage build setup

---

## 🎯 **Nguyên tắc tổ chức**

### 1. **Separation of Concerns**
- Mỗi module có responsibility riêng biệt
- Business logic tách biệt với infrastructure

### 2. **DRY (Don't Repeat Yourself)**
- Shared components trong `common/` và `shared/`
- Reusable services và utilities

### 3. **Scalability**
- Module structure dễ mở rộng
- Clear boundaries giữa các layers

### 4. **Maintainability**
- Consistent naming conventions
- Clear folder structure
- Comprehensive documentation

### 5. **Testability**
- Easy to mock dependencies
- Clear separation of concerns
- Dedicated test folders

---

## 🚀 **Best Practices**

### **Naming Conventions**
- **Files**: `kebab-case.ts` (VD: `user-service.ts`)
- **Classes**: `PascalCase` (VD: `UserService`)
- **Methods/Variables**: `camelCase` (VD: `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (VD: `MAX_FILE_SIZE`)

### **File Organization**
- Một class per file
- Related files trong cùng folder
- Index files cho clean imports

### **Import Order**
1. Node modules
2. Third-party libraries
3. Internal modules (absolute imports)
4. Relative imports
5. Type-only imports

### **Module Structure**
```typescript
// Module file structure
@Module({
  imports: [/* other modules */],
  controllers: [/* controllers */],
  providers: [/* services, guards, etc. */],
  exports: [/* exported providers */],
})
```

---

## 📝 **Khi nào tạo thư mục mới?**

### **Tạo module mới khi:**
- Có business logic độc lập
- Cần nhiều files liên quan
- Có thể reuse ở nơi khác

### **Tạo thư mục trong common khi:**
- Component được sử dụng ở nhiều nơi
- Không thuộc về module cụ thể
- Là utility hoặc helper function

### **Tạo service trong shared khi:**
- Service được dùng across modules
- Infrastructure service (logging, cache, etc.)
- Third-party integrations

---

**📌 Lưu ý**: Cấu trúc này được thiết kế để scale và maintain dễ dàng. Khi dự án phát triển, có thể cần điều chỉnh cấu trúc phù hợp với requirements cụ thể.
