# Women's Day Celebration 💖

Ứng dụng web chúc mừng Ngày Phụ Nữ Việt Nam (20/10) với popup slideshow đặc biệt cho Minh Quân.

## ✨ Tính năng

- 🎉 **Popup chúc mừng** với 5 step tương tác
- 📸 **Slideshow tự động** với 23 hình ảnh
- 💌 **Lời chúc cá nhân hóa** cho Minh Quân
- 📸 **Kỉ niệm đặc biệt** với grid layout đẹp mắt
- 💖 **Animations mượt mà** và responsive design
- 🎨 **Giao diện lãng mạn** với tông màu hồng

## 🚀 Deploy trên GitHub Pages

### Cách 1: Tự động Deploy (Khuyến nghị)

1. **Fork repository này** hoặc tạo repository mới
2. **Push code lên GitHub**
3. **Vào Settings > Pages** của repository
4. **Chọn Source**: GitHub Actions
5. **Mỗi khi push code lên branch `main`**, GitHub Actions sẽ tự động:
   - Build Angular app
   - Deploy lên GitHub Pages
   - Cập nhật website tự động

### Cách 2: Deploy thủ công

```bash
# Clone repository
git clone <your-repo-url>
cd women-day-celebration

# Install dependencies
npm install

# Build cho GitHub Pages
npm run build -- --configuration=github-pages

# Deploy thủ công (nếu cần)
npx angular-cli-ghpages --dir=dist/women-day-celebration/browser
```

## 🔧 Cấu hình

### GitHub Pages Settings
- **Source**: GitHub Actions
- **Branch**: gh-pages (tự động tạo)
- **URL**: `https://<username>.github.io/women-day-celebration/`

### Build Configuration
- **Base Href**: `/women-day-celebration/`
- **Output Directory**: `dist/women-day-celebration/browser`
- **Assets**: Tự động copy từ `public/Image/`

## 📁 Cấu trúc Project

```
women-day-celebration/
├── .github/workflows/     # GitHub Actions
├── src/app/components/    # Angular components
│   ├── heart-animation/   # Animation trái tim
│   └── message-popup/     # Popup chúc mừng
├── public/Image/          # Hình ảnh slideshow
├── .nojekyll             # Tắt Jekyll processing
└── angular.json          # Cấu hình Angular
```

## 🎨 Customization

### Thay đổi tên người nhận
Sửa trong `src/app/components/message-popup/message-popup.html`:
```html
<h2 class="popup-name">Gửi đến [Tên của bạn]</h2>
```

### Thêm hình ảnh mới
1. Thêm hình vào `public/Image/`
2. Cập nhật array `images` trong `message-popup.ts`

### Thay đổi lời chúc
Sửa array `messages` trong `message-popup.ts`

## 🌐 Live Demo

Website sẽ được deploy tự động tại:
`https://<username>.github.io/women-day-celebration/`

## 📝 Lưu ý

- ✅ **Tự động deploy** khi push code lên `main`
- ✅ **Responsive design** cho mọi thiết bị
- ✅ **SEO friendly** với Angular Universal
- ✅ **Fast loading** với optimized build

## 💝 Made with Love

Dự án được tạo với ❤️ để chúc mừng Ngày Phụ Nữ Việt Nam 20/10

---

**Happy Women's Day! 💖✨**