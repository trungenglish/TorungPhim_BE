# Tô Rùng Phim Backend

Backend API cho ứng dụng xem phim Tô Rùng Phim, được xây dựng với NestJS framework.

## 🚀 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (khuyến nghị sử dụng pnpm thay vì npm)

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd torung-phim-be
```

### 2. Cài đặt pnpm (nếu chưa có)
```bash
npm install -g pnpm
```

### 3. Cài đặt dependencies
```bash
pnpm install
```

## 🛠️ Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `pnpm start` | Chạy ứng dụng ở production mode |
| `pnpm start:dev` | Chạy ứng dụng ở development mode với hot reload |
| `pnpm start:debug` | Chạy ứng dụng ở debug mode |
| `pnpm build` | Build ứng dụng |
| `pnpm lint` | Chạy ESLint để kiểm tra code quality |
| `pnpm test` | Chạy unit tests |
| `pnpm test:watch` | Chạy tests với watch mode |
| `pnpm test:cov` | Chạy tests và tạo coverage report |
| `pnpm test:e2e` | Chạy end-to-end tests |
| `pnpm format` | Format code với Prettier |

## 🏃‍♂️ Cách chạy dự án

### Development Mode (Khuyến nghị)
```bash
pnpm start:dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Production Mode
```bash
# Build trước
pnpm build

# Chạy production
pnpm start:prod
```

### Debug Mode
```bash
pnpm start:debug
```

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env` trong thư mục gốc:

```env
# Port cho ứng dụng (mặc định: 3000)
PORT=3000

# Database configuration (khi có)
# DATABASE_URL=
# DB_HOST=
# DB_PORT=
# DB_USERNAME=
# DB_PASSWORD=
# DB_DATABASE=

# JWT configuration (khi có authentication)
# JWT_SECRET=
# JWT_EXPIRES_IN=

# Other configurations
# NODE_ENV=development
```

## 🧪 Testing

### Chạy tất cả tests
```bash
pnpm test
```

### Chạy tests với coverage
```bash
pnpm test:cov
```

### Chạy E2E tests
```bash
pnpm test:e2e
```

## 📝 Code Quality

### Linting
```bash
pnpm lint
```

### Format code
```bash
pnpm format
```

## 🛠️ NestJS CLI - Tạo Module Tự Động

Dự án đã cài đặt sẵn **NestJS CLI** để tạo các module, controller, service tự động.

### 📋 Yêu cầu
- **@nestjs/cli**: Đã cài đặt sẵn trong `devDependencies`
- **@nestjs/schematics**: Đã cài đặt sẵn

### 🚀 Các lệnh CLI cơ bản

#### 1. Tạo Module đơn lẻ
```bash
# Tạo module
nest g module <tên-module>

# Ví dụ
nest g module users
nest g module auth
nest g module movies
```

#### 2. Tạo Controller
```bash
# Tạo controller
nest g controller <tên-controller>

# Ví dụ
nest g controller users
nest g controller auth
```

#### 3. Tạo Service
```bash
# Tạo service
nest g service <tên-service>

# Ví dụ
nest g service users
nest g service auth
```

#### 4. Tạo Resource hoàn chỉnh (Khuyến nghị)
```bash
# Tạo module + controller + service + DTOs + entity cùng lúc
nest g resource <tên-resource>

# Ví dụ cho dự án phim
nest g resource movies
nest g resource categories
nest g resource actors
nest g resource directors
nest g resource users
nest g resource auth
```

#### 5. Tạo các component khác
```bash
# Tạo Guard
nest g guard <tên-guard>

# Tạo Interceptor
nest g interceptor <tên-interceptor>

# Tạo Middleware
nest g middleware <tên-middleware>

# Tạo Pipe
nest g pipe <tên-pipe>

# Tạo Filter
nest g filter <tên-filter>

# Tạo Decorator
nest g decorator <tên-decorator>
```

### ⚙️ Tùy chọn nâng cao

#### Tạo trong thư mục cụ thể
```bash
nest g module modules/users
nest g controller modules/users
nest g resource modules/movies
```

#### Không tạo test file
```bash
nest g module users --no-spec
nest g resource movies --no-spec
```

#### Xem trước (không tạo file thật)
```bash
nest g module users --dry-run
```

### 📁 Cấu trúc sau khi tạo Resource

Khi chạy `nest g resource movies`, sẽ tạo ra:

```
src/modules/movies/
├── dto/
│   ├── create-movie.dto.ts
│   └── update-movie.dto.ts
├── entities/
│   └── movie.entity.ts
├── movies.controller.ts
├── movies.module.ts
├── movies.service.ts
├── movies.controller.spec.ts
└── movies.service.spec.ts
```

### 🎯 Ví dụ thực tế cho dự án

```bash
# Tạo các module chính cho ứng dụng phim
nest g resource movies --no-spec
nest g resource categories --no-spec
nest g resource actors --no-spec
nest g resource directors --no-spec
nest g resource users --no-spec
nest g resource auth --no-spec

# Tạo các guard và pipe
nest g guard auth
nest g pipe validation
nest g interceptor logging
```

## 🏗️ Cấu trúc dự án

```
src/
├── app.module.ts          # Root module
├── main.ts               # Application entry point
├── common/               # Shared utilities
│   ├── decorators/       # Custom decorators
│   ├── dto/             # Common DTOs
│   ├── guards/          # Global guards
│   ├── interceptors/    # Global interceptors
│   ├── pipes/           # Global pipes
│   └── filters/         # Global filters
├── modules/             # Feature modules
│   ├── movies/          # Movies module
│   ├── users/           # Users module
│   ├── auth/            # Authentication module
│   └── ...
└── config/              # Configuration files
```

## 🚀 Deployment

### Docker (nếu có Dockerfile)
```bash
docker build -t torung-phim-be .
docker run -p 3000:3000 torung-phim-be
```

### Manual deployment
1. Build ứng dụng: `pnpm build`
2. Chạy production: `pnpm start:prod`

## 🔍 API Documentation

Khi có Swagger/OpenAPI documentation, sẽ có sẵn tại:
- Development: `http://localhost:3000/api`
- Production: `http://your-domain.com/api`

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

Dự án này sử dụng license UNLICENSED.

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên repository hoặc liên hệ team phát triển.

---

**Lưu ý**: Đây là dự án đang trong quá trình phát triển. Một số tính năng có thể chưa hoàn thiện.
