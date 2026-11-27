// Server-side fixtures shared by the PA#3 mock handlers.
const timeRange = (start, end) => ({ start, end });
const fullWindow = () => timeRange('09:00', '11:00');

const campaign = {
  id: 'fall-2026',
  name: 'Tuyển thành viên CLB Công nghệ Mùa Thu 2026',
  hostClub: 'CLB Công nghệ và Sáng tạo',
  description: 'ClubFlow tìm kiếm những thành viên yêu thích công nghệ, sáng tạo nội dung và tổ chức hoạt động cộng đồng. Hãy chọn vị trí phù hợp với thế mạnh của bạn và cùng xây dựng các dự án dành cho sinh viên trong năm học 2026–2027.',
  instructions: 'Chọn vị trí bạn quan tâm, điền thông tin liên hệ, đính kèm CV và viết ngắn gọn lý do muốn tham gia. Bạn có thể nộp đơn cho nhiều vị trí; mỗi đơn được xét riêng. Vui lòng gửi trước ngày 05/11/2026.',
  status: 'Published',
  opensOn: '2026-10-20',
  closesOn: '2026-11-05',
  interviewDate: '2026-11-10',
  timeZone: 'Asia/Ho_Chi_Minh',
  interviewWindow: fullWindow(),
  durationMinutes: 20,
  availabilitySlots: [
    { id: 'slot-1', ...timeRange('09:00', '09:20') },
    { id: 'slot-2', ...timeRange('09:20', '09:40') },
    { id: 'slot-3', ...timeRange('09:40', '10:00') },
    { id: 'slot-4', ...timeRange('10:00', '10:20') },
    { id: 'slot-5', ...timeRange('10:20', '10:40') },
    { id: 'slot-6', ...timeRange('10:40', '11:00') },
  ],
  roomIds: ['room-1', 'room-2', 'room-3'],
  departments: [
    {
      id: 'content',
      name: 'Ban Nội dung',
      positions: [{
        id: 'pos-content',
        title: 'Chuyên viên Nội dung Truyền thông và Kể chuyện Cộng đồng',
        quota: 3,
        description: 'Lên ý tưởng và biên tập bài viết, kể câu chuyện về dự án và thành viên trên các kênh truyền thông của CLB.',
        requirements: 'Viết rõ ràng, biết phối hợp nhóm và có thể dành ít nhất 4 giờ mỗi tuần cho hoạt động của ban.',
      }],
    },
    {
      id: 'communications',
      name: 'Ban Truyền thông',
      positions: [{
        id: 'pos-communications',
        title: 'Điều phối viên Truyền thông',
        quota: 2,
        description: 'Lập kế hoạch truyền thông, điều phối lịch đăng và phối hợp đưa tin cho workshop, ngày hội và buổi gặp gỡ.',
        requirements: 'Chủ động, giao tiếp tốt và có thể tham gia đưa tin trực tiếp theo lịch hoạt động của CLB.',
      }],
    },
    {
      id: 'design',
      name: 'Ban Thiết kế',
      positions: [{
        id: 'pos-design',
        title: 'Thiết kế Trải nghiệm',
        quota: 2,
        description: 'Thiết kế ấn phẩm và giao diện đơn giản để truyền tải thông tin hoạt động một cách dễ hiểu.',
        requirements: 'Có sản phẩm mẫu, nắm kiến thức thiết kế cơ bản và sẵn sàng nhận phản hồi để cải thiện.',
      }],
    },
  ],
};

const applicants = [
  { id: 'applicant-1', name: 'Nguyễn Thị Minh Anh', major: 'Báo chí và Truyền thông', year: 2 },
  { id: 'applicant-2', name: 'Trần Quang Huy', major: 'Thiết kế Đồ họa', year: 3 },
  { id: 'applicant-3', name: 'Lê Hoàng Phúc', major: 'Ngôn ngữ Anh', year: 1 },
  { id: 'applicant-4', name: 'Tôn Nữ Hoàng Phương Thảo Nguyên', major: 'Kỹ thuật Phần mềm', year: 1 },
];

const interviewers = [
  { id: 'interviewer-1', name: 'Đặng Thu Hà', positionIds: ['pos-content'], availability: [timeRange('09:00', '10:00')] },
  { id: 'interviewer-2', name: 'Võ Quốc Khánh', positionIds: ['pos-communications'], availability: [fullWindow()] },
  { id: 'interviewer-3', name: 'Bùi Mai Linh', positionIds: ['pos-design'], availability: [fullWindow()] },
];

const rooms = [1, 2, 3].map(number => ({
  id: `room-${number}`,
  name: `Lab ${number}`,
  availability: [fullWindow()],
}));

// Fictional, local-only credentials. Applicant and interviewer IDs match their domain records.
const demoAliases = {
  'executive-1': 'exec',
  'applicant-1': 'studentA',
  'interviewer-1': 'int-content',
  'interviewer-2': 'int-comms',
};

const accounts = [
  { id: 'executive-1', name: 'ClubFlow Demo Executive', role: 'Executive', email: 'executive@clubflow.test' },
  ...applicants.map(({ id, name }) => ({ id, name, role: 'Applicant', email: `${id}@clubflow.test` })),
  ...interviewers.map(({ id, name }) => ({ id, name, role: 'Interviewer', email: `${id}@clubflow.test` })),
].map(account => ({
  ...account,
  alias: demoAliases[account.id] ?? account.id,
  password: 'clubflow-demo',
}));

const applications = [
  {
    id: 'A01', applicantId: 'applicant-1', positionId: 'pos-content', status: 'Shortlisted',
    submittedAt: '2026-10-22T19:10:00+07:00', availabilitySlotIds: ['slot-1', 'slot-2'],
    cvFilename: 'cv-nguyen-thi-minh-anh.pdf',
    experience: 'Biên tập viên fanpage khoa trong 1 năm; viết 12 bài giới thiệu dự án sinh viên.',
    skills: 'Viết bài, phỏng vấn nhân vật, Canva, quay dựng video ngắn.',
    statement: 'Em muốn kể lại câu chuyện của các bạn làm dự án công nghệ để nhiều sinh viên năm nhất dám tham gia hơn. Em có thể dành 5 giờ mỗi tuần và quen làm việc theo hạn đăng bài.',
    internalNote: 'Bài mẫu viết tốt, có kinh nghiệm thực tế. Cùng ứng tuyển A02 – lưu ý khi xếp lịch để hai buổi không trùng giờ.',
  },
  {
    id: 'A02', applicantId: 'applicant-1', positionId: 'pos-communications', status: 'Shortlisted',
    submittedAt: '2026-10-23T20:30:00+07:00', availabilitySlotIds: ['slot-1', 'slot-2'],
    cvFilename: 'cv-nguyen-thi-minh-anh-truyen-thong.pdf',
    experience: 'Phụ trách thông báo, lịch đăng và phối hợp nhóm đưa tin cho ngày hội tân sinh viên 2025.',
    skills: 'Lập kế hoạch truyền thông, phối hợp nhóm, Google Sheets.',
    statement: 'Em muốn học cách lên kế hoạch truyền thông cho một hoạt động, từ thông báo trước sự kiện đến tổng kết sau chương trình.',
    internalNote: 'Kinh nghiệm điều phối lịch đăng phù hợp. Đơn này được xét độc lập với A01.',
  },
  {
    id: 'A03', applicantId: 'applicant-2', positionId: 'pos-design', status: 'Shortlisted',
    submittedAt: '2026-10-28T14:05:00+07:00', availabilitySlotIds: ['slot-2', 'slot-3'],
    cvFilename: 'portfolio-tran-quang-huy.pdf',
    experience: 'Thiết kế poster và giao diện đăng ký cho 3 workshop của khoa.',
    skills: 'Figma, Illustrator, nghiên cứu người dùng cơ bản.',
    statement: 'Mình muốn làm cho thông tin hoạt động của CLB dễ đọc hơn trên điện thoại, vì đa số sinh viên xem thông báo trên đó.',
    internalNote: 'Portfolio rõ ràng, có sản phẩm thật. Ưu tiên phỏng vấn với Ban Thiết kế.',
  },
  {
    id: 'A04', applicantId: 'applicant-3', positionId: 'pos-content', status: 'Shortlisted',
    submittedAt: '2026-11-01T09:40:00+07:00', availabilitySlotIds: ['slot-4', 'slot-5', 'slot-6'],
    cvFilename: 'cv-le-hoang-phuc.pdf',
    experience: 'Viết blog cá nhân về sách; cộng tác viên bản tin lớp.',
    skills: 'Viết song ngữ Việt – Anh, chụp ảnh sự kiện.',
    statement: 'Em muốn viết bài song ngữ để các bạn sinh viên quốc tế cũng theo dõi được hoạt động của CLB.',
    internalNote: 'Chỉ rảnh 10:00–11:00 ngày phỏng vấn; cần kiểm tra lịch người phỏng vấn Ban Nội dung.',
  },
  {
    id: 'A05', applicantId: 'applicant-4', positionId: 'pos-communications', status: 'Rejected',
    submittedAt: '2026-11-04T21:15:00+07:00', availabilitySlotIds: ['slot-1'],
    cvFilename: 'cv-ton-nu-hoang-phuong-thao-nguyen.pdf',
    experience: 'Chưa tham gia lập kế hoạch truyền thông cho hoạt động sinh viên.',
    skills: 'Lập trình web cơ bản, thuyết trình.',
    statement: 'Em muốn thử sức ở vị trí mới, nhưng học kỳ này em chỉ tham gia được các buổi online.',
    internalNote: 'Vị trí yêu cầu đưa tin trực tiếp; ứng viên chỉ tham gia online. Gợi ý mời ứng tuyển lại đợt sau.',
  },
].map(application => ({ campaignId: campaign.id, ...application }));

// This snapshot follows a manual edit that moved A02 onto A01's slot.
const schedule = {
  campaignId: campaign.id,
  date: campaign.interviewDate,
  window: fullWindow(),
  durationMinutes: campaign.durationMinutes,
  status: 'Draft',
  confirmedAt: null,
  rows: [
    { applicationId: 'A01', status: 'Conflict', time: timeRange('09:00', '09:20'), interviewerId: 'interviewer-1', roomId: 'room-1', conflictingApplicationIds: ['A02'], reason: 'Applicant overlaps with A02.' },
    { applicationId: 'A02', status: 'Conflict', time: timeRange('09:00', '09:20'), interviewerId: 'interviewer-2', roomId: 'room-2', conflictingApplicationIds: ['A01'], reason: 'Applicant overlaps with A01.' },
    { applicationId: 'A03', status: 'Proposed', time: timeRange('09:20', '09:40'), interviewerId: 'interviewer-3', roomId: 'room-3', conflictingApplicationIds: [], reason: null },
    { applicationId: 'A04', status: 'Unassigned', time: null, interviewerId: null, roomId: null, conflictingApplicationIds: [], reason: 'The applicant is free from 10:00 to 11:00, after the qualified interviewer’s availability ends.' },
  ],
};

export function createSeedData() {
  return structuredClone({
    campaigns: [campaign],
    accounts,
    applicants,
    applications,
    interviewers,
    rooms,
    schedules: [schedule],
    assessments: [],
    results: [],
    notifications: [],
  });
}
