/**
 * Test fixtures for enrollment system
 * Contains realistic sample data for courses, students, and enrollment history
 */

export const students = [
  {
    id: 'st-001',
    name: 'Juan Pérez García',
    email: 'juan.perez@uagrm.edu.bo',
    enrollmentYear: 2022,
    totalCredits: 85,
    status: 'ACTIVE'
  },
  {
    id: 'st-002',
    name: 'María González López',
    email: 'maria.gonzalez@uagrm.edu.bo',
    enrollmentYear: 2023,
    totalCredits: 45,
    status: 'ACTIVE'
  },
  {
    id: 'st-003',
    name: 'Carlos Rodríguez Sánchez',
    email: 'carlos.rodriguez@uagrm.edu.bo',
    enrollmentYear: 2021,
    totalCredits: 120,
    status: 'ACTIVE'
  },
  {
    id: 'st-004',
    name: 'Ana Martínez Torres',
    email: 'ana.martinez@uagrm.edu.bo',
    enrollmentYear: 2023,
    totalCredits: 32,
    status: 'ACTIVE'
  },
  {
    id: 'st-005',
    name: 'Luis Fernández Ruiz',
    email: 'luis.fernandez@uagrm.edu.bo',
    enrollmentYear: 2022,
    totalCredits: 68,
    status: 'ACTIVE'
  }
];

export const courses = [
  {
    id: 'cs-101',
    code: 'CS-101',
    name: 'Programación I',
    credits: 8,
    capacity: 30,
    enrolledCount: 0,
    schedule: [
      { day: 'monday', startTime: '08:00', endTime: '10:00' },
      { day: 'wednesday', startTime: '08:00', endTime: '10:00' }
    ],
    prerequisites: []
  },
  {
    id: 'cs-201',
    code: 'CS-201',
    name: 'Programación II',
    credits: 8,
    capacity: 25,
    enrolledCount: 0,
    schedule: [
      { day: 'tuesday', startTime: '10:00', endTime: '12:00' },
      { day: 'thursday', startTime: '10:00', endTime: '12:00' }
    ],
    prerequisites: ['cs-101']
  },
  {
    id: 'cs-301',
    code: 'CS-301',
    name: 'Estructuras de Datos',
    credits: 8,
    capacity: 20,
    enrolledCount: 0,
    schedule: [
      { day: 'monday', startTime: '14:00', endTime: '16:00' },
      { day: 'wednesday', startTime: '14:00', endTime: '16:00' }
    ],
    prerequisites: ['cs-201']
  },
  {
    id: 'math-101',
    code: 'MATH-101',
    name: 'Cálculo I',
    credits: 6,
    capacity: 35,
    enrolledCount: 0,
    schedule: [
      { day: 'tuesday', startTime: '08:00', endTime: '10:00' },
      { day: 'thursday', startTime: '08:00', endTime: '10:00' }
    ],
    prerequisites: []
  },
  {
    id: 'math-201',
    code: 'MATH-201',
    name: 'Cálculo II',
    credits: 6,
    capacity: 30,
    enrolledCount: 0,
    schedule: [
      { day: 'monday', startTime: '10:00', endTime: '12:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '12:00' }
    ],
    prerequisites: ['math-101']
  },
  {
    id: 'physics-101',
    code: 'PHYS-101',
    name: 'Física I',
    credits: 6,
    capacity: 30,
    enrolledCount: 0,
    schedule: [
      { day: 'tuesday', startTime: '14:00', endTime: '16:00' },
      { day: 'thursday', startTime: '14:00', endTime: '16:00' }
    ],
    prerequisites: []
  },
  {
    id: 'db-101',
    code: 'DB-101',
    name: 'Bases de Datos',
    credits: 8,
    capacity: 25,
    enrolledCount: 0,
    schedule: [
      { day: 'monday', startTime: '16:00', endTime: '18:00' },
      { day: 'wednesday', startTime: '16:00', endTime: '18:00' }
    ],
    prerequisites: ['cs-201']
  },
  {
    id: 'web-101',
    code: 'WEB-101',
    name: 'Desarrollo Web',
    credits: 6,
    capacity: 20,
    enrolledCount: 0,
    schedule: [
      { day: 'friday', startTime: '08:00', endTime: '10:00' },
      { day: 'friday', startTime: '10:00', endTime: '12:00' }
    ],
    prerequisites: ['cs-201']
  },
  {
    id: 'mobile-101',
    code: 'MOB-101',
    name: 'Desarrollo Móvil',
    credits: 6,
    capacity: 20,
    enrolledCount: 0,
    schedule: [
      { day: 'friday', startTime: '14:00', endTime: '16:00' },
      { day: 'friday', startTime: '16:00', endTime: '18:00' }
    ],
    prerequisites: ['cs-201']
  },
  {
    id: 'networks-101',
    code: 'NET-101',
    name: 'Redes de Computadoras',
    credits: 6,
    capacity: 25,
    enrolledCount: 0,
    schedule: [
      { day: 'tuesday', startTime: '16:00', endTime: '18:00' },
      { day: 'thursday', startTime: '16:00', endTime: '18:00' }
    ],
    prerequisites: []
  }
];

export const studentHistory = [
  // Student 1 (Juan) - Good student, passed most courses
  {
    studentId: 'st-001',
    courseId: 'cs-101',
    semester: '2023-1',
    grade: 85,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-001',
    courseId: 'math-101',
    semester: '2023-1',
    grade: 78,
    status: 'APPROVED',
    credits: 6
  },
  {
    studentId: 'st-001',
    courseId: 'physics-101',
    semester: '2023-1',
    grade: 72,
    status: 'APPROVED',
    credits: 6
  },
  {
    studentId: 'st-001',
    courseId: 'cs-201',
    semester: '2023-2',
    grade: 88,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-001',
    courseId: 'math-201',
    semester: '2023-2',
    grade: 75,
    status: 'APPROVED',
    credits: 6
  },

  // Student 2 (María) - Mixed performance
  {
    studentId: 'st-002',
    courseId: 'cs-101',
    semester: '2023-2',
    grade: 70,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-002',
    courseId: 'math-101',
    semester: '2023-2',
    grade: 45,
    status: 'FAILED',
    credits: 0
  },
  {
    studentId: 'st-002',
    courseId: 'physics-101',
    semester: '2024-1',
    grade: 68,
    status: 'APPROVED',
    credits: 6
  },

  // Student 3 (Carlos) - Advanced student
  {
    studentId: 'st-003',
    courseId: 'cs-101',
    semester: '2022-1',
    grade: 90,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-003',
    courseId: 'cs-201',
    semester: '2022-2',
    grade: 92,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-003',
    courseId: 'cs-301',
    semester: '2023-1',
    grade: 87,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-003',
    courseId: 'db-101',
    semester: '2023-2',
    grade: 89,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-003',
    courseId: 'web-101',
    semester: '2024-1',
    grade: 91,
    status: 'APPROVED',
    credits: 6
  },

  // Student 4 (Ana) - Beginner
  {
    studentId: 'st-004',
    courseId: 'cs-101',
    semester: '2024-1',
    grade: 65,
    status: 'APPROVED',
    credits: 8
  },

  // Student 5 (Luis) - Good progress
  {
    studentId: 'st-005',
    courseId: 'cs-101',
    semester: '2023-1',
    grade: 80,
    status: 'APPROVED',
    credits: 8
  },
  {
    studentId: 'st-005',
    courseId: 'math-101',
    semester: '2023-1',
    grade: 82,
    status: 'APPROVED',
    credits: 6
  },
  {
    studentId: 'st-005',
    courseId: 'cs-201',
    semester: '2023-2',
    grade: 76,
    status: 'APPROVED',
    credits: 8
  }
];

/**
 * Helper function to get courses a student has completed
 */
export function getCompletedCourses(studentId) {
  return studentHistory
    .filter(h => h.studentId === studentId && h.status === 'APPROVED')
    .map(h => h.courseId);
}

/**
 * Helper function to check if student meets prerequisites
 */
export function meetsPrerequisites(studentId, courseId) {
  const course = courses.find(c => c.id === courseId);
  if (!course) return false;

  const completedCourses = getCompletedCourses(studentId);
  return course.prerequisites.every(prereq => completedCourses.includes(prereq));
}

/**
 * Helper function to get student's GPA
 */
export function getStudentGPA(studentId) {
  const grades = studentHistory
    .filter(h => h.studentId === studentId && h.status === 'APPROVED')
    .map(h => h.grade);

  if (grades.length === 0) return 0;

  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / grades.length) * 100) / 100;
}

/**
 * Helper function to seed database with fixtures
 */
export async function seedDatabase(db) {
  // Clear existing data
  await db.clearAll();

  // Create students
  for (const student of students) {
    await db.students.set(student.id, student);
  }

  // Create courses
  for (const course of courses) {
    await db.createCourse(course);
  }

  console.log(`Seeded database with ${students.length} students and ${courses.length} courses`);
}
