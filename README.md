# MONGODB BACKUP SERVICE

## 1. Vấn đề
Trong khi vận hành hệ thống, việc mất mát dữ liệu là điều không thể tránh khỏi.
Có những nguyên nhân chính như sau:
- Xung đột khi Migration data
- Hệ thống bị hack
- Dev mớ ngủ xoá nhầm data

Khi đó, việc khôi phục data rất tốn thời gian => Cần phải backup data hàng ngày và mỗi khi lên version mới.

Có nhiều giải pháp để giải quyết vấn đề này, như sử dụng dịch vụ backup data của bên cung cấp Server. Tuy nhiên, chúng thường tốn phí. Vậy làm sao để vừa free (do tận dụng tài nguyên hiện có), vừa đảm bảo tính an toàn dữ liệu?

## 2. Giải pháp
Trước khi đưa ra giải pháp thì cùng nhìn lại bài toán của công ty mình gặp phải:

- Lượng data của công ty mình không lớn, chủ yếu là lưu thông tin về user, app, không lưu các thông tin về transaction, nếu dùng dịch vụ bên ngoài thì lãng phí
- Hệ thống được maintain thường xuyên, việc di dời server khi có big update là điều không thể tránh khỏi
- Từng sử dụng shell script để backup data, tuy nhiên mỗi lần di dời hệ thống (trên 3 môi trường dev, staging, production) thì việc settup lại shell script khá cực.
- Không sử dụng các dịch vụ cloud database mà dùng giải pháp cây nhà lá vườn - deploy dưới dạng services

=> Mình sẽ cần dev một service vừa có khả năng truy cập vào mongodb service để chạy backup toàn bộ các database, vừa có khả năng đẩy file backup lên kho lưu trữ (mình chọn google drive vì nó free)

## 3. Các tính năng
- Tự động backup database theo thời gian chỉ định và đẩy lên Google Drive
- Cho phép Force Backup
- Cho phép tuỳ chỉnh tự động xoá các file backup trên Local và Drive sau thời gian chỉ định
- Cho phép gửi thông báo tình trạng backup qua Telegram

## 4. Cách tích hợp
### 4.1. Lấy thông tin cần thiết từ Google
- Google Client Mail
- Google Private Key
- Google Folder ID

### 4.2. Local test
Tạo 1 file .env ngang hàng với thư mục src và khởi tạo các biến môi trường:
```
GOOGLE_CLIENT_MAIL=""
GOOGLE_PRIVATE_KEY=""
GOOGLE_FOLDER_ID=""
IS_FORCE_BACKUP=1
```
Lưu ý: File .env chỉ hoạt động với Local, khi lên Production sẽ bị loại bỏ.

### 4.3. Production
Tạo file docker-compose.yml như sau
```
version: '3.8'
services:
  mongodb_backup:
    image: vtuanjs/mongodb_backup:1.0.0
    networks:
      - net
    environment:
      NODE_ENV: 'production'
      GOOGLE_CLIENT_MAIL: ${GOOGLE_CLIENT_MAIL}
      GOOGLE_PRIVATE_KEY: ${GOOGLE_PRIVATE_KEY}
      GOOGLE_FOLDER_ID: ${GOOGLE_FOLDER_ID}
      MONGO_ROOT_USER: ${MONGO_ROOT_USER}
      MONGO_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_HOST: ${MONGO_HOST}
      IS_FORCE_BACKUP: ${IS_FORCE_BACKUP}
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == worker
      resources:
        limits:
          cpus: '0.70'
          memory: '700M'
        reservations:
          memory: '4M'
networks:
  net:
    driver: overlay
    attachable: true
```

Cấu hình bên trên là cấu hình tối thiểu để app có thể hoạt động. Bạn có thể tuỳ chỉnh thêm các tính năng nhờ Biến môi trường trong phần 5.

Lưu ý:
```
Biến MONGO_ROOT_USER: Là user có quyền root hoặc quyền đọc tất cả database
Folder lưu trữ file backup cần được chia sẽ với Client Mail
```

## 5. Các biến môi trường

`MONGO_ROOT_USER`: User

`MONGO_ROOT_PASSWORD`: Password

`MONGO_HOST`: Địa chỉ IP/ Tên container/ Tên service của MongoDB

`MONGO_PORT`: Port

---

`IS_AUTO_BACKUP`: Cho phép tự động Backup hay không, Default: 1

`CRON_JOB_TIME`: Cấu hình thời gian Backup theo khung giờ GMT +7. Default '00 00 * * *' tương ứng 0:00 AM

`IS_FORCE_BACKUP`: Backup ngay khi khởi động app. Default 0 

`IS_REMOVE_OLD_LOCAL_BACKUP`: Có cho phép xoá bản backup trên server khi hết hạn không? Default 1

`KEEP_LAST_DAYS_OF_LOCAL_BACKUP`: Thời gian lưu trữ bản Local Backup. Default 2

`IS_REMOVE_OLD_DRIVE_BACKUP`: Có cho phép xoá bản backup trên drive khi hết hạn không? Default 1 

`KEEP_LAST_DAYS_OF_DRIVE_BACKUP`: Thời hạn lưu trữ bản Drive Backup: Default 7

---

`GOOGLE_CLIENT_MAIL`: Mail được cấp quyền sử dụng API (Do google phát sinh khi tạo Google User Service)

`GOOGLE_PRIVATE_KEY`: Key được phát sinh khi tạo Google User Service

`GOOGLE_FOLDER_ID`: Thư mục để lưu trữ file backup. Lưu ý: Thư mục này cần được chia sẽ với Google Client Email

---

`IS_ALLOW_SEND_TELEGRAM_MESSAGE`: Có cho phép gửi tin nhắn qua Telegram không

`TELEGRAM_CHANEL_ID`: Cấu hình gửi thông báo backup qua telegram

`TELEGRAM_BOT_TOKEN`

`TELEGRAM_MESSAGE_LEVELS`: Cấu hình loại tin nhắn sẽ gửi qua telegram. Mặc định: "info error"
