// seed.js
const Adherent = require('./models/Adherent');
const Admin = require('./models/Admin');
const Event = require('./models/Event');
const bcrypt = require('bcrypt');

const password = 'admin123';  // Password you're testing with
const hash = '$2b$12$3AknySXWB8GIc/RcSjuf8uzsqp/Ck4D4lnFoqJv/npFxY.4HGcVS2';  // The hash retrieved from MongoDB

bcrypt.compare(password, hash, (err, res) => {
  console.log(res);  // Should log 'true' if the password matches
});

exports.seedDatabase = async () => {
  // Clear old data
  await Adherent.deleteMany({});
  await Event.deleteMany({});
  await Admin.deleteMany({});

  // Create admin
  const admin = new Admin({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@atti.com',
    password: await bcrypt.hash('admin123', 12),
    position: 'President',
    role: "admin",
    quote: 'Leading with vision',
    photoURL: 'admin.jpg',  
  });
  await admin.save();
  // Create admin
  const fatima = new Admin({
    firstName: 'fatima',
    lastName: 'zahra',
    email: 'fatima@atti.com',
    password: await bcrypt.hash('admin123', 12),
    role: "admin",
    position: 'Project manager',
    quote: 'Leading with vision',
    photoURL: 'admin.jpg',  
  });
  await fatima.save();
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
      photoURL: 'https://i.pravatar.cc/150?img=10',
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
      photoURL: 'https://i.pravatar.cc/150?img=11',
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
      photoURL: 'https://i.pravatar.cc/150?img=12',
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
      photoURL: 'https://i.pravatar.cc/150?img=13',
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
      photoURL: 'https://i.pravatar.cc/150?img=14',
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
      photoURL: 'https://i.pravatar.cc/150?img=15',
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
      photoURL: 'https://i.pravatar.cc/150?img=16',
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
      photoURL: 'https://i.pravatar.cc/150?img=17',
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
      photoURL: 'https://i.pravatar.cc/150?img=18',
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
      photoURL: 'https://i.pravatar.cc/150?img=19',
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
      photoURL: 'https://i.pravatar.cc/150?img=20',
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
      photoURL: 'https://i.pravatar.cc/150?img=21',
    },
  ]);

  // Create sample events
  await Event.insertMany([
    {
      title: 'Tech Conference',
      location: 'salle 402',
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
      location: 'salle conf',
      startDate: new Date(2024, 4, 18),
      endDate: new Date(2024, 5, 17),
      maxParticipants: 50,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'React course',
      description: 'beginner friendly course introduction to mern stack',
      location: 'atti building floor 4',
      startDate: new Date(2025, 2, 1),
      endDate: new Date(2025, 2, 20),
      maxParticipants: 100,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Dance competition',
      description: 'street dance competition',
      location: 'Gym, salle de gymnastique',
      startDate: new Date(2025, 5, 15),
      endDate: new Date(2025, 5, 17),
      maxParticipants: 20,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Cinema video editing course',
      description: 'Annual technology conference',
      location: 'Physics building',
      startDate: new Date(2025, 5, 15),
      endDate: new Date(2025, 6, 30),
      maxParticipants: 100,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
    {
      title: 'Finance and taxes introduction',
      description: 'Learn to make your taxes yourself',
      location: 'clubs floor, 4th building',
      startDate: new Date(2025, 7, 22),
      endDate: new Date(2025, 10, 17),
      maxParticipants: 30,
      poster: 'conference.jpg',
      participants: [adherents[0]._id]
    },
  ]);
};
