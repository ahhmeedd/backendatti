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
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: await bcrypt.hash('password', 12),
    position: 'President',
    quote: 'Leading with vision',
    photoURL: 'admin.jpg',
  });
  await admin.save();

  // Create sample adherents
  const adherents = await Adherent.insertMany([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Developer',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'john.jpg',
    },
    {
      firstName: 'Khal',
      lastName: 'Droguo',
      email: 'khal@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Tester',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'BoardMember',
      photoURL: 'khal.jpg',
    },
    {
      firstName: 'Johnson',
      lastName: 'Davinci',
      email: 'johnson@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'JSDeveloper',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'johnson.jpg',
    },
    {
      firstName: 'Pika',
      lastName: 'Kwarkz',
      email: 'pika@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Chef',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'pika.jpg',
    },
    {
      firstName: 'John',
      lastName: 'Snow',
      email: 'jsnow@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Student',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: false,
      role: 'Member',
      photoURL: 'snow.jpg',
    },
    {
      firstName: 'Alfred',
      lastName: 'Duckling',
      email: 'alfredoo@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Student',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'BoardMember',
      photoURL: 'alfred.jpg',
    },
    {
      firstName: 'Ahmed',
      lastName: 'Hajji',
      email: 'ahmed@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Tester',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'ahmed.jpg',
    },
    {
      firstName: 'Aziz',
      lastName: 'Abdessattar',
      email: 'aziz@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Teacher',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'aziz.jpg',
    },
    {
      firstName: 'Karima',
      lastName: 'Khadhraoui',
      email: 'karima@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Lawyer',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'BoardMember',
      photoURL: 'karima.jpg',
    },
    {
      firstName: 'Souad',
      lastName: 'Banneni',
      email: 'souad@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Teacher',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'souad.jpg',
    },
    {
      firstName: 'Alfred',
      lastName: 'Bmm',
      email: 'alfred@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Developer',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'alfredb.jpg',
    },
    {
      firstName: 'Ali',
      lastName: 'Ben Mansour',
      email: 'ali@example.com',
      birthDate: new Date('1990-01-01'),
      profession: 'Doctor',
      password: await bcrypt.hash('password123', 12),
      isAssociationMember: true,
      role: 'Member',
      photoURL: 'ali.jpg',
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