<p align="center">
  <img src="https://res.cloudinary.com/dywhwi0ce/image/upload/v1774237689/Screenshot_2026-03-23_104959_z3rm2e.png" alt="Whop — application preview" width="720" />
</p>

<p align="center">
  <img src="https://res.cloudinary.com/dywhwi0ce/image/upload/v1774237640/Screenshot_2026-03-23_104900_lpfe3u.png" alt="Whop — application preview" width="720" />
</p>

<p align="center">
  <strong>Whop</strong><br/>
  Real-time messaging platform · TypeScript monorepo · Express · MongoDB · Socket.IO · React (Vite)
</p>

---

## Table of contents

- [English](#english)
- [Tiếng Việt](#vietnamese)
- [Author](#author)

---

<a id="english"></a>

# English

## Overview

**Whop** is a full-stack real-time messaging application delivered as a monorepo: a **Node/Express** API with **MongoDB**, **Socket.IO** for realtime events, and a **React (Vite)** client. The goal is a coherent stack for authenticated users, persistent chats, presence, and a deployment path suitable for portfolio or production-style demos.

## Problem statement

Typical failures in chat products are not “missing a text box,” but:

- **Inconsistent UI state** — loading states and list ordering that do not match server truth.
- **Split-brain between HTTP and WebSockets** — the thread on screen diverges from what the database or peers observe.
- **Auth gaps** — sessions work over REST but the socket layer is not bound to the same identity.

Whop addresses these by pairing **REST** for persistence and contracts with **Socket.IO** for **low-latency delivery**, **room-scoped events**, and **online presence**, with **TypeScript** end-to-end and a documented build/start flow for deployment.

## Tech stack and architecture

| Layer | Choice | Rationale |
|--------|--------|-----------|
| API | **Express 5** + **TypeScript** | Structured middleware, shared types across controllers, services, and validators in a growing monorepo. |
| Data | **MongoDB** + **Mongoose** | Document model suited to chats, participants, and messages; supports iterative schema changes. |
| Realtime | **Socket.IO** | Multiplexing, acknowledgements, and rooms with lower operational cost than raw WebSockets for authenticated sessions. |
| Validation | **Zod** | Strict parsing at API and form boundaries to reduce invalid state. |
| Client | **React 19** + **Vite 7** | Fast iteration, modern tooling, scalable component structure. |
| Client state | **Zustand** | Lightweight stores for **auth**, **socket lifecycle**, and **chat** with clear separation of concerns. |
| Styling | **Tailwind CSS 4** | Consistent layout and typography. |
| API docs | **Swagger** | Discoverable HTTP surface for collaborators and reviewers. |
| Media (optional) | **Cloudinary** | Optional offload for image uploads. |

**Repository layout:** `backend/` (Express, Socket.IO, MongoDB) and `client/` (Vite + React). In production, the server may serve the SPA from `client/dist` for a **single-process** deploy — see `backend/src/index.ts` and `DEPLOY-BUILD-COMMAND`.

## Technical challenges and solutions

### 1. Socket authentication aligned with browser security

**Issue:** HTTP can use cookies and CORS; the WebSocket handshake must still bind to the same authenticated user.

**Approach:** Axios and the socket client use `withCredentials: true` (`client/src/lib/axios-client.ts`, `client/src/hooks/use-socket.ts`). Socket.IO middleware reads `accessToken` from the handshake cookie, verifies JWT (`backend/src/lib/socket.ts`), and attaches `userId`. Login, session restore, and logout coordinate socket connect/disconnect (`client/src/hooks/use-auth.ts`).

### 2. Optimistic UI with server reconciliation

**Issue:** Blocking on the network for every send harms perceived performance; naive optimistic updates corrupt thread state.

**Approach:** Outbound messages use a **temporary client id**, then replace with the persisted message from the API (`client/src/hooks/use-chat.ts`).

### 3. Rooms, presence, and authorization

**Issue:** Global broadcast is inefficient and unsafe; updates must reach only entitled participants.

**Approach:** Per-user rooms (`user:{id}`) for targeted events; per-chat rooms (`chat:{id}`) with participant validation on join (`backend/src/lib/socket.ts`). New messages use `except(senderSocketId)` when the sender is online to limit redundant delivery, with a fallback when not.

### 4. Local development without unnecessary containerization

**Issue:** Onboarding should not require a heavy container setup for every service.

**Approach:** `docker-compose.yml` runs **MongoDB 7** with a **healthcheck** and persistent volume; Node apps run via npm locally until you choose to containerize them.

## Development timeline (three weeks, commit-aligned)

| Week | Focus | Deliverables |
|------|--------|--------------|
| **Week 1** | Foundation | Monorepo scaffold, TypeScript on client and server, Dockerized MongoDB, documented build/start. *`chore: add monorepo scaffold, Docker, and client/backend tooling`.* |
| **Week 2** | Backend | Express API, Mongoose models, JWT auth, Zod validation, Swagger, Socket.IO with rooms and presence. *`feat(backend): add Express API, MongoDB models, auth, and Socket.IO`.* |
| **Week 3** | Client & realtime | Vite/React UI, routing and guards, Zustand, socket hooks, optimistic sends, websocket sandbox. *`feat(client): …`, `chore: add minimal websocket example …`.* |

## Installation

### Prerequisites

- Node.js (LTS recommended)
- npm
- Docker (optional, for MongoDB only)

### Option A — MongoDB via Docker, apps via npm

1. Start MongoDB:

   ```bash
   docker compose up -d
   ```

2. Configure `backend/.env` (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN`; Cloudinary keys if using uploads).

3. Configure `client/.env` from `client/.env.example` (`VITE_API_URL`, e.g. `http://localhost:8000`).

4. Run:

   ```bash
   cd backend && npm install && npm run dev
   ```

   ```bash
   cd client && npm install && npm run dev
   ```

### Option B — Local MongoDB

Set `MONGO_URI` to your instance; otherwise same as Option A.

### Production build

See `DEPLOY-BUILD-COMMAND` for build order and `node backend/dist/index.js`.

---

<a id="vietnamese"></a>

# Tiếng Việt

## Tổng quan

**Whop** là ứng dụng nhắn tin full-stack theo thời gian thự, tổ chức dạng monorepo: API **Node/Express** với **MongoDB**, **Socket.IO** cho sự kiện realtime, và client **React (Vite)**. Mục tiêu là một stack thống nhất cho người dùng đã xác thực, hội thoại bền, presence, và quy trình triển khai phù hợp portfolio hoặc demo production.

## Vấn đề cần giải quyết

Thất bại thường gặp không phải “thiếu ô chat,” mà là:

- **Trạng thái UI không nhất quán** — loading và thứ tự danh sách lệch so với server.
- **HTTP và WebSocket không đồng bộ** — thread hiển thị khác DB hoặc peer.
- **Lỗ hổng auth** — phiên REST ổn nhưng socket không gắn cùng danh tính.

Whop xử lý bằng cách kết hợp **REST** (bền bỉ, hợp đồng API) với **Socket.IO** (**phân phối độ trễ thấp**, **sự kiện theo phòng**, **presence**), **TypeScript** xuyên suốt, và tài liệu build/start rõ ràng.

## Tech stack và kiến trúc

| Tầng | Lựa chọn | Lý do |
|------|-----------|--------|
| API | **Express 5** + **TypeScript** | Middleware rõ ràng, typing xuyên suốt khi monorepo mở rộng. |
| Dữ liệu | **MongoDB** + **Mongoose** | Document phù hợp chat, thành viên, tin nhắn; dễ thay đổi schema. |
| Realtime | **Socket.IO** | Multiplexing, ack, room; phù hợp phiên đã xác thực hơn WebSocket thuần. |
| Validation | **Zod** | Parse nghiêm tại biên API/form. |
| Client | **React 19** + **Vite 7** | Tốc độ dev, bundle hiện đại. |
| State client | **Zustand** | **Auth**, **socket**, **chat** tách bạch, đồng bộ khi cần. |
| UI | **Tailwind CSS 4** | Layout và typography thống nhất. |
| Tài liệu API | **Swagger** | Khám phá HTTP surface. |
| Media (tuỳ chọn) | **Cloudinary** | Upload ảnh tuỳ chọn. |

**Cấu trúc:** `backend/` và `client/`; production có thể phục vụ SPA từ `client/dist` — xem `backend/src/index.ts` và `DEPLOY-BUILD-COMMAND`.

## Thử thách kỹ thuật và cách xử lý

### 1. Xác thực socket đồng bộ với trình duyệt

**Vấn đề:** REST dùng cookie/CORS; handshake WebSocket vẫn phải khẳng định cùng user.

**Cách làm:** `withCredentials: true` trên axios và socket client; middleware đọc `accessToken`, verify JWT, gắn `userId`; đăng nhập/phiên/logout điều phối socket (`client/src/hooks/use-auth.ts`, `backend/src/lib/socket.ts`).

### 2. Optimistic UI và đối chiếu server

**Vấn đề:** Chờ mạng mỗi lần gửi là chậm; optimistic sai làm thread hỏng.

**Cách làm:** Id tạm trên client, thay bằng bản tin từ API (`client/src/hooks/use-chat.ts`).

### 3. Phòng, presence, phân quyền

**Vấn đề:** Broadcast toàn cục không an toàn và không hiệu quả.

**Cách làm:** `user:{id}`, `chat:{id}`, validate khi join; emit tin mới có `except(senderSocketId)` khi phù hợp (`backend/src/lib/socket.ts`).

### 4. Môi trường dev gọn

**Vấn đề:** Onboarding không nên phụ thuộc container hoá toàn bộ.

**Cách làm:** `docker-compose.yml` chỉ **MongoDB 7** + healthcheck + volume; Node chạy bằng npm.

## Lộ trình (ba tuần, khớp commit)

| Tuần | Trọng tâm | Kết quả |
|------|-----------|---------|
| **Tuần 1** | Nền tảng | Monorepo, TypeScript, MongoDB Docker, lệnh build/deploy. |
| **Tuần 2** | Backend | Express, Mongoose, JWT, Zod, Swagger, Socket.IO. |
| **Tuần 3** | Client | Vite/React, routing, Zustand, socket, optimistic send, sandbox. |

## Cài đặt

### Yêu cầu

- Node.js (LTS), npm, Docker (tuỳ chọn cho MongoDB)

### Docker + npm

```bash
docker compose up -d
```

Cấu hình `backend/.env`, `client/.env` như phần English, rồi:

```bash
cd backend && npm install && npm run dev
cd client && npm install && npm run dev
```

### Build production

Xem `DEPLOY-BUILD-COMMAND`.

---

<a id="author"></a>

## Author

**Hoang Duy** — Software engineer focused on **clear architecture**, **reliable realtime systems**, and **interfaces that respect users’ time**.

_Whop: one repository, HTTP and WebSockets aligned, from persistence to UI._

Links (replace with yours): [GitHub](https://github.com/duythenights/MERN-chat-app) · [Email](mailto:duythenights@gmail.com)

---

<p align="center">
  <sub>Whop · TypeScript monorepo · Express · MongoDB · Socket.IO · React</sub>
</p>
