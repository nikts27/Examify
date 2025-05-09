
# 🎓 Examify

Το **Examify** είναι μια διαδικτυακή πλατφόρμα εξετάσεων που επιτρέπει στους εξεταστές να δημιουργούν, να διαχειρίζονται και να αξιολογούν εξετάσεις, ενώ παρέχει στους φοιτητές τη δυνατότητα να συμμετέχουν σε εξετάσεις και να βλέπουν τα αποτελέσματά τους.

---

## 🛠️ Τεχνολογίες

- **Backend**: Java, Spring Boot, Spring Security, Hibernate
- **Βάση Δεδομένων**: MongoDB
- **Ασφάλεια API**: JWT Authentication, Role-Based Access Control (RBAC)
- **Frontend**: React JS
- **Containerization**: Docker, Docker Compose

---

## ✨ Χαρακτηριστικά

### 👨‍🏫 Εξεταστές

- Δημιουργία, ενημέρωση και διαγραφή εξετάσεων.
- Προσθήκη αντικειμενικών (πολλαπλής επιλογής/Σωστό-Λάθος) και υποκειμενικών ερωτήσεων.
- Χειροκίνητη αξιολόγηση υποκειμενικών απαντήσεων και υπολογισμός τελικών βαθμολογιών.

### 👩‍🎓 Φοιτητές

- Προβολή διαθέσιμων εξετάσεων.
- Συμμετοχή και υποβολή εξετάσεων.
- Προβολή αποτελεσμάτων μετά την αξιολόγηση.

---

## 🚀 Οδηγίες Εκτέλεσης με Docker

### Προαπαιτούμενα

- Docker
- Docker Compose

### Βήματα

1. Κλωνοποίησε το αποθετήριο:

   ```bash
   git clone https://github.com/nikts27/Examify.git
   cd Examify
   ```

2. Εκτέλεσε την εφαρμογή:

   ```bash
   docker-compose up --build
   ```

3. Η εφαρμογή θα είναι διαθέσιμη στα εξής URLs:

   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api`
   - MongoDB (μέσω container): `mongodb://localhost:27017`

---

## 🧪 Δοκιμές

Για να εκτελέσεις τις δοκιμές τοπικά:

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

## 📄 Άδεια Χρήσης

Αυτό το έργο διανέμεται υπό την άδεια MIT.

---

## 🤝 Συνεισφορά

Οι συνεισφορές είναι ευπρόσδεκτες! Για να συνεισφέρεις:

1. Κάνε fork το αποθετήριο.
2. Δημιούργησε ένα νέο branch: `git checkout -b feature/YourFeature`
3. Κάνε commit τις αλλαγές σου: `git commit -m 'Προσθήκη νέου χαρακτηριστικού'`
4. Κάνε push το branch: `git push origin feature/YourFeature`
5. Άνοιξε ένα Pull Request.

---
