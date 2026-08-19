# VoteDesk Election Management System — Backend

Backend REST API untuk **VoteDesk Election Management System**, sebuah aplikasi yang dirancang untuk membantu pengelolaan proses pemilihan secara digital, mulai dari pengelolaan election, petugas, TPS, pemilih, kandidat, hingga proses pemungutan suara dan monitoring hasil.

Backend ini menggunakan konsep **multi-election / multi-tenant**, sehingga satu sistem dapat digunakan untuk berbagai pemilihan dengan data setiap pemilihan tetap terisolasi.

## ✨ Features

* 🔐 Authentication & Authorization
* 🏢 Multi-election / Multi-tenant
* 👥 Role-based access control
* 🗳️ Election Management
* 🏢 TPS Management
* 👤 Petugas Management
* 🧑‍🤝‍🧑 Voter Management
* 🎖️ Candidate Management
* 🎟️ Voting Token Generation & Validation
* 🗳️ Voting Process
* ⏱️ Token Expiration
* 📊 Election Monitoring
* ⚡ Real-time Vote Event
* 📄 Election Result Report
* 📥 Export Result to PDF
* 🖼️ Image Upload

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma
* PostgreSQL
* JWT
* Socket.IO
* Cloudinary
* PDFKit
* Swagger

## 🔐 Authentication & Authorization

Backend menggunakan **JWT (JSON Web Token)** untuk authentication dan authorization.

Setelah berhasil login, user mendapatkan access token yang digunakan untuk mengakses endpoint yang membutuhkan autentikasi.

JWT membawa informasi yang digunakan backend untuk menentukan identitas dan hak akses pengguna, termasuk:

* User ID
* Role
* Election ID
* TPS ID

Role yang digunakan dalam sistem:

* **SUPER_ADMIN**
* **PETUGAS**

Authorization middleware digunakan untuk membatasi akses endpoint berdasarkan role dan konteks election.

## 🏢 Multi-Election Architecture

VoteDesk menggunakan pendekatan **multi-election / multi-tenant**.

Satu sistem dapat digunakan untuk mengelola beberapa election, sementara data operasional dari setiap election tetap terisolasi.

Contoh:

```text
Election A
├── Users
├── TPS
├── Voters
├── Candidates
├── Voting Tokens
└── Votes

Election B
├── Users
├── TPS
├── Voters
├── Candidates
├── Voting Tokens
└── Votes
```

Setiap data operasional memiliki keterkaitan dengan `electionId`.

Konteks election diperoleh dari authenticated user sehingga frontend tidak perlu mengirim `electionId` secara manual pada setiap request.

Pendekatan ini digunakan untuk mencegah data antar election tercampur dan memberikan batas akses yang jelas pada setiap tenant.

## 🎟️ Voting Token

Proses voting menggunakan token yang dibuat oleh petugas.

Alur sederhananya:

```text
Voter hadir
    ↓
Petugas membuat token
    ↓
Token diberikan kepada voter
    ↓
Voter memasukkan token
    ↓
Backend melakukan validasi
    ↓
Token valid
    ↓
Voter memilih kandidat
    ↓
Vote disimpan
    ↓
Token ditandai sebagai digunakan
```

Token memiliki:

* Token code
* Expiration time
* Used status
* Voter reference
* TPS reference
* Election reference

Token yang sudah digunakan tidak dapat digunakan kembali.

## ⚡ Real-Time Communication

Backend menggunakan **Socket.IO** untuk mengirim event secara real-time.

Setelah vote berhasil dibuat, backend mengirim event ke client yang berada pada election yang sama.

Contoh event:

```text
vote:created
```

Client yang terhubung pada election terkait dapat menerima event tersebut dan memperbarui monitoring tanpa melakukan refresh halaman secara manual.

Koneksi Socket.IO juga menggunakan JWT authentication dan election-based room untuk menjaga agar event tidak diterima oleh election lain.

Contoh room:

```text
election:{electionId}
```

## 📊 Monitoring & Result

Backend menyediakan data yang digunakan untuk memonitor proses pemungutan suara, termasuk:

* Total voter
* Voter yang sudah hadir
* Voter yang sudah memilih
* Progress pemungutan suara
* Perolehan suara kandidat
* Persentase suara

Data hasil pemilihan juga dapat digunakan untuk menghasilkan laporan hasil pemungutan suara.

## 📄 PDF Report

Backend menyediakan proses pembuatan laporan hasil pemilihan dalam format PDF.

Laporan dapat mencakup informasi seperti:

* Informasi election
* Informasi penyelenggara
* Daftar kandidat
* Jumlah suara
* Persentase suara
* Hasil pemilihan

## 📖 API Documentation

API didokumentasikan menggunakan **Swagger**.

Swagger dapat digunakan untuk melihat endpoint, request, response, dan melakukan pengujian API.

📚 **Swagger Documentation**

[Swagger API Documentation](https://backend-pilkades-frhn.vercel.app/api-doc)

## 🔗 Frontend

Backend ini digunakan oleh frontend VoteDesk yang dibangun menggunakan Next.js, React.js, dan TypeScript.

📂 **Frontend Repository**

[VoteDesk Election Management System — Frontend](https://github.com/frhn-06/frontend-pilkades-frhn)

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/frhn-06/backend-pilkades-frhn.git
```

Masuk ke folder project:

```bash
cd backend-pilkades-frhn
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Jalankan development server:

```bash
npm run dev
```

Server akan berjalan sesuai konfigurasi port yang digunakan pada project.

## 🔑 Environment Variables

Buat file `.env` pada root project.

Contoh:

```env
DATABASE_URL=
SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=

PASSWORD_MAIL=
MY_MAIL=

RESET_PASSWORD_RESET=

CLIENT_URL=
```


## 📚 About This Project

VoteDesk Election Management System merupakan project **Full-Stack Web Development** yang dibuat untuk mempelajari dan mengimplementasikan sistem pemilihan secara digital.

Pada sisi backend, project ini mencakup authentication, authorization, pengelolaan election, TPS, petugas, voter, kandidat, token voting, proses voting, monitoring, real-time communication, serta pembuatan laporan hasil pemilihan.

Salah satu fokus utama project ini adalah penerapan **multi-election / multi-tenant architecture** dengan isolasi data berdasarkan election.

Project ini juga menjadi sarana untuk memperdalam pemahaman mengenai **REST API, database management menggunakan Prisma dan PostgreSQL, JWT authentication, authorization, Socket.IO, file upload, serta pembuatan laporan PDF**.
