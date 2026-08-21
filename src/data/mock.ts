export type Role = 'Requester' | 'LabManager' | 'Admin'
export type ResourceStatus = 'available' | 'maintenance' | 'inactive'

export interface Resource {
  id: number
  name: string
  code: string
  type: 'Phòng lab' | 'Thiết bị'
  department: string
  status: ResourceStatus
  location: string
  image: string
  description: string
  specs: Record<string, string>
}

export const resources: Resource[] = [
  {
    id: 1,
    name: 'Phòng Lab Vi mạch A1',
    code: 'LAB-A1',
    type: 'Phòng lab',
    department: 'Khoa Điện - Điện tử',
    status: 'available',
    location: 'Tòa C, tầng 3',
    image:
      'https://images.unsplash.com/photo-1581093458791-9d42e3c4a896?auto=format&fit=crop&w=900&q=80',
    description: 'Phòng thực hành thiết kế vi mạch, đo kiểm và phát triển hệ thống nhúng.',
    specs: { 'Sức chứa': '32 người', 'Diện tích': '86 m²', 'Nguồn điện': '3 pha, 45 kVA' },
  },
  {
    id: 2,
    name: 'Máy CNC Haas VF-2',
    code: 'CNC-02',
    type: 'Thiết bị',
    department: 'Khoa Cơ khí',
    status: 'maintenance',
    location: 'Xưởng B, khu 2',
    image:
      'https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&w=900&q=80',
    description: 'Trung tâm gia công đứng 3 trục phục vụ đào tạo và nghiên cứu chế tạo.',
    specs: { Model: 'Haas VF-2', 'Hành trình': '762 x 406 x 508 mm', 'Tốc độ': '8.100 rpm' },
  },
  {
    id: 3,
    name: 'Kính hiển vi điện tử',
    code: 'SEM-01',
    type: 'Thiết bị',
    department: 'Khoa Khoa học ứng dụng',
    status: 'available',
    location: 'Tòa D, phòng 204',
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80',
    description: 'Thiết bị phân tích hình thái bề mặt mẫu độ phân giải cao.',
    specs: { Model: 'Hitachi SU3500', 'Độ phân giải': '3 nm', 'Điện áp': '0.3 - 30 kV' },
  },
  {
    id: 4,
    name: 'Phòng Lab AI & Robotics',
    code: 'LAB-B2',
    type: 'Phòng lab',
    department: 'Khoa CNTT',
    status: 'available',
    location: 'Tòa E, tầng 5',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80',
    description: 'Không gian nghiên cứu robot, thị giác máy tính và trí tuệ nhân tạo.',
    specs: { 'Sức chứa': '24 người', GPU: '8 x NVIDIA RTX', Robot: '6 bộ thực hành' },
  },
  {
    id: 5,
    name: 'Máy đo Oscilloscope',
    code: 'OSC-05',
    type: 'Thiết bị',
    department: 'Khoa Điện - Điện tử',
    status: 'available',
    location: 'Lab A1, bàn 08',
    image:
      'https://images.unsplash.com/photo-1580982327559-c1202864eb05?auto=format&fit=crop&w=900&q=80',
    description: 'Máy hiện sóng số 4 kênh dùng cho đo kiểm tín hiệu điện tử.',
    specs: { Model: 'Tektronix MDO34', 'Băng thông': '1 GHz', Kênh: '4 analog' },
  },
  {
    id: 6,
    name: 'Phòng thí nghiệm Hóa sinh',
    code: 'LAB-C3',
    type: 'Phòng lab',
    department: 'Khoa Công nghệ sinh học',
    status: 'inactive',
    location: 'Tòa D, tầng 1',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    description: 'Phòng phân tích hóa sinh đạt tiêu chuẩn an toàn cấp 2.',
    specs: { 'Sức chứa': '18 người', 'An toàn': 'BSL-2', 'Tủ hút': '4 bộ' },
  },
]

export const bookings = [
  {
    id: 'BK-24081',
    resource: 'Phòng Lab Vi mạch A1',
    date: '06/08/2026',
    time: '09:00 - 11:00',
    purpose: 'Đề tài nghiên cứu',
    status: 'Đã duyệt',
    countdown: 'Còn 1 ngày 18 giờ',
  },
  {
    id: 'BK-24076',
    resource: 'Máy đo Oscilloscope',
    date: '08/08/2026',
    time: '14:00 - 16:00',
    purpose: 'Bài tập môn học',
    status: 'Chờ duyệt',
    countdown: 'Còn 3 ngày 23 giờ',
  },
]

export const approvals = [
  {
    id: 'RQ-1058',
    person: 'Nguyễn Văn An',
    resource: 'Lab Vi mạch A1',
    time: '05/08 09:00-11:00',
    purpose: 'Đề tài NC',
    priority: 'Cao',
    status: 'Chờ duyệt',
  },
  {
    id: 'RQ-1057',
    person: 'Lê Thị Chi',
    resource: 'Máy CNC-02',
    time: '05/08 13:00-15:00',
    purpose: 'Môn học',
    priority: 'TB',
    status: 'Chờ duyệt',
  },
  {
    id: 'RQ-1056',
    person: 'Phạm Văn Dũng',
    resource: 'Lab Mạng B2',
    time: '06/08 08:00-10:00',
    purpose: 'Tự học',
    priority: 'Thấp',
    status: 'Chờ duyệt',
  },
  {
    id: 'RQ-1055',
    person: 'Hoàng Thị Em',
    resource: 'Máy đo Oscilloscope',
    time: '06/08 14:00-16:00',
    purpose: 'Đề tài NC',
    priority: 'Cao',
    status: 'Chờ duyệt',
  },
]

export const maintenance = [
  {
    id: 'MT-091',
    resource: 'Máy CNC Haas VF-2',
    date: '04/08/2026',
    type: 'Bảo trì định kỳ',
    cost: '2.100.000 đ',
    status: 'Đang thực hiện',
  },
  {
    id: 'MT-088',
    resource: 'Máy đo Oscilloscope',
    date: '28/07/2026',
    type: 'Hiệu chuẩn',
    cost: '350.000 đ',
    status: 'Hoàn tất',
  },
  {
    id: 'MT-082',
    resource: 'Kính hiển vi điện tử',
    date: '18/07/2026',
    type: 'Thay linh kiện',
    cost: '4.800.000 đ',
    status: 'Hoàn tất',
  },
]

export const violations = [
  {
    id: 'VP-208',
    person: 'Trần Minh Khoa',
    department: 'Khoa CNTT',
    type: 'Không đến (no-show)',
    date: '02/08/2026',
    penalty: 'Khóa 7 ngày',
    status: 'Đang khóa',
  },
  {
    id: 'VP-204',
    person: 'Nguyễn Thùy Linh',
    department: 'Khoa Cơ khí',
    type: 'Trả trễ > 30 phút',
    date: '29/07/2026',
    penalty: 'Cảnh cáo',
    status: 'Đã xử lý',
  },
  {
    id: 'VP-199',
    person: 'Lê Hoàng Nam',
    department: 'Khoa Điện tử',
    type: 'Làm hỏng thiết bị',
    date: '21/07/2026',
    penalty: 'Khóa 30 ngày',
    status: 'Đang khóa',
  },
]

export const statusLabel: Record<ResourceStatus, string> = {
  available: 'Sẵn sàng',
  maintenance: 'Bảo trì',
  inactive: 'Ngừng sử dụng',
}
