// seed.js (modified)
const Adherent = require('./models/Adherent');
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');
exports.seedDatabase = async () => {
  // Clear old data
  await Adherent.deleteMany({});
  await Event.deleteMany({});
  await Admin.deleteMany({});

  // Create admin
  const admin = new Admin({
    name: 'Admin',
    email: 'admin@atti.com',
    password: await bcrypt.hash('admin123', 12)
  });
  await admin.save();

  // Create sample adherents
  const adherents = await Adherent.insertMany([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'Developer',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'khal',
      lastName: 'Droguo',
      email: 'khal@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'tester',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'Johnson',
      lastName: 'davinci',
      email: 'johnson@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'JSDeveloper',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'pika',
      lastName: 'kwarkz',
      email: 'pika@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'chef',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'John',
      lastName: 'snow',
      email: 'jsnow@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'student',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'alfred',
      lastName: 'duckling',
      email: 'alfredoo@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'student',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'ahmed',
      lastName: 'hajji',
      email: 'ahmed@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'tester',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'aziz',
      lastName: 'abdessattar',
      email: 'aziz@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'teacher',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'karima',
      lastName: 'khadhraoui',
      email: 'karima@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'lawyer',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'souad',
      lastName: 'banneni',
      email: 'souad@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'teacher',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'alfred',
      lastName: 'bmm',
      email: 'alfred@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'Developer',
      password: await bcrypt.hash('password123', 12)
    },
    {
      firstName: 'ali',
      lastName: 'ben mansour',
      email: 'ali@example.com',
      birthdate: new Date(1990, 0, 1),
      telephone: '123456789',
      profession: 'Doctor',
      password: await bcrypt.hash('password123', 12)
    },
  ]);

  // Create sample events
  await Event.insertMany([
    {
      title: 'Tech Conference',
      description: 'Annual technology conference',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 17),
      maxParticipants: 100,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Java course',
      description: 'advanced java course by the greatest teacher',
      startDate: new Date(2024, 4, 18),
      endDate: new Date(2024, 5, 17),
      maxParticipants: 50,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'React course',
      description: 'beginner friendly course introduction to mern stack',
      startDate: new Date(2025, 2, 1),
      endDate: new Date(2025, 2, 20),
      maxParticipants: 100,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Dance competition',
      description: 'street dance competition',
      startDate: new Date(2025, 5, 15),
      endDate: new Date(2025, 5, 17),
      maxParticipants: 20,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Cinema video editing course',
      description: 'Annual technology conference',
      startDate: new Date(2025, 5, 15),
      endDate: new Date(2025, 6, 30),
      maxParticipants: 100,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'finance and taxs introduction',
      description: 'learn to make your taxes yourself',
      startDate: new Date(2025, 7, 22),
      endDate: new Date(2025, 10, 17),
      maxParticipants: 30,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
  ]);
};