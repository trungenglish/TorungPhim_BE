import slugify from 'slugify';

export function toSlug(text: string): string {
  if (!text) return '';

  return slugify(text, {
    lower: true, // Chuyển thành chữ thường
    strict: true, // Xóa các ký tự đặc biệt (ngoại trừ '-')
    locale: 'vi', // 🇻🇳 BẬT CHẾ ĐỘ TIẾNG VIỆT
    remove: /[*+~.()'"!:@]/g, // (Tùy chọn) Xóa thêm các ký tự này
  });
}
