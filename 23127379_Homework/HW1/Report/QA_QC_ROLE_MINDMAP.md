```mermaid
graph LR
    %% Định nghĩa các lớp Style để sơ đồ trực quan và chuyên nghiệp hơn
    classDef rootStyle fill:#2c3e50,stroke:#34495e,stroke-width:2px,color:#fff,font-weight:bold;
    classDef qaStyle fill:#2980b9,stroke:#2471a3,stroke-width:2px,color:#fff,font-weight:bold;
    classDef qcStyle fill:#27ae60,stroke:#1e8449,stroke-width:2px,color:#fff,font-weight:bold;
    classDef skillStyle fill:#8e44ad,stroke:#7d3c98,stroke-width:2px,color:#fff,font-weight:bold;
    classDef goalStyle fill:#d35400,stroke:#ba4a00,stroke-width:2px,color:#fff,font-weight:bold;
    classDef subStyle fill:#eaedf1,stroke:#bdc3c7,stroke-width:1px,color:#2c3e50;

    %% Nút gốc chính
    Root((QA/QC/Tester Role)):::rootStyle

    %% --- NHÁNH 1: QUALITY ASSURANCE ---
    Root --> QA[Quality Assurance - QA]:::qaStyle
    
    QA --> QA1[Định hướng Quy trình]:::subStyle
    QA1 --> QA1_1[Đề xuất cải tiến quy trình kiểm thử trong từng mô hình phát triển]
    QA1 --> QA1_2[Đóng góp xây dựng Definition of Done & Acceptance Criteria cùng team]
    
    QA --> QA2[Phòng ngừa lỗi - Defect Prevention]:::subStyle
    QA2 --> QA2_1[Tham gia Review tài liệu yêu cầu BRD/SRS từ sớm]
    QA2 --> QA2_2[Phân tích rủi ro hệ thống - Risk Analysis]
    QA2 --> QA2_3[Xây dựng ma trận kiểm soát chất lượng]
    
    QA --> QA3[Kiểm toán & Đánh giá]:::subStyle
    QA3 --> QA3_1[Theo dõi và phản hồi về chất lượng quy trình trong phạm vi testing]
    QA3 --> QA3_2[Đo lường các chỉ số Metrics chất lượng dự án]


    %% --- NHÁNH 2: QUALITY CONTROL (QC) ---
    Root --> QC[Quality Control - QC]:::qcStyle
    
    QC --> QC_Role[Kiểm soát chất lượng đầu ra sản phẩm]
    QC_Role --> QC1[Lập kế hoạch & Thiết kế]:::subStyle
    QC1 --> QC1_1[Test Plan: Xác định phạm vi, lịch trình, nhân sự, rủi ro]
    QC1 --> QC1_2[Test Design: Xem xét ma trận bao phủ, kịch bản tổng thể]
    QC1 --> QC1_3[Đánh giá và duyệt Test Case, Test Data]
    
    QC_Role --> QC2[Quản lý lỗi & Báo cáo]:::subStyle
    QC2 --> QC2_1[Theo dõi vòng đời Bug - Bug Life Cycle]
    QC2 --> QC2_2[Phân tích nguyên nhân gốc rễ lỗi - Root Cause Analysis]
    QC2 --> QC2_3[Đánh giá chất lượng bản Release để Go-Live]


    %% --- NHÁNH 3: TESTER ---
    Root --> Tester[Tester]:::testerStyle
    
    Tester --> Tester_Role[Thực hiện hoạt động kiểm thử trực tiếp]
    Tester_Role --> T1[Thiết kế chi tiết]:::subStyle
    T1 --> T1_1[Viết Test Case chi tiết, Checklists]
    T1 --> T1_2[Chuẩn bị và tạo Test Data - Dữ liệu mẫu]
    
    Tester_Role --> T2[Thực thi kiểm thử - Test Execution]:::subStyle
    T2 --> T2_M[Manual Testing - Thủ công]:::subStyle
    T2_M --> T2_M1[Kiểm thử chức năng - Functional]
    T2_M --> T2_M2[Kiểm thử giao diện - UI/UX]
    T2_M --> T2_M3[Kiểm thử hồi quy - Regression]
    T2_M --> T2_M4[Kiểm thử khám phá - Exploratory Testing]
    
    T2 --> T2_A[Automation Testing - Tự động]:::subStyle
    T2_A --> T2_A1[API Testing: Postman, RestAssured]
    T2_A --> T2_A2[UI Automation: Playwright, Selenium]
    
    Tester_Role --> T3[Báo cáo lỗi]:::subStyle
    T3 --> T3_1[Log lỗi chính xác lên Jira/Redmine: Steps, Actual vs Expected]


    %% --- NHÁNH 4: CORE SKILLS ---
    Root --> Skill[Kỹ năng cốt lõi - Core Skills]:::skillStyle
    
    Skill --> Skill1[Kỹ năng chuyên môn - Hard Skills]:::subStyle
    Skill1 --> Skill1_1[Kiến thức Testing nền tảng - ISTQB Syllabus]
    Skill1 --> Skill1_2[Kỹ thuật thiết kế Test Case: Giá trị biên, Phân vùng tương đương]
    Skill1 --> Skill1_3[Hệ thống & Database: SQL queries, Log analysis, Linux]
    
    Skill --> Skill2[Kỹ năng mềm - Soft Skills]:::subStyle
    Skill2 --> Skill2_1[Tư duy phân tích phản biện & Chú ý chi tiết]
    Skill2 --> Skill2_2[Giao tiếp hiệu quả, khéo léo với Dev, PM, BA và Khách hàng]


    %% --- NHÁNH 4: ULTIMATE GOALS ---
    Root --> Goal[Mục tiêu cuối cùng - Ultimate Goals]:::goalStyle
    Goal --> Goal1[Tối ưu chi phí sửa lỗi - Phát hiện lỗi càng sớm càng tốt]
    Goal --> Goal2[Đảm bảo sản phẩm đáp ứng chuẩn xác yêu cầu khách hàng]
    Goal --> Goal3[Nâng cao tối đa trải nghiệm người dùng cuối - End-user]