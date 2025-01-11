db = db.getSiblingDB('examify'); // Δημιουργία/επιλογή βάσης δεδομένων

// Προσθήκη συλλογής `users`
db.users.insertMany([
    {
        _id: ObjectId('67794f51cffbb83086590d3b'),
        fullName: 'Nikolaos Tsaridis',
        email: 'ics22089@uom.edu.gr',
        username: 'ics22089',
        password:
            '$2a$10$w76oqftA1hbbVxOKOCgP0O36TGkPIMxkACEqoikSy41dqHeO4rkJO',
        role: 'STUDENT',
        courses: ['CS101'],
        refreshToken: 'eyJhbGciOiJIUzUxMiJ9...',
        createdAt: ISODate('2025-01-04T15:10:09.027Z'),
        _class: 'gr.nikts27.examify.entity.User',
    },
    {
        _id: ObjectId('67794f51cffbb83086590d3c'),
        fullName: 'John Doe',
        email: 'johndoe@uom.edu.gr',
        username: 'johndoe',
        password:
            '$2a$10$h192FWL3.8VpsraFf6yc2eHud7Kn4Gp40TmukUEVkO6NiB.NhA.8q',
        role: 'PROFESSOR',
        courses: ['CS101'],
        refreshToken: 'eyJhbGciOiJIUzUxMiJ9...',
        createdAt: ISODate('2025-01-04T15:10:09.780Z'),
        _class: 'gr.nikts27.examify.entity.User',
    },
]);

// Προσθήκη συλλογής `course`
db.course.insertOne({
    _id: ObjectId('67795645b4461a367969bb45'),
    code: 'CS101',
    title: 'Introduction to Computer Science',
    professors: ['johndoe'],
    students: ['ics22089'],
    _class: 'gr.nikts27.examify.entity.Course',
});
