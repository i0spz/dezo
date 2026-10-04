# 🛡️ Dezo — DDoS Simulation Lab & SOC Operations Console

<p align="center">
  <img src="src/assets/hero.png" alt="Dezo SOC Console" width="85%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
</p>

<p align="center">
  <strong>منصة محاكاة تعليمية تفاعلية للعمليات السيبرانية (SOC) لاختبار هجمات الحرمان من الخدمة الموزعة (DDoS) وتفعيل استراتيجيات الدفاع السيبراني محلياً في المتصفح.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-3.10-22c55e" alt="Recharts" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 📖 جدول المحتويات (Table of Contents)
- [نظرة عامة (Overview)](#-نظرة-عامة-overview)
- [المميزات الرئيسية (Key Features)](#-المميزات-الرئيسية-key-features)
- [أنماط الهجمات المدعومة (Attack Profiles)](#-أنماط-الهجمات-المدعومة-attack-profiles)
- [منظومة الدفاع والصد (Defensive Countermeasures)](#-منظومة-الدفاع-والصد-defensive-countermeasures)
- [المركز التعليمي (Learning Center)](#-المركز-التعليمي-learning-center)
- [المعمارية والتقنيات (Architecture & Tech Stack)](#-المعمارية-والتقنيات-architecture--tech-stack)
- [هيكل المشروع (Project Structure)](#-هيكل-المشروع-project-structure)
- [التثبيت والتشغيل المحلي (Getting Started)](#-التثبيت-والتشغيل-المحلي-getting-started)
- [الأوامر المتاحة (Available Scripts)](#-الأوامر-المتاحة-available-scripts)
- [تنويه قانوني وأخلاقي (Disclaimer)](#-تنويه-قانوني-وأخلاقي-disclaimer)

---

## 🎯 نظرة عامة (Overview)

مشروع **Dezo** عبارة عن منصة محاكاة سحابية/مكتبية متطورة تُحاكي بيئة مركز عمليات أمن المعلومات (**SOC - Security Operations Center**). تتيح للمهندسين، الطلاب، وباحثي الأمن السيبراني استيعاب سلوك حركة مرور الشبكة أثناء هجمات حجب الخدمة، وتأثيرها المباشر على الخوادم والبنية التحتية، مع إمكانية تجربة وتفعيل حلول الدفاع اللحظية لمشاهدة كيفية امتصاص الهجمات وتصفيتها فوراً.

---

## ✨ المميزات الرئيسية (Key Features)

- **🖥️ واجهة سطح مكتب تفاعلية (Window Management System):**
  - بيئة نوافذ قابلة للتحريك والتكبير والتصغير وتغيير الحجم والترتيب.
  - شريط مهام (Taskbar) وقائمة جانبية (Sidebar) وأزرار تحكم سريعة.
  - دعم كامل للوضعين الداكن (Dark Mode) والفاتح (Light Mode).

- **⚡ محرك محاكاة فوري عالي الدقة (Real-time Simulation Engine):**
  - توليد حركة مرور شبكية واقعية (حركة طبيعية، طفرات زيارات، هجمات منسقة).
  - احتساب فوري لاستهلاك المعالج (CPU)، الذاكرة (RAM)، معدل التأخير (Latency)، وحزم الشبكة (Gbps).
  - نمذجة انهيار الخوادم وتوقفها عن العمل عند تجاوز طاقة الاستيعاب.

- **📊 لوحة مراقبة وتحليلات حية (Live Telemetry & Metrics):**
  - رسوم بيانية لحظية باستخدام **Recharts** تبيّن الحزم المقبولة والمحظورة والمسقطة.
  - بطاقات مراقبة فورية لضغط المعالجات، استخدام الذاكرة، معدل الخطأ (Error Rate)، ومعدل الـ Cache Hit.

- **🛡️ ترسانة دفاعات استباقية (Active Defense Suite):**
  - تفعيل وإلغاء منظومات الحماية بضغطة زر ومشاهدة التأثير المباشر على الهجوم في أجزاء من الثانية.
  - محاكاة لتقنيات جدار حماية تطبيقات الويب (WAF)، ومحددات المعدل (Rate Limiting)، وشبكات توصيل المحتوى (CDN).

- **🧪 هندسة الفوضى (Chaos Engineering):**
  - حقن أعطال واختناقات في الشبكة وقواعد البيانات لمراقبة قدرة البنية التحتية على الاستمرار والتعافي الذاتي.

- **📑 تقارير ما بعد الحادثة (Post-Incident Reports):**
  - توليد تقرير فني شامل ومفصل فور انتهاء كل جلسة محاكاة يُظهر أقصى ضغط وصل إليه النظام، وعدد الخوادم المتأثرة، والتقييم النهائي لنجاح الدفاع.

---

## ⚔️ أنماط الهجمات المدعومة (Attack Profiles)

| نوع الهجوم | الطبقة (OSI Layer) | الوصف وسلوك الهجوم |
| :--- | :---: | :--- |
| **HTTP Request Flood** | Layer 7 | إغراق خوادم الويب بطلبات `GET/POST` هائلة لإنهاك خيوط المعالجة. |
| **HTTPS SSL/TLS Flood** | Layer 7 | استهلاك طاقة المعالجة عبر فرض عمليات تشفير وفك تشفير معقدة. |
| **SYN Flood Simulation** | Layer 4 | إرسال حزم TCP SYN دون إكمال المصافحة الثلاثية لاستنزاف جداول الاتصال. |
| **UDP Flood Simulation** | Layer 4 | إغراق منافذ عشوائية بحزم UDP لإجبار الخادم على فحص المنافذ والرد بحزم ICMP. |
| **DNS Amplification** | Layer 3/4 | محاكاة استغلال خوادم DNS المفتوحة لمضاعفة حجم حركة المرور الموجهة للهدف. |
| **Slowloris (Slow Requests)** | Layer 7 | إبقاء قنوات الاتصال مفتوحة بأقل قدر من البيانات لمنع المستخدمين الحقيقيين. |
| **API Endpoint Flood** | Layer 7 | استهداف نقاط نهاية الـ API الثقيلة (عمليات البحث وقواعد البيانات). |
| **Credential Stuffing / Login Flood** | Layer 7 | ضغط هائل على صفحات تسجيل الدخول للتحقق من كلمات المرور. |

---

## 🛡️ منظومة الدفاع والصد (Defensive Countermeasures)

توفر المنصة مجموعة من أقوى دفاعات البنية التحتية:

1. **Web Application Firewall (WAF):** فحص حمولات الطلبات وتصفية الطلبات الخبيثة.
2. **Rate Limiting:** كبح وتحديد عدد الطلبات المسموح بها لكل عنوان IP في الثانية.
3. **Content Delivery Network (CDN):** امتصاص الحزم الثابتة وتوزيع الحمل عبر خوادم الحافة (Edge Servers).
4. **Anycast DDoS Scrubbing:** تمرير الحركة عبر مراكز تنقية لإسقاط حزم الهجمات الضخمة.
5. **Load Balancing (توزيع الأحمال):** موازنة الطلبات القادمة على مجموعة من الخوادم بالتساوي.
6. **Auto Scaling (التوسع التلقائي):** تشغيل خوادم إضافية بشكل فوري عند ارتفاع ضغط المعالج.
7. **Challenge Page (CAPTCHA / JS Proof):** تحدي المتصفحات للتحقق من هوية الزائر (بشري أم بوت).
8. **IP Reputation Scoring:** حظر العناوين المشبوهة المنتمية لشبكات البوتنت (Botnets) المعروفة.

---

## 📚 المركز التعليمي (Learning Center)

يحتوي التطبيق على قسم أكاديمي مخصص لشرح مفاهيم الحماية والأمن السيبراني، يغطي:
- الفروقات الجوهرية بين هجمات DoS وهجمات DDoS.
- تحليل طبقات نموذج OSI المستهدفة (Layer 3, Layer 4, Layer 7).
- آليات عمل التخفيف (Scrubbing Centers, SYN Cookies, Anycast Routing).
- أمثلة بصرية مبسطة لشرح المفاهيم لغير المتخصصين.

---

## 🏗️ المعمارية والتقنيات (Architecture & Tech Stack)

- **Frontend Core:** [React 19](https://react.dev/) مع [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite 6](https://vitejs.dev/) + [Oxlint](https://oxc.rs/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts & Data Viz:** [Recharts](https://recharts.org/)
- **Special Effects:** [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 📁 هيكل المشروع (Project Structure)

```text
dezo/
├── public/                 # الملفات العامة والأيقونات
├── src/
│   ├── assets/             # الصور والرسومات التوضيحية
│   ├── components/         # مكونات واجهة المستخدم
│   │   ├── builder/        # مُنشئ الهجمات المخصصة
│   │   ├── chaos/          # أدوات حقن الفوضى والأعطال
│   │   ├── charts/         # الرسوم البيانية اللحظية (Recharts)
│   │   ├── defense/        # لوحة تفعيل الدفاعات والجدران النارية
│   │   ├── events/         # سجل الأحداث والتنبيهات المباشر
│   │   ├── history/        # سجل الجلسات السابقة والمقارنات
│   │   ├── infrastructure/ # طوبولوجيا الشبكة وعقد الخوادم
│   │   ├── layout/         # شريط المهام، النوافذ، والقائمة الجانبية
│   │   ├── learning/       # محتوى المركز التعليمي والأكاديمي
│   │   ├── metrics/        # بطاقات المقاييس اللحظية
│   │   ├── report/         # تقرير ما بعد الحادثة والإحصائيات
│   │   ├── scenarios/      # سيناريوهات المحاكاة الجاهزة
│   │   ├── topology/       # مخطط الاتصال البصري
│   │   └── window/         # مدير النوافذ الافتراضي
│   ├── context/            # إدارة الحالة العامة (Simulation & Windows Context)
│   ├── engine/             # محرك الحسابات الرياضية والفيزيائية للمرور
│   ├── types/              # تعريفات الأنواع (TypeScript Types & Interfaces)
│   ├── App.tsx             # المكون الجذري للتطبيق
│   ├── main.tsx            # نقطة البداية
│   └── index.css           # أنماط Tailwind والتنسيقات المخصصة
├── package.json            # الحزم والاعتماديات
├── tailwind.config.js      # إعدادات ألوان وتصميم الـ SOC
├── tsconfig.json           # إعدادات TypeScript
└── vite.config.ts          # إعدادات Vite
```

---

## 🚀 التثبيت والتشغيل المحلي (Getting Started)

### المتطلبات الأساسية
- مثبت [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث)
- مدير الحزم `npm` أو `pnpm` أو `yarn`

### خطوات التثبيت

1. **استنساخ المستودع (Clone the repository):**
   ```bash
   git clone https://github.com/i0spz/dezo.git
   cd dezo
   ```

2. **تثبيت الحزم (Install dependencies):**
   ```bash
   npm install
   ```

3. **تشغيل خادم التطوير (Run development server):**
   ```bash
   npm run dev
   ```

4. **فتح التطبيق:**
   افتح المتصفح وانتقل إلى الرابط:
   ```
   http://localhost:5173
   ```

---

## 🛠️ الأوامر المتاحة (Available Scripts)

- **`npm run dev`**: تشغيل خادم التطوير مع ميزة التحديث الفوري (HMR).
- **`npm run build`**: التحقق من الأنواع وبناء ملفات الإنتاج النهائية في مجلد `dist/`.
- **`npm run preview`**: استعراض نسخة الإنتاج محلياً.
- **`npm run lint`**: فحص الكود البرمجي باستخدام `oxlint`.

---

## ⚖️ تنويه قانوني وأخلاقي (Disclaimer)

> [!IMPORTANT]
> هذا المشروع مصمم **لأغراض تعليمية وتدريبية بحتة**. جميع عمليات المحاكاة، وحزم البيانات، والرسومات البيانية، واستهلاك الموارد تعمل **محلياً داخل المتصفح بنسبة 100% عبر نماذج رياضية محاكية**، ولا تقوم المنصة بإرسال أي حركة مرور شبكية حقيقية أو استهداف أي بنية تحتية أو خوادم خارجية على الإطلاق.
