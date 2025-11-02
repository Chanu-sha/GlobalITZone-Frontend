# Global IT Zone - Tech Store PWA

A modern Progressive Web Application for a tech store specializing in second-hand laptops, desktops, CCTV systems, accessories, and spare parts.

## 🚀 Features

### Frontend (React + Vite + Tailwind)
- **Mobile-First Design**: Optimized for mobile devices with responsive UI
- **PWA Support**: Installable app with offline functionality
- **Modern UI**: Beautiful gradient designs with glassmorphism effects
- **Authentication**: User registration, login, and admin access
- **Product Management**: Browse, search, and filter products
- **Order System**: Place and track orders
- **Admin Dashboard**: Complete admin panel for managing products, orders, and users
- **Real-time Updates**: Live data synchronization

### Backend (Express.js + MongoDB)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication with role-based access
- **Image Upload**: Cloudinary integration for product images
- **Database**: MongoDB with Mongoose ODM
- **Security**: Input validation, rate limiting, and security headers
- **Admin Features**: Complete admin management system

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React
- PWA Plugin

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Multer
- Express Validator
- Bcryptjs

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works offline with cached content
- **Push Notifications**: Real-time updates and alerts
- **Background Sync**: Sync data when connection is restored
- **App-like Experience**: Native app feel on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp env.example .env
```

4. **Update environment variables**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/globalitzone
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ADMIN_EMAIL=admin@globalitzone.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
```

5. **Initialize admin user**:
```bash
node scripts/initAdmin.js
```

6. **Start development server**:
```bash
npm run dev
```

## 📱 Mobile App Installation

### Android
1. Open the website in Chrome
2. Tap the "Install App" prompt
3. Follow the installation instructions

### iOS
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🎨 UI/UX Features

- **Mobile-First Design**: Optimized for mobile devices
- **Bottom Navigation**: Easy thumb navigation
- **Card-Based Layout**: Clean product display
- **Gradient Themes**: Modern visual appeal
- **Glassmorphism**: Modern UI effects
- **Smooth Animations**: Enhanced user experience
- **Dark Theme**: Easy on the eyes

## 🔐 Authentication

- **User Registration**: Create new accounts
- **User Login**: Secure authentication
- **Admin Login**: Separate admin access
- **Profile Management**: Update user information
- **Password Security**: Bcrypt hashing

## 📦 Product Management

- **Product CRUD**: Create, read, update, delete products
- **Image Upload**: Cloudinary integration
- **Category Filtering**: Filter by product categories
- **Search Functionality**: Find products quickly
- **Condition Tags**: Product condition indicators
- **Stock Management**: Track product availability

## 🛒 Order System

- **Order Placement**: Easy order creation
- **Order Tracking**: Track order status
- **Order History**: View past orders
- **Admin Management**: Manage all orders
- **Status Updates**: Real-time order updates

## 👨‍💼 Admin Dashboard

- **Product Management**: Add, edit, delete products
- **Order Management**: Process and track orders
- **User Management**: Manage user accounts
- **Analytics**: View store statistics
- **Image Upload**: Upload product images

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status (Admin)

### Users
- `GET /api/users` - Get users (Admin)
- `PUT /api/users/:id` - Update user (Admin)

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/globalitzone
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ADMIN_EMAIL=admin@globalitzone.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
```

## 📱 PWA Configuration

The app is configured as a PWA with:
- Service Worker for offline functionality
- Web App Manifest for installation
- Push notification support
- Background sync
- App-like navigation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend (Heroku/Railway)
1. Set up MongoDB Atlas
2. Configure Cloudinary
3. Set environment variables
4. Deploy the backend

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@globalitzone.com or create an issue in the repository.

---

**Global IT Zone** - Quality tech products at unbeatable prices! 🚀
