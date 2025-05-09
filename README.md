
# 🎓 Examify

**Examify** is an online university exam platform that allows examiners to create, manage, and grade exams, while students can view, attempt, and submit exams.

---

## 🛠️ Technologies Used

- **Backend**: Java, Spring Boot, Spring Security, Hibernate
- **Database**: MongoDB
- **API Security**: JWT Authentication, Role-Based Access Control (RBAC)
- **Frontend**: React JS
- **Containerization**: Docker, Docker Compose

---

## ✨ Features

### 👨‍🏫 Examiners

- Create, update, and delete exams.
- Add objective (MCQ/True-False) and subjective questions.
- Manually grade subjective answers and compute final scores.

### 👩‍🎓 Students

- View available exams.
- Attempt and submit exams.
- View results once grading is complete.

---

## 🚀 Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/nikts27/Examify.git
   cd Examify
   ```

2. Run the application using Docker:

   ```bash
   docker-compose up --build
   ```

3. The application will be available at:

   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api`
   - MongoDB: `mongodb://localhost:27017`

---

## 🧪 Running Tests

### Backend

```bash
cd backend
./mvnw test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

---